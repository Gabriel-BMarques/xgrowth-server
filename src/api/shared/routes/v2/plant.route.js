/* eslint max-len: ["error", { "ignoreComments": true }] */
const express = require('express');
const validate = require('express-validation');
const controller = require('../../../plant/controller/plant.controller');
const userController = require('../../../user/controllers/user.controller');
const { authorize } = require('../../../authentication/middleware/auth');

const {
  createPlant,
  updatePlant,
} = require('../../../plant/validation/plant.validation');

const router = express.Router();

router
  .route('/:id/products')
  /**
   * @api {get} v1/plant/:id/proucts Get Plant Products Products
   * @apiDescription Get Plant Products information
   * @apiVersion 1.0.0
   * @apiName GET Plant Products
   * @apiGroup Plant
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object}   Product      product
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     Plant does not exist
   */
  .get(authorize(), controller.listPlantProducts);

/**
 * Load user when API with userId route parameter is hit
 */
router.param('userId', userController.load);

router
  .route('/')
  /**
   * @api {get} v1/plant List Plants
   * @apiDescription List Plants information
   * @apiVersion 1.0.0
   * @apiName GetPlant
   * @apiGroup Plant
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object}   Plant        Plant
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     Plant does not exist
   */
  .get(authorize(), controller.list)
  /**
   * @api {post} v1/plant Create Plant
   * @apiDescription Create a new Plant
   * @apiVersion 1.0.0
   * @apiName createPlant
   * @apiGroup Plant
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiParam  {Object}                 object   Plant object
   *
   * @apiSuccess (Created 201) {Object}  Plant        Plant
   *
   * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   */
  .post(authorize(), validate(createPlant), controller.create)
  /**
   * @api {put} v1/plant Update Plant
   * @apiDescription Update a Plant
   * @apiVersion 1.0.0
   * @apiName updatePlant
   * @apiGroup Plant
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
  * @apiParam  {String}                 _id       Plant id
   * @apiParam  {Object}                 Plant     Plant object
   *
   * @apiSuccess {String}   _id        Plant id
   *
   * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     Plant does not exist
   */
  .put(authorize(), validate(updatePlant), controller.update);

router
  .route('/count')
  /**
   * @api {put} v1/plant Count Plants
   * @apiDescription Count Plants
   * @apiVersion 1.0.0
   * @apiName countPlants
   * @apiGroup Plant
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
  * @apiParam  {String}                 _id       Plant id
   * @apiParam  {Object}                 Plant     Plant object
   *
   * @apiSuccess {String}   _id        Plant id
   *
   * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     Plant does not exist
   */
  .get(authorize(), controller.count);

router
  .route('/all')
  /**
   * @api {get} v1/plant/all List Plants
   * @apiDescription List Plants information
   * @apiVersion 1.0.0
   * @apiName ListAllPlants
   * @apiGroup Plant
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object}   Plant        Plant
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     Plant does not exist
   */
  .get(authorize(), controller.list);


router
  .route('/group-by/city')
  /**
   * @api {get} v2/plant/group-by List Plants
   * @apiDescription List Plants information
   * @apiVersion 1.0.0
   * @apiName ListGroupedByPlants
   * @apiGroup Plant
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object}   Plant        Plant
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     Plant does not exist
   */
  .get(authorize(), controller.listGroupBy);

router
  .route('/full-structure')
  /**
   * @api {get} v2/plant/full-structure Create Plant Full Structure
   * @apiDescription Create Plant full structure
   * @apiVersion 2.0.0
   * @apiName CreatePlantFullStructure
   * @apiGroup Plant
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object}   Plant        Plant
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     Plant does not exist
   */
  .post(authorize(), controller.createFullStructure)
  /**
   * @api {get} v2/plant/list/full-structure List Plant Full Structure
   * @apiDescription List List full structure
   * @apiVersion 2.0.0
   * @apiName ListPlantFullStructure
   * @apiGroup Plant
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object}   Plant        Plant
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     Plant does not exist
   */
  .get(authorize(), controller.listFullStructure)
  /**
   * @api {get} v2/plant/list/full-structure List Plant Full Structure
   * @apiDescription List List full structure
   * @apiVersion 2.0.0
   * @apiName ListPlantFullStructure
   * @apiGroup Plant
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object}   Plant        Plant
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     Plant does not exist
   */
  .put(authorize(), controller.updateFullStructure);

router
  .route('/:id')
  /**
   * @api {get} v1/plant/:id Get Plant
   * @apiDescription Get Plant information
   * @apiVersion 1.0.0
   * @apiName GetPlant
   * @apiGroup Plant
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object}   Plant        Plant
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     Plant does not exist
   */
  .get(authorize(), controller.get)
  /**
   * @api {get} v1/plant/:id Delete Plant
   * @apiDescription Delete campaign category information
   * @apiVersion 1.0.0
   * @apiName DeletePlant
   * @apiGroup Plant
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess (No Content 204)  Successfully deleted
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     Plant does not exist
   */
  .delete(authorize(), controller.delete);

module.exports = router;
