const express = require('express');
const validate = require('express-validation');
const controller = require('../../../profile/controller/profile.controller');
const userController = require('../../../user/controllers/user.controller');
const { authorize } = require('../../../authentication/middleware/auth');

const {
  createClientProfile,
  updateClientProfile,
} = require('../../../profile/validation/profile.validation');

const router = express.Router();

/**
 * Load user when API with userId route parameter is hit
 */
router.param('userId', userController.load);

router
  .route('/')
  /**
   * @api {get} v1/client-profile Get ClientProfile
   * @apiDescription Get Client Profile information
   * @apiVersion 1.0.0
   * @apiName GetClientProfile
   * @apiGroup ClientProfile
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object}   ClientProfile        Client Profile
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     ClientProfile does not exist
   */
  .get(authorize(), controller.getByUserId)
  /**
   * @api {post} v1/client-profile Create Client Profile
   * @apiDescription Create a new Client Profile
   * @apiVersion 1.0.0
   * @apiName CreateClientProfile
   * @apiGroup ClientProfile
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiParam  {Object}                 object   Client Profile object
   *
   * @apiSuccess (Created 201) {Object}  ClientProfile        Client Profile
   *
   * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   */
  .post(authorize(), validate(createClientProfile), controller.create)
  /**
   * @api {put} v1/client-profile Update Client Profile
   * @apiDescription Update a Client Profile
   * @apiVersion 1.0.0
   * @apiName UpdateClientProfile
   * @apiGroup ClientProfile
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiParam  {String}                 _id              Client Profile id
   * @apiParam  {Object}                 ClientProfile   Client Profile object
   *
   * @apiSuccess {String}   _id        Client Profile id
   *
   * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     ClientProfile does not exist
   */
  .put(authorize(), validate(updateClientProfile), controller.update);

router
  .route('/:id')
  /**
   * @api {get} v1/client-profile/:id Get ClientProfile
   * @apiDescription Get Client Profile information
   * @apiVersion 1.0.0
   * @apiName GetClientProfile
   * @apiGroup ClientProfile
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object}   ClientProfile        Client Profile
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     ClientProfile does not exist
   */
  .get(authorize(), controller.get);

router
  .route('/public/all')
  /**
   * @api {get} v1/client-profile/:id List ClientProfile
   * @apiDescription List Client Profile information
   * @apiVersion 1.0.0
   * @apiName ListClientProfile
   * @apiGroup ClientProfile
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object}   ClientProfile        Client Profile
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     ClientProfile does not exist
   */
  .get(authorize(), controller.list);

router
  .route('/current-user/domain')
  /**
   * @api {get} v1/client-profile/current-user/domain Get ClientProfile by current user domain
   * @apiDescription Get Client Profile information by current user domain
   * @apiVersion 1.0.0
   * @apiName GetClientProfileByCurrentUserDomain
   * @apiGroup ClientProfile
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object}   ClientProfile        Client Profile
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     ClientProfile does not exist
   */
  .get(authorize(), controller.listByCurrentUserDomain);

module.exports = router;
