const express = require('express');
const controller = require('../../controllers/search.controller');
const { authorize } = require('../../../authentication/middleware/auth');

const router = express.Router();

router
  .route('/')
/**
 * @api {get} v1/search Search suppliers and lines
 * @apiDescription Suppliers ands Lines information
 * @apiVersion 1.0.0
 * @apiName SearchSuppliersAndLines
 * @apiGroup Search
 * @apiPermission User
 *
 * @apiHeader {String} Authorization  User's access token
 *
 * @apiSuccess {Object}   Object        object
 *
 * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
 * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
 * @apiError (Not Found 404)    NotFound     Object does not exist
 */
  .get(authorize(), controller.search);

module.exports = router;
