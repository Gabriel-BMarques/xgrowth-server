const express = require('express');
const controller = require('../../../category-client/controller/categoryClient.controller');
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
   * @api {clientcategories} v2/categoryClient Create clientcategories
   * @apiDescription Create a new clientcategories
   * @apiVersion 2.0.0
   * @apiName createclientcategories
   * @apiGroup clientcategories
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiParam  {Object}                 object   categoryClient object
   *
   * @apiSuccess (Created 201) {Object}  categoryClient        clientcategories
   *
   * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   */
  .post(authorize(), controller.create)
  /**
   * @api {put} v2/categoryClient Update clientcategories
   * @apiDescription Update a clientcategories
   * @apiVersion 2.0.0
   * @apiName updateclientcategories
   * @apiGroup clientcategories
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
  * @apiParam  {String}                 _id       categoryClient id
   * @apiParam  {Object}                 categoryClient     categoryClient object
   *
   * @apiSuccess {String}   _id        categoryClient id
   *
   * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     categoryClient does not exist
   */
  .put(authorize(), controller.update);

router
  .route('/list/:id')
  /**
   * @api {get} v2/categoryClient List clientcategories
   * @apiDescription List categoryClient information
   * @apiVersion 2.0.0
   * @apiName Getclientcategories
   * @apiGroup clientcategories
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object}   categoryClient        clientcategories
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     categoryClient does not exist
   */
  .get(authorize(), controller.listByClientId);

router
  .route('/all')
  /**
   * @api {get} v2/categoryClient/all List clientcategories
   * @apiDescription List categoryClient information
   * @apiVersion 2.0.0
   * @apiName ListAllclientcategories
   * @apiGroup clientcategories
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object}   categoryClient        clientcategories
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     categoryClient does not exist
   */
  .get(authorize(), controller.list);

router
  .route('/:id')
  /**
   * @api {get} v2/categoryClient/:id Get clientcategories
   * @apiDescription Get categoryClient information
   * @apiVersion 2.0.0
   * @apiName Getclientcategories
   * @apiGroup clientcategories
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object}   categoryClient        clientcategories
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     categoryClient does not exist
   */
  .get(authorize(), controller.get)
  /**
   * @api {get} v2/categoryClient/:id Delete clientcategories
   * @apiDescription Delete campaign categoryClient information
   * @apiVersion 2.0.0
   * @apiName Deleteclientcategories
   * @apiGroup clientcategories
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess (No Content 204)  Successfully deleted
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     categoryClient does not exist
   */
  .delete(authorize(), controller.remove);

module.exports = router;
