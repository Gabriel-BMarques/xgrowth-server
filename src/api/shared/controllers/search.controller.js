const httpStatus = require('http-status');
const { omit } = require('lodash');
const Line = require('../../line/models/line.model');
const Listing = require('../../listing/model/listing.model');
const Plant = require('../../plant/models/plant.model');
const CompanyProfile = require('../../company-profile/model/companyProfile.model');

/**
 * List Lines
 * @public
 */
exports.search = async (req, res, next) => {
  try {
    const fieldsToOmit = [
      'annualReportsBase64',
      'institutionalPresentationBase64',
      'createdAt',
      'updatedAt',
      '__v',
    ];

    let query = {};
    if (req.query.companyProfileId) {
      query = req.query;
    } else {
      query = { $text: { $search: req.query.text } };
    }

    const result = {
      listings: [],
      listingIds: [],
      lines: [],
      lineIds: [],
      plants: [],
      plantIds: [],
      companyProfiles: [],
      companyProfileIds: [],
    };

    const listings = await Listing.find(query);

    if (listings && listings.length > 0) {
      for (let index = 0; index < listings.length; index += 1) {
        const element = listings[index];

        result.listingIds.push(element._id);
        result.listings.push(element);

        if (result.lineIds.indexOf(element.lineId) === -1) {
          const line = await Line.findById(element.lineId);
          result.lineIds.push(line._id);
          result.lines.push(line);
        }

        if (result.companyProfileIds.indexOf(element.companyProfileId.toString()) === -1) {
          const supplier = await CompanyProfile.findById(element.companyProfileId);
          result.companyProfileIds.push(supplier._id.toString());
          result.companyProfiles.push(omit(supplier.toObject(), fieldsToOmit));
        }
      }
    }

    let lines = [];

    if (result.lineIds.length > 0) {
      const newQuery = { $and: [query, { _id: { $nin: result.lineIds } }] };
      lines = await Line.find(newQuery);
    } else {
      lines = await Line.find(query);
    }

    if (lines && lines.length > 0) {
      for (let index = 0; index < lines.length; index += 1) {
        const element = lines[index];

        result.lineIds.push(element._id);
        result.lines.push(element);

        // if (result.companyProfileIds.indexOf(element.companyProfileId.toString()) === -1) {
        //     const supplier = await CompanyProfile.findById(element.companyProfileId);
        //     result.companyProfileIds.push(supplier._id.toString());
        //     result.companyProfiles.push(omit(supplier.toObject(), fieldsToOmit));
        // }
      }
    }

    const plants = await Plant.find(query);

    if (plants && plants.length > 0) {
      for (let index = 0; index < plants.length; index += 1) {
        const element = plants[index];

        if (result.plantIds.indexOf(element._id) === -1) {
          result.plantIds.push(element._id);
          result.plants.push(element);
        }

        if (result.companyProfileIds.indexOf(element.companyProfileId.toString()) === -1) {
          const supplier = await CompanyProfile.findById(element.companyProfileId);
          result.companyProfileIds.push(supplier._id.toString());
          result.companyProfiles.push(omit(supplier.toObject(), fieldsToOmit));
        }
      }
    }

    const companyProfiles = await CompanyProfile.find(query);

    if (companyProfiles && companyProfiles.length > 0) {
      for (let index = 0; index < companyProfiles.length; index += 1) {
        const element = companyProfiles[index];

        if (result.companyProfileIds.indexOf(element._id.toString()) === -1) {
          result.companyProfileIds.push(element._id.toString());
          result.companyProfiles.push(omit(element.toObject(), fieldsToOmit));
        }

        let newQuery = {};
        if (result.lineIds.length > 0) {
          newQuery =
            { $and: [{ companyProfileId: element._id }, { _id: { $nin: result.lineIds } }] };
        } else {
          newQuery = { companyProfileId: element._id.toString() };
        }

        const lin = await Line.find(newQuery);

        for (let j = 0; j < lin.length; j += 1) {
          const line = lin[j];
          result.lineIds.push(line._id);
          result.lines.push(line);
        }
      }
    }

    res.status(httpStatus.OK);
    res.json(result);
  } catch (error) {
    return next(error);
  }
};
