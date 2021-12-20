const mongoose = require('mongoose');

exports.listInvitationsAggregation = (req) => {
    let query = req.query || {};

    let defaultQuery = {
        invitedUserId: mongoose.Types.ObjectId(req.user._id),
        status: { $not: /pending approval/ },
    };

    // Convert 12 byte strings to object id and convert date strings into date
    Object.entries(query).forEach(([key]) => {
        if (mongoose.Types.ObjectId.isValid(query[key])) query[key] = mongoose.Types.ObjectId(query[key]);
        if (key === 'webinarId.eventDate') {
            query[key] = JSON.parse(query[key]);
            query[key].$gte = new Date(query[key].$gte);
        };
    });

    let lookups = [
        { $lookup: { from: 'webinars', localField: 'webinarId', foreignField: '_id', as: 'webinarId' } },
        { $unwind: '$webinarId' },
        {
            $lookup: {
                from: 'users',
                let: { userId : '$webinarId.createdBy' },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: ['$_id', '$$userId']
                            }
                        }
                    },
                    { $project: { company: 1 } }
                ],
                as: 'webinarId.createdBy'
            }
        },
        { $unwind: { path: '$webinarId.createdBy', preserveNullAndEmptyArrays: true } },
        {
            $lookup: {
                from: 'companyprofiles',
                let: { companyId : '$webinarId.createdBy.company' },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: ['$_id', '$$companyId']
                            }
                        }
                    },
                    { $project: { organization: 1 } }
                ],
                as: 'webinarId.createdBy.company'
            }
        },
        { $unwind: { path: '$webinarId.createdBy.company', preserveNullAndEmptyArrays: true } },
        {
            $lookup: {
                from: 'organizations',
                let: { organizationId : '$webinarId.createdBy.company.organization' },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: ['$_id', '$$organizationId']
                            }
                        }
                    },
                    { $project: { name: 1, logo: 1 } }
                ],
                as: 'webinarId.createdBy.company.organization'
            }
        },
        { $unwind: { path: '$webinarId.createdBy.company.organization', preserveNullAndEmptyArrays: true } },
    ];

    let projection = {
        $project: {
            _id: 1,
            status: 1,
            invitedUserId: 1,
            webinarId: 1,
            createdAt: 1
        }
    };

    let aggregation = [
        { $match: defaultQuery },
        ...lookups,
        { $match: query },
        projection
    ];

    return aggregation;
};