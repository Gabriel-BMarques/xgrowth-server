const express = require('express');
const validate = require('express-validation');
const controller = require('../../../organization/controller/organization.controller');
const orgTypeController = require('../../../organization/controller/organizationType.controller');
const initiativeController = require('../../../organization/controller/initiatives.controller');
const certificationController = require('../../../organization/controller/certification.controller');
const middleware = require('../../../organization/middlewares/organization.middleware');
const userController = require('../../../user/controllers/user.controller');
const { authorize, ADMIN } = require('../../../authentication/middleware/auth');

// const {
//   createOrganization,
//   updateOrganization,
// } = require('../../../company-profile/validation/organization.validation');

const router = express.Router();

/**
 * Load user when API with userId route parameter is hit
 */
router.param('userId', userController.load);

router
  .route('/')
  /**
   * @api {post} v1/company-profile Create Company Profile
   * @apiDescription Create a new Company Profile
   * @apiVersion 1.0.0
   * @apiName CreateOrganization
   * @apiGroup Organization
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiParam  {Object}                 object   Company Profile object
   *
   * @apiSuccess (Created 201) {Object}  Organization        Company Profile
   *
   * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   */
  .post(authorize(), controller.create)
  /**
   * @api {put} v1/company-profile Update Company Profile
   * @apiDescription Update a Company Profile
   * @apiVersion 1.0.0
   * @apiName UpdateOrganization
   * @apiGroup Organization
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiParam  {String}                 _id              Company Profile id
   * @apiParam  {Object}                 Organization   Company Profile object
   *
   * @apiSuccess {String}   _id        Company Profile id
   *
   * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     Organization does not exist
   */
  .put(authorize(), controller.update);

router
  .route('/all')
  /**
   * @api {get} v1/company-profile/suppliers/all List All Organization with optional filter
   * @apiDescription List All Company Profile  information with optional filter
   * @apiVersion 1.0.0
   * @apiName ListAllOrganization
   * @apiGroup Organization
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object}   Organization        Company Profile
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     Organization does not exist
   */
  .get(authorize(), controller.list);

router
  .route('/current-user/domain')
  /**
   * @api {get} v1/company-profile/current-user/domain Get Organization by current user domain
   * @apiDescription Get Company Profile information
   * @apiVersion 1.0.0
   * @apiName GetOrganizationByCurrentUserDomain
   * @apiGroup Organization
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object}   Organization        Company Profile
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     Organization does not exist
   */
  .get(authorize(), controller.getByUserDomain);

router  
  .route('/organization-type')
  /**
   * @api {get} v2/organization/organization-type List Organization Types
   * @apiDescription List Organization Types
   * @apiVersion 2.0.0
   * @apiName ListOrganizationTypes
   * @apiGroup Organization
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object}   Organization
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     Organization does not exist
   */
  .get(authorize(), orgTypeController.list)
  /**
   * @api {get} v2/organization/organization-type Create Organization Type
   * @apiDescription Create Organization Type
   * @apiVersion 2.0.0
   * @apiName CreateOrganizationType
   * @apiGroup Organization
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object}   Organization
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     Organization does not exist
   */
  .post(authorize(ADMIN), orgTypeController.create)
  /**
   * @api {get} v2/organization/organization-type Update Organization Type
   * @apiDescription Update Organization Type
   * @apiVersion 2.0.0
   * @apiName UpdateOrganizationType
   * @apiGroup Organization
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object}   Organization
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     Organization does not exist
   */
  .put(authorize(ADMIN), orgTypeController.update)

router
  .route('/organization-type/:id')
  /**
   * @api {get} v2/organization/organization-type Remove Organization Type
   * @apiDescription Remove Organization Type
   * @apiVersion 2.0.0
   * @apiName RemoveOrganizationType
   * @apiGroup Organization
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object}   Organization
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     Organization does not exist
   */
    .delete(authorize(ADMIN), orgTypeController.delete);

router  
  .route('/organization-type/sub-type')
  /**
   * @api {get} v2/organization/organization-type/sub-type List Organization SubTypes
   * @apiDescription List Organization SubTypes
   * @apiVersion 2.0.0
   * @apiName ListOrganizationSubTypes
   * @apiGroup Organization
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object}   Organization
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     Organization does not exist
   */
  .get(authorize(), orgTypeController.listSubTypes)

router  
  .route('/initiative')
  /**
   * @api {get} v2/organization/initiative List Organization Initiatives
   * @apiDescription List Organization Initiatives
   * @apiVersion 2.0.0
   * @apiName ListOrganizationInitiatives
   * @apiGroup Organization
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object}   Initiative
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     Initiative does not exist
   */
  .get(authorize(), initiativeController.list)
  /**
   * @api {get} v2/organization/initiative Create Organization Initiative
   * @apiDescription Create Organization Initiatives
   * @apiVersion 2.0.0
   * @apiName CreateOrganizationInitiatives\
   * @apiGroup Organization
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object}   Initiative
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     Initiative does not exist
   */
  .post(authorize(ADMIN), initiativeController.create)
  /**
   * @api {get} v2/organization/organization-type Update Organization Initiative
   * @apiDescription Update Organization Initiatives
   * @apiVersion 2.0.0
   * @apiName UpdateOrganizationInitiative
   * @apiGroup Organization
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object}   Initiative
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     Initiative does not exist
   */
  .put(authorize(ADMIN), initiativeController.update);
  
router
  .route('/initiative/:id')
  /**
   * @api {get} v2/organization/organization-type Remove Organization Initiative
   * @apiDescription Remove Organization Type
   * @apiVersion 2.0.0
   * @apiName RemoveOrganizationInitiative
   * @apiGroup Organization
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object}   Initiative
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     Initiative does not exist
   */
    .delete(authorize(ADMIN), initiativeController.delete);

router  
  .route('/certification')
  /**
   * @api {get} v2/organization/initiative List Organization Initiatives
   * @apiDescription List Organization Initiatives
   * @apiVersion 2.0.0
   * @apiName ListOrganizationInitiatives
   * @apiGroup Organization
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object}   Initiative
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     Initiative does not exist
   */
  .get(authorize(), certificationController.list)
  /**
   * @api {get} v2/organization/initiative Create Organization Initiative
   * @apiDescription Create Organization Initiatives
   * @apiVersion 2.0.0
   * @apiName CreateOrganizationInitiatives\
   * @apiGroup Organization
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object}   Initiative
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     Initiative does not exist
   */
  .post(authorize(ADMIN), certificationController.create)
  /**
   * @api {get} v2/organization/organization-type Update Organization Initiative
   * @apiDescription Update Organization Initiatives
   * @apiVersion 2.0.0
   * @apiName UpdateOrganizationInitiative
   * @apiGroup Organization
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object}   Initiative
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     Initiative does not exist
   */
  .put(authorize(ADMIN), certificationController.update);
    
router
  .route('/certification/:id')
  /**
   * @api {get} v2/organization/organization-type Remove Organization Initiative
   * @apiDescription Remove Organization Type
   * @apiVersion 2.0.0
   * @apiName RemoveOrganizationInitiative
   * @apiGroup Organization
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object}   Initiative
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     Initiative does not exist
   */
    .delete(authorize(ADMIN), certificationController.delete);

router
  .route('/:id')
  /**
   * @api {get} v1/company-profile/:id Get Organization
   * @apiDescription Get Company Profile information
   * @apiVersion 1.0.0
   * @apiName GetOrganization
   * @apiGroup Organization
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object}   Organization        Company Profile
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     Organization does not exist
   */
  .get(authorize(), controller.get, middleware.checkOrganizationPermissions);

module.exports = router;
