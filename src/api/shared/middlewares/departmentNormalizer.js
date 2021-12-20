const _ = require('lodash');
const Department = require('../../user/model/department.model');
const User = require('../../user/model/user.model');

exports.updateUsers = async (req, res, next) => {
    const oldEntity = await Department.findById(req.body._id);
    const newEntity = req.body;
    const otherValuesChanges = _.difference(newEntity.otherValues, oldEntity.otherValues);
    if (otherValuesChanges.length)
        await User.updateMany(
            { department: { $in: otherValuesChanges } },
            [
                { $set: { unnormalizedDepartment: '$department' } },
                { $set: { department: newEntity.name } }
            ]
        );
    else 
        return next();

    return next();
}

exports.normalizeDepartment = async () => {
    // Do something
}