const express = require("express");
const controller = require("../../../brief/controller/brief.controller");
const userController = require("../../../user/controllers/user.controller");
const { authorize } = require("../../../authentication/middleware/auth");

const router = express.Router();

/**
 * Load user when API with userId route parameter is hit
 */
router.param("userId", userController.load);

router
  .route("/")
  /**
   * @api {get} v2/brief List Briefs
   * @apiDescription List Briefs information
   * @apiVersion 2.0.0
   * @apiName GetBrief
   * @apiGroup Brief
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object}   Brief        Brief
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     Brief does not exist
   */
  // .get(authorize(), controller.listByCurrentUserDomain)
  .get(authorize(), controller.list)
  /**
   * @api {brief} v2/brief Create Brief
   * @apiDescription Create a new Brief
   * @apiVersion 2.0.0
   * @apiName createBrief
   * @apiGroup Brief
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiParam  {Object}                 object   Brief object
   *
   * @apiSuccess (Created 201) {Object}  Brief        Brief
   *
   * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   */
  .post(authorize(), controller.create)
  /**
   * @api {put} v2/brief Update Brief
   * @apiDescription Update a Brief
   * @apiVersion 2.0.0
   * @apiName updateBrief
   * @apiGroup Brief
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiParam  {String}                 _id       Brief id
   * @apiParam  {Object}                 Brief     Brief object
   *
   * @apiSuccess {String}   _id        Brief id
   *
   * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     Brief does not exist
   */
  .put(authorize(), controller.update);

router
  .route("/organization")
  /**
   * @api {get} v2/brief List Briefs By Organization
   * @apiDescription List Briefs information By Organization
   * @apiVersion 2.0.0
   * @apiName ListBriefsByOrganization
   * @apiGroup Brief
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object}   Brief        Brief
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     Brief does not exist
   */
  // .get(authorize(), controller.listByCurrentUserDomain)
  .get(authorize(), controller.listByOrganization);

router
  .route("/profile-briefs")
  /**
   * @api {get} v2/brief List Briefs By Organization
   * @apiDescription List Briefs information By Organization
   * @apiVersion 2.0.0
   * @apiName ListBriefsByOrganization
   * @apiGroup Brief
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object}   Brief        Brief
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     Brief does not exist
   */
  // .get(authorize(), controller.listByCurrentUserDomain)
  .get(authorize(), controller.listByOrganizationAdmin);

router
  .route("/company/list/:id")
  /**
   * @api {get} v2/brief/line/:lineId List briefs of a line
   * @apiDescription List briefs of a line information
   * @apiVersion 2.0.0
   * @apiName GetLineBriefs
   * @apiGroup Brief
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object}   Brief        Brief
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     Brief does not exist
   */
  .get(authorize(), controller.getCompanyBriefs);

router
  .route("/all")
  /**
   * @api {get} v2/brief/all List Briefs
   * @apiDescription List Briefs information
   * @apiVersion 2.0.0
   * @apiName ListAllBriefs
   * @apiGroup Brief
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object}   Brief        Brief
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     Brief does not exist
   */
  .get(authorize(), controller.list);

router
  .route("/feed")
  /**
   * @api {get} v2/brief/feed List Feed Briefs
   * @apiDescription List Briefs information
   * @apiVersion 2.0.0
   * @apiName ListFeedBriefs
   * @apiGroup Brief
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object}   Brief        Brief
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     Brief does not exist
   */
  .get(authorize(), controller.listFeedBriefsByCompany);

router.route("/brief-type").get(authorize(), controller.listBriefTypes);

router.route("/brief-type/:id").get(authorize(), controller.findBriefType);

router
  .route("/list/:id")
  /**
   * @api {get} v2/brief/list/:id List Company Profile Briefs
   * @apiDescription List Briefs information
   * @apiVersion 2.0.0
   * @apiName ListCompanyProfileBriefs
   * @apiGroup Brief
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object}   Brief        Brief
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     Brief does not exist
   */
  .get(authorize(), controller.listCompanyProfileBriefs);

router
  .route("/brief-company")
  /**
   * @api {get} v2/brief/:id Get Brief
   * @apiDescription Get Brief information
   * @apiVersion 2.0.0
   * @apiName GetBrief
   * @apiGroup Brief
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object}   Brief        Brief
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     Brief does not exist
   */
  .post(authorize(), controller.createBriefCompanies);

router
  .route("/brief-company/company/list/:id")
  /**
   * @api {get} v2/brief/:id Get Brief
   * @apiDescription Get Brief information
   * @apiVersion 2.0.0
   * @apiName GetBrief
   * @apiGroup Brief
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object}   Brief        Brief
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     Brief does not exist
   */
  .get(authorize(), controller.listBriefCompaniesByCompanyId);

router
  .route("/brief-company/list/:id")
  /**
   * @api {get} v2/brief/:id Get Brief
   * @apiDescription Get Brief information
   * @apiVersion 2.0.0
   * @apiName GetBrief
   * @apiGroup Brief
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object}   Brief        Brief
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     Brief does not exist
   */
  .get(authorize(), controller.listBriefCompanies);

router
  .route("/byOrganization")
  /**
   * @api {get} v2/brief/byOrganization Get Briefs by Organization
   * @apiDescription Get Briefs by Organization
   * @apiVersion 2.0.0
   * @apiName GetBriefsByOrganization
   * @apiGroup Brief
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object}   Brief        Brief
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     Brief does not exist
   */
  .get(authorize(), controller.listOrganizationBriefs);

router
  .route("/main-page")
  /**
   * @api {get} v2/brief/byOrganization Get Briefs for main page
   * @apiDescription Get Briefs for main page
   * @apiVersion 2.0.0
   * @apiName GetBriefsfor main page
   * @apiGroup Brief
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object}   Brief        Brief
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     Briefs not found
   */
  .get(authorize(), controller.getMainPageBriefs);

router
  .route("/fast-access")
  /**
   * @api {get} v2/brief/fast-access List Briefs User Actions
   * @apiDescription Get a list of briefs user actions
   * @apiVersion 1.0.0
   * @apiName ListBriefsUserActions
   * @apiGroup User
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiParam  {Number{1-}}         [page=1]     List page
   * @apiParam  {Number{1-100}}      [perPage=1]  Users per page
   * @apiParam  {String}             [name]       User's name
   * @apiParam  {String}             [email]      User's email
   * @apiParam  {String=user,admin}  [role]       User's role
   *
   * @apiSuccess {Object[]} users List of users.
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .get(authorize(), controller.listBriefsUserActions);

router
  .route("/last-viewed")
  /**
   * @api {get} v2/brief/last-viewed List last viewed Briefs
   * @apiDescription Get a list of briefs user actions
   * @apiVersion 1.0.0
   * @apiName listLastViewedBriefs
   * @apiGroup User
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiParam  {Number{1-}}         [page=1]     List page
   * @apiParam  {Number{1-100}}      [perPage=1]  Users per page
   * @apiParam  {String}             [name]       User's name
   * @apiParam  {String}             [email]      User's email
   * @apiParam  {String=user,admin}  [role]       User's role
   *
   * @apiSuccess {Object[]} users List of users.
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .get(authorize(), controller.listLastViewedBriefs);

router
  .route("/brief-company/remove/:id")
  /**
   * @api {get} v2/brief/:id Get Brief
   * @apiDescription Get Brief information
   * @apiVersion 2.0.0
   * @apiName GetBrief
   * @apiGroup Brief
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object}   Brief        Brief
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     Brief does not exist
   */
  .delete(authorize(), controller.removeBriefCompany);

router
  .route("/:id")
  /**
   * @api {get} v2/brief/:id Get Brief
   * @apiDescription Get Brief information
   * @apiVersion 2.0.0
   * @apiName GetBrief
   * @apiGroup Brief
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object}   Brief        Brief
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     Brief does not exist
   */
  .get(authorize(), controller.get)
  /**
   * @api {get} v2/brief/:id Delete Brief
   * @apiDescription Delete campaign category information
   * @apiVersion 2.0.0
   * @apiName DeleteBrief
   * @apiGroup Brief
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess (No Content 204)  Successfully deleted
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     Brief does not exist
   */
  .delete(authorize(), controller.remove);

module.exports = router;
