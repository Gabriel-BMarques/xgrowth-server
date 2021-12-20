const httpStatus = require('http-status');

exports.checkOrganizationPermissions = async (req, res, next) => {
    const entity = req.body;
    entity.canEdit = (req.user.organization.toString() === entity._id.toString()) || req.user.role === 'admin';
    
    res.status(httpStatus.OK);
    res.json(entity);
};