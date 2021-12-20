const express = require('express');
const controller = require('../../../brief-supplier/controller/briefSupplier.controller');
const userController = require('../../../user/controllers/user.controller');
const { authorize } = require('../../../authentication/middleware/auth');

const router = express.Router();

/**
 * Load user when API with userId route parameter is hit
 */
router.param('userId', userController.load);

router
  .route('/list/:id')
  /**
   * @api {get} v2/categoryBrief List briefcategories
   * @apiDescription List categoryBrief information
   * @apiVersion 2.0.0
   * @apiName Getbriefcategories
   * @apiGroup briefcategories
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object}   categoryBrief        briefcategories
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     categoryBrief does not exist
   */
  .get(authorize(), controller.listByBriefId);

router
  .route('/supplier/list/:id')
  /**
   * @api {get} v2/categoryBrief List briefcategories
   * @apiDescription List briefSuppliers information by supplier ID
   * @apiVersion 2.0.0
   * @apiName get briefSuppliers by supplier ID
   * @apiGroup briefcategories
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object}   briefSupplier        briefSuppliers
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     categoryBrief does not exist
   */
  .get(authorize(), controller.listBySupplierId);

router
  .route('/')
  /**
   * @api {briefcategories} v2/categoryBrief Create briefcategories
   * @apiDescription Create a new briefcategories
   * @apiVersion 2.0.0
   * @apiName createbriefcategories
   * @apiGroup briefcategories
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiParam  {Object}                 object   categoryBrief object
   *
   * @apiSuccess (Created 201) {Object}  categoryBrief        briefcategories
   *
   * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   */
  .post(authorize(), controller.create)
  /**
   * @api {put} v2/categoryBrief Update briefcategories
   * @apiDescription Update a briefcategories
   * @apiVersion 2.0.0
   * @apiName updatebriefcategories
   * @apiGroup briefcategories
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
  * @apiParam  {String}                 _id       categoryBrief id
   * @apiParam  {Object}                 categoryBrief     categoryBrief object
   *
   * @apiSuccess {String}   _id        categoryBrief id
   *
   * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     categoryBrief does not exist
   */
  .put(authorize(), controller.update)
  /**
   * @api {get} v2/briefSupplier List briefsuppliers
   * @apiDescription List briefSuppliers information
   * @apiVersion 2.0.0
   * @apiName get briefSuppliers
   * @apiGroup briefsuppliers
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object}   briefSupplier        briefSuppliers
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     categoryBrief does not exist
   */
  .get(authorize(), controller.list);



router
  .route('/organization')
  /**
   * @api {briefcategories} v2/brief-supplier/organization List Brief Supplier By Organization
   * @apiDescription List Brief Suppliers By Organization
   * @apiVersion 2.0.0
   * @apiName ListBriefSuppliersByOrganization
   * @apiGroup BriefSupplier
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiParam  {Object}                 object   BriefSupplier object
   *
   * @apiSuccess (Created 201) {Object}  BriefSupplier
   *
   * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   */
  .get(authorize(), controller.listByOrganization)

router
  .route('/all')
  /**
   * @api {get} v2/categoryBrief/all List briefcategories
   * @apiDescription List categoryBrief information
   * @apiVersion 2.0.0
   * @apiName ListAllbriefcategories
   * @apiGroup briefcategories
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object}   categoryBrief        briefcategories
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     categoryBrief does not exist
   */
  .get(authorize(), controller.list);

router
  .route('/:id')
  /**
   * @api {get} v2/categoryBrief/:id Get briefcategories
   * @apiDescription Get categoryBrief information
   * @apiVersion 2.0.0
   * @apiName Getbriefcategories
   * @apiGroup briefcategories
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object}   categoryBrief        briefcategories
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     categoryBrief does not exist
   */
  .get(authorize(), controller.get)
  /**
   * @api {get} v2/categoryBrief/:id Delete briefcategories
   * @apiDescription Delete campaign categoryBrief information
   * @apiVersion 2.0.0
   * @apiName Deletebriefcategories
   * @apiGroup briefcategories
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess (No Content 204)  Successfully deleted
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     categoryBrief does not exist
   */
  .delete(authorize(), controller.remove);

module.exports = router;
