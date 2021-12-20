const _ = require('lodash');
const vars = require('../../../config/vars');

/**
 * @private
 * @version version 1.0
 * @name authorizeRequest
 * @protected
 * 
 * This function will get all requests and check if x-api-key match with the API_KEY defined on .env file
 */

exports.authorizeRequest = (req, res, next) => {
    if (!_.isEqual(req.headers['x-api-key'], vars.API_KEY))
        res.sendStatus(403);
    else
        return next();
}