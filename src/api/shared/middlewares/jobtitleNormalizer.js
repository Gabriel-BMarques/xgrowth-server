const JobTitle = require('../../user/model/jobTitle.model');
const User = require('../../user/model/user.model');
const _ = require('lodash');

exports.updateUsers = async (req, res, next) => {
    const oldEntity = await JobTitle.findById(req.body._id);
    const newEntity = req.body;
    const otherValuesChanges = _.difference(newEntity.otherValues, oldEntity.otherValues);
    if (otherValuesChanges.length)
        await User.updateMany(
            { jobTitle: { $in: otherValuesChanges } },
            [
                { $set: { unnormalizedJobTitle: '$jobTitle' } },
                { $set: { jobTitle: newEntity.name } }
            ]
        );
    else 
        return next();

    return next();
}



exports.normalizeJobTitle = async () => {
    // Do something
}