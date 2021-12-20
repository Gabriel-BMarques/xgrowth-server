const express = require('express');
const controller = require('../../../post-company/controller/postCompany.controller');
const userController = require('../../../user/controllers/user.controller');
const { authorize } = require('../../../authentication/middleware/auth');

const router = express.Router();

/**
 * Load user when API with userId route parameter is hit
 */
router.param('userId', userController.load);

router
  .route('/:PostId')
  /**
   * @api {get} v2/PostCompany List postcategories
   * @apiDescription List PostCompany information
   * @apiVersion 2.0.0
   * @apiName Getpostcategories
   * @apiGroup postcategories
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object}   PostCompany        postcategories
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     PostCompany does not exist
   */
  .get(authorize(), controller.listByPostId);

router
  .route('/')
/**
   * @api {postcategories} v2/PostCompany Create postcategories
   * @apiDescription Create a new postcategories
   * @apiVersion 2.0.0
   * @apiName createpostcategories
   * @apiGroup postcategories
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiParam  {Object}                 object   PostCompany object
   *
   * @apiSuccess (Created 201) {Object}  PostCompany        postcategories
   *
   * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   */
  .post(authorize(), controller.create)
  /**
   * @api {put} v2/PostCompany Update postcategories
   * @apiDescription Update a postcategories
   * @apiVersion 2.0.0
   * @apiName updatepostcategories
   * @apiGroup postcategories
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
  * @apiParam  {String}                 _id       PostCompany id
   * @apiParam  {Object}                 PostCompany     PostCompany object
   *
   * @apiSuccess {String}   _id        PostCompany id
   *
   * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     PostCompany does not exist
   */
  .put(authorize(), controller.update);

router
  .route('/all')
  /**
   * @api {get} v2/PostCompany/all List postcategories
   * @apiDescription List PostCompany information
   * @apiVersion 2.0.0
   * @apiName ListAllpostcategories
   * @apiGroup postcategories
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object}   PostCompany        postcategories
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     PostCompany does not exist
   */
  .get(authorize(), controller.list);

router
  .route('/:id')
  /**
   * @api {get} v2/PostCompany/:id Get postcategories
   * @apiDescription Get PostCompany information
   * @apiVersion 2.0.0
   * @apiName Getpostcategories
   * @apiGroup postcategories
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object}   PostCompany        postcategories
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     PostCompany does not exist
   */
  .get(authorize(), controller.get)
  /**
   * @api {get} v2/PostCompany/:id Delete postcategories
   * @apiDescription Delete campaign PostCompany information
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
   * @apiError (Not Found 404)    NotFound     PostCompany does not exist
   */
  .delete(authorize(), controller.remove);

module.exports = router;
