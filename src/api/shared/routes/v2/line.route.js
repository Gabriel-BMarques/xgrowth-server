const express = require('express');
const validate = require('express-validation');
const controller = require('../../../line/controller/line.controller');
const userController = require('../../../user/controllers/user.controller');
const { authorize } = require('../../../authentication/middleware/auth');

const {
  createLine,
  updateLine,
} = require('../../../line/validation/line.validation');

const router = express.Router();

/**
 * Load user when API with userId route parameter is hit
 */
router.param('userId', userController.load);

router
  .route('/')
  /**
   * @api {get} v1/line List Lines
   * @apiDescription List Lines information
   * @apiVersion 1.0.0
   * @apiName GetLine
   * @apiGroup Line
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object}   Line        Line
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     Line does not exist
   */
  .get(authorize(), controller.list)
  /**
   * @api {post} v1/line Create Line
   * @apiDescription Create a new Line
   * @apiVersion 1.0.0
   * @apiName createLine
   * @apiGroup Line
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiParam  {Object}                 object   Line object
   *
   * @apiSuccess (Created 201) {Object}  Line        Line
   *
   * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   */
  .post(authorize(), validate(createLine), controller.create)
  /**
   * @api {put} v1/line Update Line
   * @apiDescription Update a Line
   * @apiVersion 1.0.0
   * @apiName UpdateLine
   * @apiGroup Line
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
  * @apiParam  {String}                 _id       Line id
   * @apiParam  {Object}                 line     Line object
   *
   * @apiSuccess {String}   _id        Line id
   *
   * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     Line does not exist
   */
  .put(authorize(), validate(updateLine), controller.update);

router
  .route('/all')
  /**
   * @api {get} v1/line/all List Lines
   * @apiDescription List Lines information
   * @apiVersion 1.0.0
   * @apiName ListAllLines
   * @apiGroup Line
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object}   Line        Line
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     Line does not exist
   */
  .get(authorize(), controller.list);

router
  .route('/products')
  /**
   * @api {get} v2/line/products List Lines With Products
   * @apiDescription List Lines With Products information
   * @apiVersion 1.0.0
   * @apiName ListLinesWithProducts
   * @apiGroup Line
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object}   Line        Line
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     Line does not exist
   */
  .get(authorize(), controller.listLinesWithProducts);

router
  .route('/:id')
  /**
   * @api {get} v1/line/:id Get Line
   * @apiDescription Get Line information
   * @apiVersion 1.0.0
   * @apiName GetLine
   * @apiGroup Line
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object}   line        Line
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     Line does not exist
   */
  .get(authorize(), controller.get)
  /**
   * @api {get} v1/line/:id Delete Line
   * @apiDescription Delete campaign category information
   * @apiVersion 1.0.0
   * @apiName DeleteLine
   * @apiGroup Line
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess (No Content 204)  Successfully deleted
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     Line does not exist
   */
  .delete(authorize(), controller.delete);

module.exports = router;
