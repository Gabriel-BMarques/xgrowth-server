const express = require('express');
const validate = require('express-validation');
const controller = require('../../../notification-device/controller/notificationDevice.controller');
const userController = require('../../../user/controllers/user.controller');
const { authorize, ADMIN } = require('../../../authentication/middleware/auth');

const {
  createNotificationDevice,
  updateNotificationDevice,
} = require('../../../notification-device/validation/notificationDevice.validation');

const router = express.Router();

/**
 * Load user when API with userId route parameter is hit
 */
router.param('userId', userController.load);

router
  .route('/')
  /**
   * @api {get} v1/notification-device List NotificationDevice
   * @apiDescription List NotificationDevice information
   * @apiVersion 1.0.0
   * @apiName GetNotificationDevice
   * @apiGroup NotificationDevice
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object}   Notification        NotificationDevice
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     NotificationDevice does not exist
   */
  .get(authorize(), controller.listByUserId)
  /**
   * @api {post} v1/notification-device Create NotificationDevice
   * @apiDescription Create a new NotificationDevice
   * @apiVersion 1.0.0
   * @apiName createNotificationDevice
   * @apiGroup NotificationDevice
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiParam  {Object}                 object   Notification object
   *
   * @apiSuccess (Created 201) {Object}  NotificationDevice        NotificationDevice
   *
   * @apiError (Bad Notification 400)   ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   */
  .post(authorize(), validate(createNotificationDevice), controller.create)
  /**
   * @api {put} v1/notification-device Update NotificationDevice
   * @apiDescription Update a NotificationDevice
   * @apiVersion 1.0.0
   * @apiName updateNotificationDevice
   * @apiGroup NotificationDevice
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
  * @apiParam  {String}                 _id       NotificationDevice id
   * @apiParam  {Object}                 NotificationDevice     NotificationDevice object
   *
   * @apiSuccess {String}   _id        NotificationDevice id
   *
   * @apiError (Bad Notification 400)  ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     Notification does not exist
   */
  .put(authorize(), validate(updateNotificationDevice), controller.update);

router
  .route('/all')
  /**
   * @api {get} v1/notification-device/all List NotificationDevice
   * @apiDescription List NotificationDevice information
   * @apiVersion 1.0.0
   * @apiName ListAllNotificationDevice
   * @apiGroup NotificationDevice
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object}   NotificationDevice        NotificationDevice
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     NotificationDevice does not exist
   */
  .get(authorize(ADMIN), controller.list);

router
  .route('/:id')
  /**
   * @api {get} v1/notification-device/:id Get NotificationDevice
   * @apiDescription Get NotificationDevice information
   * @apiVersion 1.0.0
   * @apiName GetNotificationDevice
   * @apiGroup NotificationDevice
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object}   NotificationDevice        NotificationDevice
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     NotificationDevice does not exist
   */
  .get(authorize(ADMIN), controller.get)
  /**
   * @api {get} v1/notification-device/:id Delete NotificationDevice
   * @apiDescription Delete NotificationDevice information
   * @apiVersion 1.0.0
   * @apiName DeleteNotificationDevice
   * @apiGroup NotificationDevice
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
  .delete(authorize(ADMIN), controller.remove);

module.exports = router;
