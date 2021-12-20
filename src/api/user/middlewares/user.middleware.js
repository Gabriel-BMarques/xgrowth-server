const httpStatus = require('http-status');
const _ = require('lodash');

function organizationMandatoryCompleted(entity) {
    const completeCondition = 
        entity?.skills?.length > 0 &&
        entity?.segments?.length > 0 &&
        entity?.subSegments?.length > 0 && 
        entity?.organizationReach?.length > 0 &&
        (!_.isNil(entity.organizationType) && !(entity.organizationType?.name === 'Supply' && !_.isNil(entity.subType)));

  return completeCondition;
}

/**
 * Check if user can view briefs in platform
 * @public
 * @version 2.0.0
 */
exports.checkBriefVisualizationPermissions = async (req, res, next) => {
    try {
        if (req.body.organization) {
            const limitCreationDate = new Date('2021/05/05').toISOString();
            const organizationCreationDate = new Date(req.body.organization.createdAt).toISOString();
            const isCreatedAfterUpdate = organizationCreationDate > limitCreationDate;
            req.body.canRespondBrief = !isCreatedAfterUpdate || organizationMandatoryCompleted(req.body.organization) || req.body.role === 'admin';
        } else {
            req.body.canRespondBrief = false;
        }
        res.status(httpStatus.OK);
        res.json(req.body.transform());
    } catch (error) {
        return next(error);
    }
}