const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/invite.controller');
const userController = require('../../../user/controllers/user.controller');
const { authorize } = require('../../../authentication/middleware/auth');

const {
  createInvite,
  updateInvite,
} = require('../../validations/invite.validation');

const router = express.Router();

/**
 * Load user when API with userId route parameter is hit
 */
router.param('userId', userController.load);

router
  .route('/')
  /**
   * @api {get} v1/invite List Invites
   * @apiDescription List Invites information
   * @apiVersion 1.0.0
   * @apiName GetInvite
   * @apiGroup Invite
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object}   Invite        Invite
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     Invite does not exist
   */
  .get(authorize(), controller.listByCurrentUserDomain)
  /**
   * @api {post} v1/invite Create Invite
   * @apiDescription Create a new Invite
   * @apiVersion 1.0.0
   * @apiName createInvite
   * @apiGroup Invite
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiParam  {Object}                 object   Invite object
   *
   * @apiSuccess (Created 201) {Object}  Invite        Invite
   *
   * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   */
  .post(authorize(), validate(createInvite), controller.create)
  /**
   * @api {put} v1/invite Update Invite
   * @apiDescription Update a Invite
   * @apiVersion 1.0.0
   * @apiName updateInvite
   * @apiGroup Invite
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
  * @apiParam  {String}                 _id       Invite id
   * @apiParam  {Object}                 Invite     Invite object
   *
   * @apiSuccess {String}   _id        Invite id
   *
   * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     Invite does not exist
   */
  .put(authorize(), validate(updateInvite), controller.update);

router
  .route('/all')
  /**
   * @api {get} v1/invite/all List Invites
   * @apiDescription List Invites information
   * @apiVersion 1.0.0
   * @apiName ListAllInvites
   * @apiGroup Invite
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object}   Invite        Invite
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     Invite does not exist
   */
  .get(authorize(), controller.list);

router
  .route('/current-user/pending')
  /**
   * @api {get} v1/invite/current-user/pending Get current user pending invite
   * @apiDescription Get current user pending invite
   * @apiVersion 1.0.0
   * @apiName GetPendingInvite
   * @apiGroup Invite
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object}   Invite        Invite
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     Invite does not exist
   */
  .get(authorize(), controller.getCurrentUserPendingInvite);

router
  .route('/:id')
  /**
   * @api {get} v1/invite/:id Get Invite
   * @apiDescription Get Invite information
   * @apiVersion 1.0.0
   * @apiName GetInvite
   * @apiGroup Invite
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object}   Invite        Invite
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     Invite does not exist
   */
  .get(authorize(), controller.get)
  /**
   * @api {get} v1/invite/:id Delete Invite
   * @apiDescription Delete campaign category information
   * @apiVersion 1.0.0
   * @apiName DeleteInvite
   * @apiGroup Invite
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess (No Content 204)  Successfully deleted
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     Invite does not exist
   */
  .delete(authorize(), controller.remove);

module.exports = router;
