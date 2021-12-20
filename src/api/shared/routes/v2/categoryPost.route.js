const express = require('express');
const controller = require('../../../category-post/controller/categoryPost.controller');
const userController = require('../../../user/controllers/user.controller');
const { authorize } = require('../../../authentication/middleware/auth');

const router = express.Router();

/**
 * Load user when API with userId route parameter is hit
 */
router.param('userId', userController.load);

router
  .route('/list/:id')
  /**
   * @api {get} v2/categoryPost List postcategories
   * @apiDescription List categoryPost information
   * @apiVersion 2.0.0
   * @apiName Getpostcategories
   * @apiGroup postcategories
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object}   categoryPost        postcategories
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     categoryPost does not exist
   */
  .get(authorize(), controller.listByPostId);

router
  .route('/')
  /**
   * @api {postcategories} v2/categoryPost Create postcategories
   * @apiDescription Create a new postcategories
   * @apiVersion 2.0.0
   * @apiName createpostcategories
   * @apiGroup postcategories
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiParam  {Object}                 object   categoryPost object
   *
   * @apiSuccess (Created 201) {Object}  categoryPost        postcategories
   *
   * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   */
  .post(authorize(), controller.create)
  /**
   * @api {put} v2/categoryPost Update postcategories
   * @apiDescription Update a postcategories
   * @apiVersion 2.0.0
   * @apiName updatepostcategories
   * @apiGroup postcategories
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
  * @apiParam  {String}                 _id       categoryPost id
   * @apiParam  {Object}                 categoryPost     categoryPost object
   *
   * @apiSuccess {String}   _id        categoryPost id
   *
   * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     categoryPost does not exist
   */
  .put(authorize(), controller.update);

router
  .route('/all')
  /**
   * @api {get} v2/categoryPost/all List postcategories
   * @apiDescription List categoryPost information
   * @apiVersion 2.0.0
   * @apiName ListAllpostcategories
   * @apiGroup postcategories
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object}   categoryPost        postcategories
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     categoryPost does not exist
   */
  .get(authorize(), controller.list);

router
  .route('/feed')
  /**
   * @api {get} v2/category-post/feed List Category Posts by Feed Posts
   * @apiDescription List Category Posts information
   * @apiVersion 2.0.0
   * @apiName ListFeedPosts
   * @apiGroup Post
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object}   Post        Post
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     Post does not exist
   */
  .get(authorize(), controller.listFeedCategoriesByPosts);

router
  .route('/:id')
  /**
   * @api {get} v2/categoryPost/:id Get postcategories
   * @apiDescription Get categoryPost information
   * @apiVersion 2.0.0
   * @apiName Getpostcategories
   * @apiGroup postcategories
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object}   categoryPost        postcategories
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     categoryPost does not exist
   */
  .get(authorize(), controller.get)
  /**
   * @api {get} v2/categoryPost/:id Delete postcategories
   * @apiDescription Delete campaign categoryPost information
   * @apiVersion 2.0.0
   * @apiName Deletepostcategories
   * @apiGroup postcategories
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess (No Content 204)  Successfully deleted
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     categoryPost does not exist
   */
  .delete(authorize(), controller.remove);

module.exports = router;
