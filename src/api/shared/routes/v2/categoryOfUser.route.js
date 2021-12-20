const express = require('express');
const controller = require('../../../category-of-user/controller/categoryOfUser.controller');
const userController = require('../../../user/controllers/user.controller');
const { authorize } = require('../../../authentication/middleware/auth');

const router = express.Router();

/**
 * Load user when API with userId route parameter is hit
 */
router.param('userId', userController.load);

router
  .route('/:CategoryOfUserId')
  /**
   * @api {get} v2/categoryOfUser List usercategories
   * @apiDescription List categoryOfUser information
   * @apiVersion 2.0.0
   * @apiName Getusercategories
   * @apiGroup usercategories
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object}   categoryOfUser        usercategories
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     categoryOfUser does not exist
   */
  .get(authorize(), controller.listByUserCategoryId)
  /**
   * @api {usercategories} v2/categoryOfUser Create usercategories
   * @apiDescription Create a new usercategories
   * @apiVersion 2.0.0
   * @apiName createusercategories
   * @apiGroup usercategories
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiParam  {Object}                 object   categoryOfUser object
   *
   * @apiSuccess (Created 201) {Object}  categoryOfUser        usercategories
   *
   * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   */
  .post(authorize(), controller.create)
  /**
   * @api {put} v2/categoryOfUser Update usercategories
   * @apiDescription Update a usercategories
   * @apiVersion 2.0.0
   * @apiName updateusercategories
   * @apiGroup usercategories
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
  * @apiParam  {String}                 _id       categoryOfUser id
   * @apiParam  {Object}                 categoryOfUser     categoryOfUser object
   *
   * @apiSuccess {String}   _id        categoryOfUser id
   *
   * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     categoryOfUser does not exist
   */
  .put(authorize(), controller.update);

router
  .route('/all')
  /**
   * @api {get} v2/categoryOfUser/all List usercategories
   * @apiDescription List categoryOfUser information
   * @apiVersion 2.0.0
   * @apiName ListAllusercategories
   * @apiGroup usercategories
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object}   categoryOfUser        usercategories
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     categoryOfUser does not exist
   */
  .get(authorize(), controller.list);

router
  .route('/:id')
  /**
   * @api {get} v2/categoryOfUser/:id Get usercategories
   * @apiDescription Get categoryOfUser information
   * @apiVersion 2.0.0
   * @apiName Getusercategories
   * @apiGroup usercategories
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object}   categoryOfUser        usercategories
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     categoryOfUser does not exist
   */
  .get(authorize(), controller.get)
  /**
   * @api {get} v2/categoryOfUser/:id Delete usercategories
   * @apiDescription Delete campaign categoryOfUser information
   * @apiVersion 2.0.0
   * @apiName Deleteusercategories
   * @apiGroup usercategories
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess (No Content 204)  Successfully deleted
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     categoryOfUser does not exist
   */
  .delete(authorize(), controller.remove);

module.exports = router;
