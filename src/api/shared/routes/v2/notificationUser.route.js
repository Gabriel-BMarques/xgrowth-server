const express = require('express');
const validate = require('express-validation');
const controller = require('../../../notification-user/controller/notificationUser.controller');
const userController = require('../../../user/controllers/user.controller');
const { authorize } = require('../../../authentication/middleware/auth');

const {
  createNotificationUser,
  updateNotificationUser,
} = require('../../../notification-user/validation/notificationUser.validation');

const router = express.Router();

/**
 * Load user when API with userId route parameter is hit
 */
router.param('userId', userController.load);

router
  .route('/')
  /**
   * @api {get} v1/notification-user List NotificationUser
   * @apiDescription List NotificationUser information
   * @apiVersion 1.0.0
   * @apiName GetNotificationUser
   * @apiGroup NotificationUser
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object}   Notification        NotificationUser
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     NotificationUser does not exist
   */
  .get(authorize(), controller.listByUserId)
  /**
   * @api {post} v1/notification-user Create NotificationUser
   * @apiDescription Create a new NotificationUser
   * @apiVersion 1.0.0
   * @apiName createNotificationUser
   * @apiGroup NotificationUser
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiParam  {Object}                 object   Notification object
   *
   * @apiSuccess (Created 201) {Object}  NotificationUser        NotificationUser
   *
   * @apiError (Bad Notification 400)   ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   */
  .post(authorize(), validate(createNotificationUser), controller.create)
  /**
   * @api {put} v1/notification-user Update NotificationUser
   * @apiDescription Update a NotificationUser
   * @apiVersion 1.0.0
   * @apiName updateNotificationUser
   * @apiGroup NotificationUser
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
  * @apiParam  {String}                 _id       NotificationUser id
   * @apiParam  {Object}                 NotificationUser     NotificationUser object
   *
   * @apiSuccess {String}   _id        NotificationUser id
   *
   * @apiError (Bad Notification 400)  ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     Notification does not exist
   */
  .put(authorize(), validate(updateNotificationUser), controller.update);

router
  .route('/all')
  /**
   * @api {get} v1/notification-user/all List NotificationUser
   * @apiDescription List NotificationUser information
   * @apiVersion 1.0.0
   * @apiName ListAllNotificationUser
   * @apiGroup NotificationUser
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object}   NotificationUser        NotificationUser
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     NotificationUser does not exist
   */
  .get(authorize(), controller.list);

router
  .route('/read-all')
  /**
   * @api {put} v1/notification-user/read-all read All User NotificationUser
   * @apiDescription read All User NotificationUser
   * @apiVersion 1.0.0
   * @apiName readAllNotificationUser
   * @apiGroup NotificationUser
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object}   204        No cotent
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     NotificationUser does not exist
   */
  .put(authorize(), controller.readAll);

router
  .route('/hide-all')
  /**
   * @api {put} v1/notification-user/hide-all hide All User NotificationUser
   * @apiDescription hide All User NotificationUser
   * @apiVersion 1.0.0
   * @apiName hideAllNotificationUser
   * @apiGroup NotificationUser
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object}   204        No cotent
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     NotificationUser does not exist
   */
  .put(authorize(), controller.hideAll);

router
  .route('/display-all')
  /**
   * @api {put} v1/notification-user/display-all hide All User NotificationUser
   * @apiDescription hide All User NotificationUser
   * @apiVersion 1.0.0
   * @apiName hideAllNotificationUser
   * @apiGroup NotificationUser
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object}   204        No cotent
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     NotificationUser does not exist
   */
  .put(authorize(), controller.displayAllNotifications);

router
  .route('/count')
  /**
   * @api {get} v1/notification-user/count Count User NotificationUser
   * @apiDescription Count NotificationUser
   * @apiVersion 1.0.0
   * @apiName CountNotificationUser
   * @apiGroup NotificationUser
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object}   204        No cotent
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     NotificationUser does not exist
   */
  .get(authorize(), controller.countNotifications);

router
  .route('/:id')
  /**
   * @api {get} v1/notification-user/:id Get NotificationUser
   * @apiDescription Get NotificationUser information
   * @apiVersion 1.0.0
   * @apiName GetNotificationUser
   * @apiGroup NotificationUser
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object}   NotificationUser        NotificationUser
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     NotificationUser does not exist
   */
  .get(authorize(), controller.get)
  /**
   * @api {get} v1/notification-user/:id Delete NotificationUser
   * @apiDescription Delete NotificationUser information
   * @apiVersion 1.0.0
   * @apiName DeleteNotificationUser
   * @apiGroup NotificationUser
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
