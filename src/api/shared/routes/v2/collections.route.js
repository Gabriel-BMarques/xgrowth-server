const express = require('express');
const controller = require('../../../collections/controller/collections.controller');
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
   * @api {get} v2/collections List collectionss
   * @apiDescription List collectionss information
   * @apiVersion 2.0.0
   * @apiName Getcollections
   * @apiGroup collections
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object}   collections        collections
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     collections does not exist
   */
  .get(authorize(), controller.listByCurrentUserId)
  /**
   * @api {collections} v2/collections Create collections
   * @apiDescription Create a new collections
   * @apiVersion 2.0.0
   * @apiName createcollections
   * @apiGroup collections
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiParam  {Object}                 object   collections object
   *
   * @apiSuccess (Created 201) {Object}  collections        collections
   *
   * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   */
  .post(authorize(), controller.create)
  /**
   * @api {put} v2/collections Update collections
   * @apiDescription Update a collections
   * @apiVersion 2.0.0
   * @apiName updatecollections
   * @apiGroup collections
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
  * @apiParam  {String}                 _id       collections id
   * @apiParam  {Object}                 collections     collections object
   *
   * @apiSuccess {String}   _id        collections id
   *
   * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     collections does not exist
   */
  .put(authorize(), controller.update);

router
  .route('/all')
  /**
   * @api {get} v2/collections/all List collectionss
   * @apiDescription List collectionss information
   * @apiVersion 2.0.0
   * @apiName ListAllcollectionss
   * @apiGroup collections
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object}   collections        collections
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     collections does not exist
   */
  .get(authorize(), controller.list);

router
  .route('/:id')
  /**
   * @api {get} v2/collections/:id Get collections
   * @apiDescription Get collections information
   * @apiVersion 2.0.0
   * @apiName Getcollections
   * @apiGroup collections
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object}   collections        collections
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     collections does not exist
   */
  .get(authorize(), controller.get)
  /**
   * @api {get} v2/collections/:id Delete collections
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
   * @apiError (Not Found 404)    NotFound     collections does not exist
   */
  .delete(authorize(), controller.remove);

module.exports = router;
