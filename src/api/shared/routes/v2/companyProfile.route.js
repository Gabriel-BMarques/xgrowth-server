const express = require('express');
const validate = require('express-validation');
const controller = require('../../../company-profile/controller/companyProfile.controller');
const userController = require('../../../user/controllers/user.controller');
const { authorize } = require('../../../authentication/middleware/auth');

const {
  createCompanyProfile,
  updateCompanyProfile,
} = require('../../../company-profile/validation/companyProfile.validation');

const router = express.Router();

/**
 * Load user when API with userId route parameter is hit
 */
router.param('userId', userController.load);

router
  .route('/')
  /**
   * @api {get} v1/company-profile Get CompanyProfile
   * @apiDescription Get Company Profile information
   * @apiVersion 1.0.0
   * @apiName GetCompanyProfile
   * @apiGroup CompanyProfile
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object}   companyProfile        Company Profile
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     CompanyProfile does not exist
   */
  .get(authorize(), controller.list)
  /**
   * @api {post} v1/company-profile Create Company Profile
   * @apiDescription Create a new Company Profile
   * @apiVersion 1.0.0
   * @apiName CreateCompanyProfile
   * @apiGroup CompanyProfile
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiParam  {Object}                 object   Company Profile object
   *
   * @apiSuccess (Created 201) {Object}  companyProfile        Company Profile
   *
   * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   */
  .post(authorize(), validate(createCompanyProfile), controller.create)
  /**
   * @api {put} v1/company-profile Update Company Profile
   * @apiDescription Update a Company Profile
   * @apiVersion 1.0.0
   * @apiName UpdateCompanyProfile
   * @apiGroup CompanyProfile
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiParam  {String}                 _id              Company Profile id
   * @apiParam  {Object}                 companyProfile   Company Profile object
   *
   * @apiSuccess {String}   _id        Company Profile id
   *
   * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     CompanyProfile does not exist
   */
  .put(authorize(), validate(updateCompanyProfile), controller.update);

router
  .route('/user-company')
  /**
   * @api {get} v1/user-company Get loggedIn user CompanyProfile
   * @apiDescription Get Company Profile information by userId
   * @apiVersion 1.0.0
   * @apiName GetCompanyProfile
   * @apiGroup CompanyProfile
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object}   companyProfile        Company Profile
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     CompanyProfile does not exist
   */
  .get(authorize(), controller.getByUserId);

router
  .route('/potential-clients')
  /**
   * @api {get} v1/company-profile/potential-clients List CompanyProfile Potential Clients
   * @apiDescription List Company Profile Potential Clients information
   * @apiVersion 1.0.0
   * @apiName GetCompanyProfilePotentialClients
   * @apiGroup CompanyProfile
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object}   companyProfile        Company Profile
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     CompanyProfile does not exist
   */
  .get(authorize(), controller.listPotentialClients);

router
  .route('/ByOrganization/list/:id')
  /**
   * @api {get} v1/company-profile/suppliers/like List CompanyProfile Suppliers May Like
   * @apiDescription List Company Profile Suppliers May Like information
   * @apiVersion 1.0.0
   * @apiName GetCompanyProfileSuppliersMayLike
   * @apiGroup CompanyProfile
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object}   companyProfile        Company Profile
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     CompanyProfile does not exist
   */
  .get(authorize(), controller.listByOrganization);

router
  .route('/all')
  /**
   * @api {get} v1/company-profile/all List All companyProfile with optional filter
   * @apiDescription List All Company Profile  information with optional filter
   * @apiVersion 1.0.0
   * @apiName ListAllCompanyProfile
   * @apiGroup CompanyProfile
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object}   companyProfile        Company Profile
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     CompanyProfile does not exist
   */
  .get(authorize(), controller.list);

router
  .route('/current-user/domain')
  /**
   * @api {get} v1/company-profile/current-user/domain Get CompanyProfile by current user domain
   * @apiDescription Get Company Profile information
   * @apiVersion 1.0.0
   * @apiName GetCompanyProfileByCurrentUserDomain
   * @apiGroup CompanyProfile
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object}   companyProfile        Company Profile
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     CompanyProfile does not exist
   */
  .get(authorize(), controller.getByUserDomain);

router
  .route('/current-user/domain/with-attachments')
  /**
   * @api {get} v1/company-profile/current-user/domain/with-attachments Get CompanyProfile by current user domain with attachments
   * @apiDescription Get Company Profile information with attachments
   * @apiVersion 1.0.0
   * @apiName GetCompanyProfileByCurrentUserDomainWithAttachments
   * @apiGroup CompanyProfile
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object}   companyProfile        Company Profile
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     CompanyProfile does not exist
   */
  .get(authorize(), controller.getByUserDomainWithAttachments);

router
  .route('/:id')
  /**
   * @api {get} v1/company-profile/:id Get CompanyProfile
   * @apiDescription Get Company Profile information
   * @apiVersion 1.0.0
   * @apiName GetCompanyProfile
   * @apiGroup CompanyProfile
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object}   companyProfile        Company Profile
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     CompanyProfile does not exist
   */
  .get(authorize(), controller.get);

module.exports = router;
