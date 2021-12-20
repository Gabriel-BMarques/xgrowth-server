const express = require('express');
const controller = require('../../controllers/categoryOrganization.controller');
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
   * @api {get} v2/categoryOrganization List categories
   * @apiDescription List categoryOrganization information
   * @apiVersion 2.0.0
   * @apiName Getcategories
   * @apiGroup categories
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object}   categoryOrganization        categories
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     categoryOrganization does not exist
   */
  .get(authorize(), controller.listAll)
  /**
   * @api {categories} v2/categoryOrganization Create categories
   * @apiDescription Create a new categories
   * @apiVersion 2.0.0
   * @apiName createcategories
   * @apiGroup categories
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiParam  {Object}                 object   categoryOrganization object
   *
   * @apiSuccess (Created 201) {Object}  categoryOrganization        categories
   *
   * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   */
  .post(authorize(), controller.create)
  /**
   * @api {put} v2/categoryOrganization Update categories
   * @apiDescription Update a categories
   * @apiVersion 2.0.0
   * @apiName updatecategories
   * @apiGroup categories
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
  * @apiParam  {String}                 _id       categoryOrganization id
   * @apiParam  {Object}                 categoryOrganization     categoryOrganization object
   *
   * @apiSuccess {String}   _id        categoryOrganization id
   *
   * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     categoryOrganization does not exist
   */
  .put(authorize(), controller.update)
  /**
   * @api {get} v2/category/:id Delete categories
   * @apiDescription Delete campaign categoryOrganization information
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
   * @apiError (Not Found 404)    NotFound     categoryOrganization does not exist
   */
router
  .route('/:id')
  .delete(authorize(), controller.remove); //
module.exports = router;
