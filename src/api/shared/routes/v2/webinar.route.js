/* eslint-disable max-len */
const express = require('express');
const controller = require('../../controllers/webinar.controller');
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
   * @api {post} v1/webinar Create webinar
   * @apiDescription Create a new webinar
   * @apiVersion 1.0.0
   * @apiName Createwebinar
   * @apiGroup webinar
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiParam  {Object}                 object   webinar object
   *
   * @apiSuccess (Created 201) {Object}  webinar        webinar
   *
   * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   */
  .post(authorize(), controller.create)
  /**
   * @api {put} v1/webinar Update webinar
   * @apiDescription Update a webinar
   * @apiVersion 1.0.0
   * @apiName Updatewebinar
   * @apiGroup webinar
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiParam  {String}                 _id              webinar id
   * @apiParam  {Object}                 webinar   webinar object
   *
   * @apiSuccess {String}   _id        webinar id
   *
   * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     webinar does not exist
   */
  .put(authorize(), controller.update)
  /**
   * @api {put} v1/webinar Update webinar
   * @apiDescription Update a webinar
   * @apiVersion 1.0.0
   * @apiName Updatewebinar
   * @apiGroup webinar
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiParam  {String}                 _id              webinar id
   * @apiParam  {Object}                 webinar   webinar object
   *
   * @apiSuccess {String}   _id        webinar id
   *
   * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     webinar does not exist
   */
  .get(authorize(), controller.list);

router
  .route('/organization/:id')
  .get(authorize(), controller.listByOrganization);

router
  .route('/invitation/:id')
  .post(authorize(), controller.createInvitations);

router
  .route('/populated/:id')
  .get(authorize(), controller.getPopulated);

router
  .route('/approve')
  .put(authorize(), controller.approve);

router
  .route('/deny')
  .put(authorize(), controller.deny);

router
  .route('/publish')
  .put(authorize(), controller.publishWebinar);

router
  .route('/:id')
    /**
   * @api {delete} v1/webinar Delete webinar
   * @apiDescription Delete a webinar
   * @apiVersion 1.0.0
   * @apiName Delete webinar
   * @apiGroup webinar
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiParam  {String}                 _id              webinar id
   * @apiParam  {Object}                 webinar   webinar object
   *
   * @apiSuccess {String}   _id        webinar id
   *
   * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     webinar does not exist
   */
  .delete(authorize(), controller.remove)
  /**
   * @api {get} v2/webinar/:id Get Webinar
   * @apiDescription Get Webinar information
   * @apiVersion 2.0.0
   * @apiName GetWebinar
   * @apiGroup Webinar
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object}   Webinar        Webinar
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     Webinar does not exist
   */
  .get(authorize(), controller.get);

module.exports = router;
