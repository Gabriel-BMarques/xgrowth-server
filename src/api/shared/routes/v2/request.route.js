const express = require('express');
const validate = require('express-validation');
const controller = require('../../../request/controller/request.controller');
const userController = require('../../../user/controllers/user.controller');
const { authorize } = require('../../../authentication/middleware/auth');

const {
  createRequest,
  updateRequest,
} = require('../../../request/validation/request.validation');

const router = express.Router();

/**
 * Load user when API with userId route parameter is hit
 */
router.param('userId', userController.load);

router
  .route('/')
  /**
   * @api {get} v1/request List Requests
   * @apiDescription List Requests information
   * @apiVersion 1.0.0
   * @apiName GetRequest
   * @apiGroup Request
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object}   Request        Request
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     Request does not exist
   */
  .get(authorize(), controller.listByUserId)
  /**
   * @api {post} v1/request Create Request
   * @apiDescription Create a new Request
   * @apiVersion 1.0.0
   * @apiName createRequest
   * @apiGroup Request
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiParam  {Object}                 object   Request object
   *
   * @apiSuccess (Created 201) {Object}  Request        Request
   *
   * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   */
  .post(authorize(), validate(createRequest), controller.create)
  /**
   * @api {put} v1/request Update Request
   * @apiDescription Update a Request
   * @apiVersion 1.0.0
   * @apiName updateRequest
   * @apiGroup Request
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
  * @apiParam  {String}                 _id       Request id
   * @apiParam  {Object}                 Request     Request object
   *
   * @apiSuccess {String}   _id        Request id
   *
   * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     Request does not exist
   */
  .put(authorize(), validate(updateRequest), controller.update);

router
  .route('/all')
  /**
   * @api {get} v1/request/all List Requests
   * @apiDescription List Requests information
   * @apiVersion 1.0.0
   * @apiName ListAllRequests
   * @apiGroup Request
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object}   Request        Request
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     Request does not exist
   */
  .get(authorize(), controller.list);

router
  .route('/:id')
  /**
   * @api {get} v1/request/:id Get Request
   * @apiDescription Get Request information
   * @apiVersion 1.0.0
   * @apiName GetRequest
   * @apiGroup Request
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object}   Request        Request
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     Request does not exist
   */
  .get(authorize(), controller.get)
  /**
   * @api {get} v1/request/:id Delete Request
   * @apiDescription Delete campaign category information
   * @apiVersion 1.0.0
   * @apiName DeleteRequest
   * @apiGroup Request
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess (No Content 204)  Successfully deleted
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     Request does not exist
   */
  .delete(authorize(), controller.remove);

module.exports = router;
