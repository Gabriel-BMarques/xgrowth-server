/* eslint-disable max-len */
const express = require('express');
const controller = require('../../controllers/webinarInvitation.controller');
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
   * @api {post} v1/businessUnit Create businessUnit
   * @apiDescription Create a new businessUnit
   * @apiVersion 1.0.0
   * @apiName CreatebusinessUnit
   * @apiGroup businessUnit
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiParam  {Object}                 object   businessUnit object
   *
   * @apiSuccess (Created 201) {Object}  businessUnit        businessUnit
   *
   * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   */
  .post(authorize(), controller.create)
  /**
   * @api {put} v1/businessUnit Update businessUnit
   * @apiDescription Update a businessUnit
   * @apiVersion 1.0.0
   * @apiName UpdatebusinessUnit
   * @apiGroup businessUnit
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiParam  {String}                 _id              businessUnit id
   * @apiParam  {Object}                 businessUnit   businessUnit object
   *
   * @apiSuccess {String}   _id        businessUnit id
   *
   * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     businessUnit does not exist
   */
  .put(authorize(), controller.update)
  /**
   * @api {put} v1/businessUnit Update businessUnit
   * @apiDescription Update a businessUnit
   * @apiVersion 1.0.0
   * @apiName UpdatebusinessUnit
   * @apiGroup businessUnit
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiParam  {String}                 _id              businessUnit id
   * @apiParam  {Object}                 businessUnit   businessUnit object
   *
   * @apiSuccess {String}   _id        businessUnit id
   *
   * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     businessUnit does not exist
   */
  .get(authorize(), controller.list)

router
  .route('/all')
  /**
   * @api {get} v1/businessUnit/suppliers/all List All businessUnit with optional filter
   * @apiDescription List All businessUnit  information with optional filter
   * @apiVersion 1.0.0
   * @apiName ListAllbusinessUnit
   * @apiGroup businessUnit
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object}   businessUnit        businessUnit
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     businessUnit does not exist
   */
  .get(authorize(), controller.list);

router
  .route('/:id')
    /**
   * @api {delete} v1/businessUnit Delete businessUnit
   * @apiDescription Delete a businessUnit
   * @apiVersion 1.0.0
   * @apiName Delete businessUnit
   * @apiGroup businessUnit
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiParam  {String}                 _id              businessUnit id
   * @apiParam  {Object}                 businessUnit   businessUnit object
   *
   * @apiSuccess {String}   _id        businessUnit id
   *
   * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     businessUnit does not exist
   */
  .delete(authorize(), controller.remove);

router
  .route('/populated')
  .get(authorize(), controller.listPopulated);

router
  .route('/logged')
  .get(authorize(), controller.loggedUserInvitations);

module.exports = router;
