const Plant = require('../../plant/models/plant.model');
const mongoose = require('mongoose');
const _ = require('lodash');


/**
 * This function will get the organizations ids to be filtered in the query
 * @param {*} filter 
 * @returns organizations ids
 */
async function getIds(filter) {
    try {
        let organizationsIds = [];

        if (filter.lineLocation)
            organizationsIds.concat((await Plant
                .find({ country: { $in: filter.lineLocation } }, { organization: 1 }))
                .map((p) => p.organization));

        return organizationsIds;
    } catch (error) {
        console.log(error);
    }
}

exports.solversPageProjection = {
    name: 1,
    skills: 1,
    segments: 1,
    subSegments: 1,
    certifications: 1,
    organizationReach: 1,
    logo: 1,
    subType: 1,
    whoWeAre: 1,
    numberOfPosts: 1,
    products: 1,
    createdAt: 1,
  }

exports.getSort = (sortType) => {
    console.log(sortType);
    if (!sortType) return { name: 1 };

    switch(sortType) {
        case 'A - Z':
            return { name: 1 };
        case 'Z - A':
            return { name: -1 };
        case 'Number of posts':
            return { numberOfPosts: -1 };
        case 'Last added to XGrowth':
            return { createdAt: -1 };
        default:
            break;
    }
}

exports.getLookupQuery = (from, localField, foreignField, as) => {
    return { from, localField, foreignField, as }
}

exports.getFilterQuery = async (req) => {
    let filter = req.query;
    if (_.isEmpty(filter)) return {};

    let _id = { $in: (await getIds(filter)) };
    let segments = { $in: [].concat(filter.segments || [])?.map((s) => mongoose.Types.ObjectId(s)) };
    let organizationReach = { $in: [].concat(filter.organizationReach || [])?.map((or) => mongoose.Types.ObjectId(or)) };
    let certifications = { $in: [].concat(filter.certifications || [])?.map((c) => mongoose.Types.ObjectId(c)) };
    let organizationType = { $in: [].concat(filter.organizationType || [])?.map((ot) => mongoose.Types.ObjectId(ot)) };
    let subType = { $in: [].concat(filter.subType || [])?.map((st) => mongoose.Types.ObjectId(st)) };

    let filterQuery = { _id, segments, organizationReach, certifications, organizationType, subType};

    /**
     * This code will remove empty filter fields and convert strings to ObjectIds
     */
    Object.keys(filterQuery).forEach((key) => {
        let isArrayQuery = typeof filterQuery[key] === 'object' && filterQuery[key]?.hasOwnProperty('$in');
        let isEmpty = isArrayQuery ? _.isEmpty(filterQuery[key].$in) : _.isEmpty(filterQuery[key]);
        if (isEmpty) delete filterQuery[key];
    });

    return filterQuery;
}

exports.getSearchQuery = async (searchParam) => {
    if (!searchParam) return {};

    const searchQuery = { name: { $regex: searchParam, $options: 'i' } }

    return searchQuery;
}