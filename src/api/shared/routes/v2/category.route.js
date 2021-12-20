const express = require('express');
const controller = require('../../../category/controller/category.controller');
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
   * @api {get} v2/category List categories
   * @apiDescription List category information
   * @apiVersion 2.0.0
   * @apiName Getcategories
   * @apiGroup categories
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object}   category        categories
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     category does not exist
   */
  .get(authorize(), controller.list)
  /**
   * @api {categories} v2/category Create categories
   * @apiDescription Create a new categories
   * @apiVersion 2.0.0
   * @apiName createcategories
   * @apiGroup categories
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiParam  {Object}                 object   category object
   *
   * @apiSuccess (Created 201) {Object}  category        categories
   *
   * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   */
  .post(authorize(), controller.create)
  /**
   * @api {put} v2/category Update categories
   * @apiDescription Update a categories
   * @apiVersion 2.0.0
   * @apiName updatecategories
   * @apiGroup categories
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
  * @apiParam  {String}                 _id       category id
   * @apiParam  {Object}                 category     category object
   *
   * @apiSuccess {String}   _id        category id
   *
   * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     category does not exist
   */
  .put(authorize(), controller.update);

router
  .route('/all')
  /**
   * @api {get} v2/category/all List categories
   * @apiDescription List category information
   * @apiVersion 2.0.0
   * @apiName ListAllcategories
   * @apiGroup categories
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object}   category        categories
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     category does not exist
   */
  .get(authorize(), controller.listAll);

router
  .route('/company')
  /**
   * @api {get} v2/category/company List categories by company
   * @apiDescription List category information
   * @apiVersion 2.0.0
   * @apiName ListCategoriesByCompany
   * @apiGroup categories
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object}   category        categories
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     category does not exist
   */
  .get(authorize(), controller.listByCurrentCompany);

router
  .route('/interests')
  /**
   * @api {get} v2/category/company List categories by company
   * @apiDescription List category information
   * @apiVersion 2.0.0
   * @apiName ListCategoriesByCompany
   * @apiGroup categories
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object}   category        categories
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     category does not exist
   */
  .get(authorize(), controller.listCategoriesForInterests);

router
  .route('/:id')
  /**
   * @api {get} v2/category/:id Get categories
   * @apiDescription Get category information
   * @apiVersion 2.0.0
   * @apiName Getcategories
   * @apiGroup categories
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object}   category        categories
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     category does not exist
   */
  .get(authorize(), controller.get)
  /**
   * @api {get} v2/category/:id Delete categories
   * @apiDescription Delete campaign category information
   * @apiVersion 2.0.0
   * @apiName Deletecategories
   * @apiGroup categories
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess (No Content 204)  Successfully deleted
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     category does not exist
   */
  .delete(authorize(), controller.remove);

module.exports = router;
