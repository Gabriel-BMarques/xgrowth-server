const mongoose = require('mongoose');

exports.listByOrganizationAggregation = (req) => {
    let organizationId = mongoose.Types.ObjectId(req.params.id);

    let lookups = [
        { $lookup: { from: 'users', localField: 'createdBy', foreignField: '_id', as: 'createdBy' } },
        { $unwind: { path: '$createdBy', preserveNullAndEmptyArrays: true } },
        { $lookup: { from: 'companyprofiles', localField: 'createdBy.company', foreignField: '_id', as: 'createdBy.company' } },
        { $unwind: { path: '$createdBy.company', preserveNullAndEmptyArrays: true } },
        { $lookup: { from: 'organizations', localField: 'createdBy.company.organization', foreignField: '_id', as: 'createdBy.company.organization' } },
        { $unwind: { path: '$createdBy.company.organization', preserveNullAndEmptyArrays: true } }
    ];

    let match = { 'createdBy.company.organization._id': organizationId };

    let projection = {
        _id: 1,
        title: 1,
        description: 1,
        uploadedFiles: 1,
        reviewStatus: 1,
        eventDuration: 1,
        meetingLink: 1,
        eventDate: 1,
        eventTimeZone: 1,
        eventEndDate: 1,
        createdBy: 1
    };

    let sort = { createdAt: -1 };

    let aggregation = [
        ...lookups,
        { $sort: sort },
        { $match: match },
        { $project: projection },
    ];

    return aggregation;
}