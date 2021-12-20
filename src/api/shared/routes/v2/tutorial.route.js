/* eslint-disable max-len */
const express = require('express');
const controller = require('../../controllers/tutorial.controller');
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
   * @api {post} v1/tutorial Create tutorial
   * @apiDescription Create a new tutorial
   * @apiVersion 1.0.0
   * @apiName Createtutorial
   * @apiGroup tutorial
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiParam  {Object}                 object   tutorial object
   *
   * @apiSuccess (Created 201) {Object}  tutorial        tutorial
   *
   * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   */
  .post(authorize(), controller.create)
  /**
   * @api {put} v1/tutorial Update tutorial
   * @apiDescription Update a tutorial
   * @apiVersion 1.0.0
   * @apiName Updatetutorial
   * @apiGroup tutorial
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiParam  {String}                 _id              tutorial id
   * @apiParam  {Object}                 tutorial   tutorial object
   *
   * @apiSuccess {String}   _id        tutorial id
   *
   * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     tutorial does not exist
   */
  .put(authorize(), controller.update)
  /**
   * @api {put} v1/tutorial Update tutorial
   * @apiDescription Update a tutorial
   * @apiVersion 1.0.0
   * @apiName Updatetutorial
   * @apiGroup tutorial
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiParam  {String}                 _id              tutorial id
   * @apiParam  {Object}                 tutorial   tutorial object
   *
   * @apiSuccess {String}   _id        tutorial id
   *
   * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     tutorial does not exist
   */
  .get(authorize(), controller.list)

router
  .route('/:id')
    /**
   * @api {delete} v1/tutorial Delete tutorial
   * @apiDescription Delete a tutorial
   * @apiVersion 1.0.0
   * @apiName Delete tutorial
   * @apiGroup tutorial
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiParam  {String}                 _id              tutorial id
   * @apiParam  {Object}                 tutorial   tutorial object
   *
   * @apiSuccess {String}   _id        tutorial id
   *
   * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     tutorial does not exist
   */
  .delete(authorize(), controller.remove)
  /**
   * @api {get} v2/tutorial/:id Get tutorial
   * @apiDescription Get tutorial information
   * @apiVersion 2.0.0
   * @apiName Get tutorial
   * @apiGroup tutorial
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object}   tutorial        tutorial
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     tutorial does not exist
   */
   .get(authorize(), controller.get);

module.exports = router;
