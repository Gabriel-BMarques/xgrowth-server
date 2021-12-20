const express = require('express');
const validate = require('express-validation');
const controller = require('../../../product/controller/product.controller');
const userController = require('../../../user/controllers/user.controller');
const { authorize } = require('../../../authentication/middleware/auth');

const {
  createProduct,
  updateProduct,
} = require('../../../product/validation/product.validation');

const router = express.Router();

/**
 * Load user when API with userId route parameter is hit
 */
router.param('userId', userController.load);

router
  .route('/')
  /**
     * @api {get} v1/product List Lines
     * @apiDescription List Products information
     * @apiVersion 1.0.0
     * @apiName GetProduct
     * @apiGroup Product
     * @apiPermission User
     *
     * @apiHeader {String} Authorization  User's access token
     *
     * @apiSuccess {Object}   Product        Product
     *
     * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
     * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
     * @apiError (Not Found 404)    NotFound     Line does not exist
     */
  .get(authorize(), controller.list)
  /**
   * @api {post} v1/product Create Product
   * @apiDescription Create a new Product
   * @apiVersion 1.0.0
   * @apiName createProduct
   * @apiGroup Product
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiParam  {Object}                 object   Product object
   *
   * @apiSuccess (Created 201) {Object}  Product        Product
   *
   * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   */
  .post(authorize(), validate(createProduct), controller.create)
  /**
   * @api {put} v1/product Update Product
   * @apiDescription Update a Product
   * @apiVersion 1.0.0
   * @apiName updateProduct
   * @apiGroup Product
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
  * @apiParam  {String}                 _id       Product id
   * @apiParam  {Object}                 Product     Product object
   *
   * @apiSuccess {String}   _id        Product id
   *
   * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     Product does not exist
   */
  .put(authorize(), validate(updateProduct), controller.update);

router
  .route('/all')
  /**
   * @api {get} v1/product/all List Products
   * @apiDescription List Products information
   * @apiVersion 1.0.0
   * @apiName ListAllProducts
   * @apiGroup Product
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object}   Product        Product
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     Product does not exist
   */
  .get(authorize(), controller.list);

router
  .route('/group-by/city')
  /**
   * @api {get} v1/product/all List Products
   * @apiDescription List Products information
   * @apiVersion 1.0.0
   * @apiName ListAllProducts
   * @apiGroup Product
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object}   Product        Product
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     Product does not exist
   */
  .get(authorize(), controller.listGroupedByCity);

router
  .route('/:id')
  /**
   * @api {get} v1/product/:id Get Product
   * @apiDescription Get Product information
   * @apiVersion 1.0.0
   * @apiName GetProduct
   * @apiGroup Product
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object}   Product        Product
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     Product does not exist
   */
  .get(authorize(), controller.get)
  /**
   * @api {get} v1/product/:id Delete Product
   * @apiDescription Delete campaign category information
   * @apiVersion 1.0.0
   * @apiName DeleteProduct
   * @apiGroup Product
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess (No Content 204)  Successfully deleted
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     Product does not exist
   */
  .delete(authorize(), controller.delete);

module.exports = router;
