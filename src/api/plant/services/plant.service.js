const mongoose = require('mongoose');
const { omit } = require('lodash');

exports.groupByCityAggregation = (req) => {
    let query = req.query;

    if (query.organization) query.organization = mongoose.Types.ObjectId(query.organization);

    let aggregation = [
        { $match: query },
        { $lookup: { from: 'products', localField: '_id', foreignField: 'plantId', as: 'products' } },
        {
            $addFields: {
                products: '$products',
            }
        },
        {
            $group: {
                _id: '$city',
                plants: { $push: '$$ROOT' },
            }
        },
        {
            $project: {
                plants: 1
            }
        },
    ];

    return aggregation;
};

exports.listFullStructureAggregation = (req) => {
    let query = omit(req.query, ['page', 'perPage']);
    let perPage= parseInt(req.query.perPage, 10) || Number.MAX_SAFE_INTEGER;
    let page = parseInt(req.query.page, 10) || 1;

    if (query.organization) query.organization = mongoose.Types.ObjectId(query.organization);

    let aggregation = [
        { $sort: { createdAt: -1 } },
        { $match: query },
        { $skip: page > 0 ? (page - 1) * perPage : 0 },
        { $limit: perPage },
        { $lookup: { from: 'cities', localField: 'city', foreignField: '_id', as: 'city' } },
        { $unwind: { path: '$city', preserveNullAndEmptyArrays: true } },
        { $lookup: { from: 'countries', localField: 'country', foreignField: '_id', as: 'country' } },
        { $unwind: { path: '$country', preserveNullAndEmptyArrays: true } },
        { $lookup: { from: 'stateprovinces', localField: 'stateProvinceRegion', foreignField: '_id', as: 'stateProvinceRegion' } },
        { $unwind: { path: '$stateProvinceRegion', preserveNullAndEmptyArrays: true } },
        {
            $lookup: {
                from: 'lines',
                let: { plant: '$_id' },
                pipeline: [
                    { $match: { $expr: { $eq: ['$plantId', '$$plant'] } } },
                    {
                        $lookup: {
                            from: 'products',
                            let: { line: '$_id' },
                            pipeline: [
                                { $match: { $expr: { $eq: ['$lineId', '$$line'] } } },
                                {
                                    $project: {
                                        _id: 1,
                                        name: 1,
                                        uploadedFiles: 1,
                                        salesMarket: 1
                                    }
                                }
                            ],
                            as: 'products'
                        }
                    },
                    {
                        $project: {
                            _id: 1,
                            name: 1,
                            products: 1,
                        }
                    },
                    {
                        $addFields: {
                            productsTruncated: true
                        }
                    }
                ],
                as: 'lines'
            }
        },
        {
            $project: {
                _id: 1,
                name: 1,
                country: 1,
                city: 1,
                stateProvinceRegion: 1,
                address: 1,
                contact: 1,
                lines: 1
            }
        },
    ];

    return aggregation;
}