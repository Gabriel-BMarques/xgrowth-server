/* eslint-disable max-len */
const express = require('express');
const controller = require('../../controllers/companyType.controller');
const userController = require('../../../user/controllers/user.controller');
const { authorize } = require('../../../authentication/middleware/auth');

const router = express.Router();

/**
 * Load user when API with userId route parameter is hit
 */
router.param('userId', userController.load);

router
  .route('/')
  /**
   * @api {post} v1/companyType Create companyType
   * @apiDescription Create a new companyType
   * @apiVersion 1.0.0
   * @apiName CreatecompanyType
   * @apiGroup companyType
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiParam  {Object}                 object   companyType object
   *
   * @apiSuccess (Created 201) {Object}  companyType        companyType
   *
   * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   */
  .post(authorize(), controller.create)
  /**
   * @api {put} v1/companyType Update companyType
   * @apiDescription Update a companyType
   * @apiVersion 1.0.0
   * @apiName UpdatecompanyType
   * @apiGroup companyType
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiParam  {String}                 _id              companyType id
   * @apiParam  {Object}                 companyType   companyType object
   *
   * @apiSuccess {String}   _id        companyType id
   *
   * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     companyType does not exist
   */
  .put(authorize(), controller.update)
  /**
   * @api {put} v1/companyType Update companyType
   * @apiDescription Update a companyType
   * @apiVersion 1.0.0
   * @apiName UpdatecompanyType
   * @apiGroup companyType
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiParam  {String}                 _id              companyType id
   * @apiParam  {Object}                 companyType   companyType object
   *
   * @apiSuccess {String}   _id        companyType id
   *
   * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     companyType does not exist
   */
  .get(authorize(), controller.list)

router
  .route('/all')
  /**
   * @api {get} v1/companyType/suppliers/all List All companyType with optional filter
   * @apiDescription List All companyType  information with optional filter
   * @apiVersion 1.0.0
   * @apiName ListAllcompanyType
   * @apiGroup companyType
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object}   companyType        companyType
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     companyType does not exist
   */
  .get(authorize(), controller.list);

router
  .route('/:id')
    /**
   * @api {delete} v1/companyType Delete companyType
   * @apiDescription Delete a companyType
   * @apiVersion 1.0.0
   * @apiName Delete companyType
   * @apiGroup companyType
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiParam  {String}                 _id              companyType id
   * @apiParam  {Object}                 companyType   companyType object
   *
   * @apiSuccess {String}   _id        companyType id
   *
   * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     companyType does not exist
   */
  .delete(authorize(), controller.remove);

module.exports = router;
