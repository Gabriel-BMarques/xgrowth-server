const express = require('express');
const controller = require('../../../category-user/controller/categoryUser.controller');
const userController = require('../../../user/controllers/user.controller');
const { authorize } = require('../../../authentication/middleware/auth');

const router = express.Router();

/**
 * Load user when API with userId route parameter is hit
 */
router.param('userId', userController.load);

router
  .route('/:UserId')
  /**
   * @api {get} v2/categoryUser List usercategories
   * @apiDescription List categoryUser information
   * @apiVersion 2.0.0
   * @apiName Getusercategories
   * @apiGroup usercategories
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object}   categoryUser        usercategories
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     categoryUser does not exist
   */
  .get(authorize(), controller.listByCurrentUserId)
  /**
   * @api {usercategories} v2/categoryUser Create usercategories
   * @apiDescription Create a new usercategories
   * @apiVersion 2.0.0
   * @apiName createusercategories
   * @apiGroup usercategories
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiParam  {Object}                 object   categoryUser object
   *
   * @apiSuccess (Created 201) {Object}  categoryUser        usercategories
   *
   * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   */
  .post(authorize(), controller.create)
  /**
   * @api {put} v2/categoryUser Update usercategories
   * @apiDescription Update a usercategories
   * @apiVersion 2.0.0
   * @apiName updateusercategories
   * @apiGroup usercategories
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
  * @apiParam  {String}                 _id       categoryUser id
   * @apiParam  {Object}                 categoryUser     categoryUser object
   *
   * @apiSuccess {String}   _id        categoryUser id
   *
   * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     categoryUser does not exist
   */
  .put(authorize(), controller.update);

router
  .route('/all')
  /**
   * @api {get} v2/categoryUser/all List usercategories
   * @apiDescription List categoryUser information
   * @apiVersion 2.0.0
   * @apiName ListAllusercategories
   * @apiGroup usercategories
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object}   categoryUser        usercategories
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     categoryUser does not exist
   */
  .get(authorize(), controller.list);

router
  .route('/:id')
  /**
   * @api {get} v2/categoryUser/:id Get usercategories
   * @apiDescription Get categoryUser information
   * @apiVersion 2.0.0
   * @apiName Getusercategories
   * @apiGroup usercategories
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object}   categoryUser        usercategories
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     categoryUser does not exist
   */
  .get(authorize(), controller.get)
  /**
   * @api {get} v2/categoryUser/:id Delete usercategories
   * @apiDescription Delete campaign categoryUser information
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
   * @apiError (Not Found 404)    NotFound     categoryUser does not exist
   */
  .delete(authorize(), controller.remove);

module.exports = router;
