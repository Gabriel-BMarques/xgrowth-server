const express = require('express');
const validate = require('express-validation');
const controller = require('../../../company-relation/controller/companyRelation.controller');
const userController = require('../../../user/controllers/user.controller');
const { authorize } = require('../../../authentication/middleware/auth');

const {
  createCompanyRelation,
  updateCompanyRelation,
} = require('../../../company-relation/validation/companyRelation.validation');

const router = express.Router();

/**
 * Load user when API with userId route parameter is hit
 */
router.param('userId', userController.load);

router
  .route('/')
  /**
   * @api {get} v1/company-relation Get companyRelation
   * @apiDescription Get Company Relation information
   * @apiVersion 1.0.0
   * @apiName GetcompanyRelation
   * @apiGroup companyRelation
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object}   companyRelation        Company Relation
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     companyRelation does not exist
   */
  .get(authorize(), controller.listByCompanyId)
  /**
   * @api {post} v1/company-relation Create Company Relation
   * @apiDescription Create a new Company Relation
   * @apiVersion 1.0.0
   * @apiName createCompanyRelation
   * @apiGroup companyRelation
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiParam  {Object}                 object   Company Relation object
   *
   * @apiSuccess (Created 201) {Object}  companyRelation        Company Relation
   *
   * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   */
  .post(authorize(), validate(createCompanyRelation), controller.create)
  /**
   * @api {put} v1/company-relation Update Company Relation
   * @apiDescription Update a Company Relation
   * @apiVersion 1.0.0
   * @apiName updateCompanyRelation
   * @apiGroup companyRelation
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiParam  {String}                 _id              Company Relation id
   * @apiParam  {Object}                 companyRelation   Company Relation object
   *
   * @apiSuccess {String}   _id        Company Relation id
   *
   * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     companyRelation does not exist
   */
  .put(authorize(), validate(updateCompanyRelation), controller.update);

router
  .route('/organizations')
  /**
   * @api {get} v2/company-relation List companyRelation organizations
   * @apiDescription List Company Relation information
   * @apiVersion 2.0.0
   * @apiName ListcompanyRelationOrganizations
   * @apiGroup companyRelation
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object}   companyRelation        Company Relation
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     companyRelation does not exist
   */
  .get(authorize(), controller.listRelatedOrganizations)

router
  .route('/suppliers/like')
  /**
   * @api {get} v1/company-relation/suppliers/like List companyRelation Suppliers May Like
   * @apiDescription List Company Relation Suppliers May Like information
   * @apiVersion 1.0.0
   * @apiName GetcompanyRelationSuppliersMayLike
   * @apiGroup companyRelation
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object}   companyRelation        Company Relation
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     companyRelation does not exist
   */
  .get(authorize(), controller.listSuppliersMayLike);

router
  .route('/all')
  /**
   * @api {get} v1/company-relation/all List All companyRelation with optional filter
   * @apiDescription List All Company Relation  information with optional filter
   * @apiVersion 1.0.0
   * @apiName ListAllcompanyRelation
   * @apiGroup companyRelation
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object}   companyRelation        Company Relation
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     companyRelation does not exist
   */
  .get(authorize(), controller.list);

router
  .route('/current-user/domain')
  /**
   * @api {get} v1/company-relation/current-user/domain Get companyRelation by current user domain
   * @apiDescription Get Company Relation information
   * @apiVersion 1.0.0
   * @apiName GetcompanyRelationByCurrentUserDomain
   * @apiGroup companyRelation
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object}   companyRelation        Company Relation
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     companyRelation does not exist
   */
  .get(authorize(), controller.getByUserDomain);

router
  .route('/current-user/domain/with-attachments')
  /**
   * @api {get} v1/company-relation/current-user/domain/with-attachments Get companyRelation by current user domain with attachments
   * @apiDescription Get Company Relation information with attachments
   * @apiVersion 1.0.0
   * @apiName GetcompanyRelationByCurrentUserDomainWithAttachments
   * @apiGroup companyRelation
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object}   companyRelation        Company Relation
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     companyRelation does not exist
   */
  .get(authorize(), controller.getByUserDomainWithAttachments);

router
  .route('/:id')
  /**
   * @api {get} v1/company-relation/:id Get companyRelation
   * @apiDescription Get Company Relation information
   * @apiVersion 1.0.0
   * @apiName GetcompanyRelation
   * @apiGroup companyRelation
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object}   companyRelation        Company Relation
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     companyRelation does not exist
   */
  .get(authorize(), controller.get)
  /**
   * @api {get} v2/company-relation/:id Delete companyRelation
   * @apiDescription Delete campaign companyRelation information
   * @apiVersion 2.0.0
   * @apiName DeletecompanyRelation
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
