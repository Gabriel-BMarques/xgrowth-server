/* eslint-disable max-len */
const express = require('express');
const controller = require('../../controllers/tutorialReaction.controller');
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
   * @api {post} v1/tutorialReaction Create tutorialReaction
   * @apiDescription Create a new tutorialReaction
   * @apiVersion 1.0.0
   * @apiName CreatetutorialReaction
   * @apiGroup tutorialReaction
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiParam  {Object}                 object   tutorialReaction object
   *
   * @apiSuccess (Created 201) {Object}  tutorialReaction        tutorialReaction
   *
   * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   */
  .post(authorize(), controller.create)
  /**
   * @api {put} v1/tutorialReaction Update tutorialReaction
   * @apiDescription Update a tutorialReaction
   * @apiVersion 1.0.0
   * @apiName UpdatetutorialReaction
   * @apiGroup tutorialReaction
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiParam  {String}                 _id              tutorialReaction id
   * @apiParam  {Object}                 tutorialReaction   tutorialReaction object
   *
   * @apiSuccess {String}   _id        tutorialReaction id
   *
   * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     tutorialReaction does not exist
   */
  .put(authorize(), controller.update)
  /**
   * @api {put} v1/tutorialReaction Update tutorialReaction
   * @apiDescription Update a tutorialReaction
   * @apiVersion 1.0.0
   * @apiName UpdatetutorialReaction
   * @apiGroup tutorialReaction
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiParam  {String}                 _id              tutorialReaction id
   * @apiParam  {Object}                 tutorialReaction   tutorialReaction object
   *
   * @apiSuccess {String}   _id        tutorialReaction id
   *
   * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     tutorialReaction does not exist
   */
  .get(authorize(), controller.list);

router
  .route('/:id')
    /**
   * @api {delete} v1/tutorialReaction Delete tutorialReaction
   * @apiDescription Delete a tutorialReaction
   * @apiVersion 1.0.0
   * @apiName Delete tutorialReaction
   * @apiGroup tutorialReaction
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiParam  {String}                 _id              tutorialReaction id
   * @apiParam  {Object}                 tutorialReaction   tutorialReaction object
   *
   * @apiSuccess {String}   _id        tutorialReaction id
   *
   * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     tutorialReaction does not exist
   */
  .delete(authorize(), controller.remove)
  /**
   * @api {get} v2/tutorialReaction/:id Get tutorialReaction
   * @apiDescription Get tutorialReaction information
   * @apiVersion 2.0.0
   * @apiName GettutorialReaction
   * @apiGroup tutorialReaction
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object}   tutorialReaction        tutorialReaction
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     tutorialReaction does not exist
   */
  .get(authorize(), controller.get);

module.exports = router;
