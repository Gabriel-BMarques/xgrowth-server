const express = require('express');
const controller = require('../../../collection-post/controller/collectionPost.controller');
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
   * @api {get} v2/collection-post List collections
   * @apiDescription List collection post information
   * @apiVersion 2.0.0
   * @apiName Getcollections
   * @apiGroup collections
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object}   collection post        collections
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     collection post does not exist
   */
  .get(authorize(), controller.listByCurrentUserId)
  /**
   * @api {collections} v2/collection-post Create collections
   * @apiDescription Create a new collections
   * @apiVersion 2.0.0
   * @apiName createcollections
   * @apiGroup collections
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiParam  {Object}                 object   collection post object
   *
   * @apiSuccess (Created 201) {Object}  collection post        collections
   *
   * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   */
  .post(authorize(), controller.create)
  /**
   * @api {put} v2/collection-post Update collections
   * @apiDescription Update a collections
   * @apiVersion 2.0.0
   * @apiName updatecollections
   * @apiGroup collections
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
  * @apiParam  {String}                 _id       collection post id
   * @apiParam  {Object}                 collection post     collection post object
   *
   * @apiSuccess {String}   _id        collection post id
   *
   * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     collection post does not exist
   */
  .put(authorize(), controller.update);

router
  .route('/all')
  /**
   * @api {get} v2/collection-post/all List collections
   * @apiDescription List collection post information
   * @apiVersion 2.0.0
   * @apiName ListAllcollections
   * @apiGroup collections
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object}   collection post        collections
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     collection post does not exist
   */
  .get(authorize(), controller.list);

router
  .route('/list/:id')
  /**
   * @api {get} v2/collection-post/list/:id Get collections
   * @apiDescription Get collection post information
   * @apiVersion 2.0.0
   * @apiName Getcollections
   * @apiGroup collections
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object}   collection post        collections
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     collection post does not exist
   */
  .get(authorize(), controller.listByCollectionId);

router
  .route('/:id')
  /**
   * @api {get} v2/collection-post/:id Get collections
   * @apiDescription Get collection post information
   * @apiVersion 2.0.0
   * @apiName Getcollections
   * @apiGroup collections
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object}   collection post        collections
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     collection post does not exist
   */
  .get(authorize(), controller.get)
  /**
   * @api {get} v2/collection-post/:id Delete collections
   * @apiDescription Delete campaign category information
   * @apiVersion 2.0.0
   * @apiName Deletecollections
   * @apiGroup collections
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess (No Content 204)  Successfully deleted
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     collection post does not exist
   */
  .delete(authorize(), controller.remove);

module.exports = router;
