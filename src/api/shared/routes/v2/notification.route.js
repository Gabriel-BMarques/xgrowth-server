const express = require('express');
const validate = require('express-validation');
const controller = require('../../../notification/controller/notification.controller');
const userController = require('../../../user/controllers/user.controller');
const { authorize } = require('../../../authentication/middleware/auth');

const {
  createNotification,
  updateNotification,
} = require('../../../notification/validation/notification.validation');

const router = express.Router();

/**
 * Load user when API with userId route parameter is hit
 */
router.param('userId', userController.load);

router
  .route('/list/:id')
  /**
   * @api {get} v1/notification List Notifications
   * @apiDescription List Notifications information
   * @apiVersion 1.0.0
   * @apiName GetNotification
   * @apiGroup Notification
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object}   Notification        Notification
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     Notification does not exist
   */
  .get(authorize(), controller.listByReceiverId);

router
  .route('/')
  /**
   * @api {post} v1/notification Create Notification
   * @apiDescription Create a new Notification
   * @apiVersion 1.0.0
   * @apiName createNotification
   * @apiGroup Notification
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiParam  {Object}                 object   Notification object
   *
   * @apiSuccess (Created 201) {Object}  Notification        Notification
   *
   * @apiError (Bad Notification 400)   ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   */
  .post(authorize(), controller.create)
  /**
   * @api {put} v1/notification Update Notification
   * @apiDescription Update a Notification
   * @apiVersion 1.0.0
   * @apiName updateNotification
   * @apiGroup Notification
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiParam  {String}                 _id       Notification id
   * @apiParam  {Object}                 Notification     Notification object
   *
   * @apiSuccess {String}   _id        Notification id
   *
   * @apiError (Bad Notification 400)  ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     Notification does not exist
   */
  .put(authorize(), validate(updateNotification), controller.update)

router
  .route('/all')
  /**
   * @api {get} v1/notification/all List Notifications
   * @apiDescription List Notifications information
   * @apiVersion 1.0.0
   * @apiName ListAllNotifications
   * @apiGroup Notification
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object}   Notification        Notification
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     Notification does not exist
   */
  .get(authorize(), controller.list);

router
  .route('/:id')
  /**
   * @api {get} v1/notification/:id Get Notification
   * @apiDescription Get Notification information
   * @apiVersion 1.0.0
   * @apiName GetNotification
   * @apiGroup Notification
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object}   Notification        Notification
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     Notification does not exist
   */
  .get(authorize(), controller.get)
  /**
   * @api {get} v1/notification/:id Delete Notification
   * @apiDescription Delete campaign category information
   * @apiVersion 1.0.0
   * @apiName DeleteNotification
   * @apiGroup Notification
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess (No Content 204)  Successfully deleted
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     Notification does not exist
   */
  .delete(authorize(), controller.remove);

module.exports = router;
