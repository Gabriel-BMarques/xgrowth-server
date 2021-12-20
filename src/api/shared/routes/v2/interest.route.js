const express = require('express');
const controller = require('../../../interests/controller/interest.controller');
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
   * @api {usercategories} v2/Interest Create usercategories
   * @apiDescription Create a new usercategories
   * @apiVersion 2.0.0
   * @apiName createusercategories
   * @apiGroup usercategories
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiParam  {Object}                 object   Interest object
   *
   * @apiSuccess (Created 201) {Object}  Interest        usercategories
   *
   * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   */
  .post(authorize(), controller.create)
  /**
   * @api {put} v2/Interest Update usercategories
   * @apiDescription Update a usercategories
   * @apiVersion 2.0.0
   * @apiName updateusercategories
   * @apiGroup usercategories
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
  * @apiParam  {String}                 _id       Interest id
   * @apiParam  {Object}                 Interest     Interest object
   *
   * @apiSuccess {String}   _id        Interest id
   *
   * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     Interest does not exist
   */
  .put(authorize(), controller.update)
  /**
   * @api {get} v2/Interest List
   * @apiDescription List Interest information
   * @apiVersion 2.0.0
   * @apiName Getcategories
   * @apiGroup categories
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object}   Interest        categories
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     Interest does not exist
   */
  .get(authorize(), controller.list);

router
  .route('/:UserId')
  /**
   * @api {get} v2/Interest List usercategories
   * @apiDescription List Interest information
   * @apiVersion 2.0.0
   * @apiName Getusercategories
   * @apiGroup usercategories
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object}   Interest        usercategories
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     Interest does not exist
   */
  .get(authorize(), controller.listByCurrentUserId);

router
  .route('/all')
  /**
   * @api {get} v2/Interest/all List usercategories
   * @apiDescription List Interest information
   * @apiVersion 2.0.0
   * @apiName ListAllusercategories
   * @apiGroup usercategories
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object}   Interest        usercategories
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     Interest does not exist
   */
  .get(authorize(), controller.list);

router
  .route('/:id')
  /**
   * @api {get} v2/Interest/:id Get usercategories
   * @apiDescription Get Interest information
   * @apiVersion 2.0.0
   * @apiName Getusercategories
   * @apiGroup usercategories
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object}   Interest        usercategories
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     Interest does not exist
   */
  .get(authorize(), controller.get)
  /**
   * @api {get} v2/Interest/:id Delete usercategories
   * @apiDescription Delete campaign Interest information
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
   * @apiError (Not Found 404)    NotFound     Interest does not exist
   */
  .delete(authorize(), controller.remove);

module.exports = router;
