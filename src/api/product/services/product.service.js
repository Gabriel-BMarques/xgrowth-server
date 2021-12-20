const mongoose = require('mongoose');

exports.groupByCityAggregation = (req) => {
    let query = req.query || {};

    if (query.organization) query.organization = mongoose.Types.ObjectId(query.organization);

    let aggregation = [
        { $match: query },
        { $lookup: { from: 'plants', localField: 'plantId', foreignField: '_id', as: 'plantId' } },
        { $unwind: '$plantId' },
        { $lookup: { from: 'cities', localField: 'plantId.city', foreignField: '_id', as: 'city' } },
        { $unwind: '$city' },
        { $lookup: { from: 'countries', localField: 'plantId.country', foreignField: '_id', as: 'country' } },
        { $unwind: '$country' },
        {
            $group: {
                _id: '$plantId.city',
                country: { $first: '$country' },
                city: { $first: '$city' },
                products: { $push: '$$ROOT' }
            }
        },
    ];

    return aggregation;
}