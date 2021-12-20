const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/misc.controller');
const userController = require('../../../user/controllers/user.controller');
const { authorize, ADMIN } = require('../../../authentication/middleware/auth');
const jobTitleMiddleware = require('../../middlewares/jobtitleNormalizer');
const departmentMiddleware = require('../../middlewares/departmentNormalizer');

const {
  createAuxEntity,
  createCompany,
} = require('../../validations/misc.validation');

const router = express.Router();

/**
 * Load user when API with userId route parameter is hit
 */
router.param('userId', userController.load);

router
  .route('/country')
  /**
   * @api {get} v2/misc/country List Countries
   * @apiDescription Get a list of Countries
   * @apiVersion 1.0.0
   * @apiName ListCountry
   * @apiGroup Misc
   * @apiPermission user
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiSuccess {Object[]} List of Country.
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   */
  .get(authorize(), controller.listCountries)
  /**
   * @api {post} v2/misc/country Create Country
   * @apiDescription Create a new Country
   * @apiVersion 1.0.0
   * @apiName CreateCountry
   * @apiGroup Misc
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiParam  {String}             name      Country name
   * @apiParam  {String}             name      Country description
   *
   * @apiSuccess (Created 201) {String}  id           Country id
   * @apiSuccess (Created 201) {String}  name         Country name
   * @apiSuccess (Created 201) {String}  description  Country description
   * @apiSuccess (Created 201) {Date}    createdAt    Timestamp
   *
   * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401)  Unauthorized     Only authenticated users can create the data
   * @apiError (Forbidden 403)     Forbidden        Only admins can create the data
   */
  .post(authorize(ADMIN), validate(createAuxEntity), controller.createCountry);

router
  .route('/country/by-global-region')
  /**
   * @api {get} v2/country/by-global-region Get countries by global region
   * @apiDescription Get Country information by global region
   * @apiVersion 2.0.0
   * @apiName GetCountryByGlobalRegion
   * @apiGroup Country
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object}   country        Country
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     Country does not exist
   */
  .get(authorize(), controller.listCountriesByGlobalRegion);

router
  .route('/country/:id')
  /**
   * @api {get} v1/country/:id Get country
   * @apiDescription Get Country information
   * @apiVersion 1.0.0
   * @apiName GetCountry
   * @apiGroup Country
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object}   country        Country
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     Country does not exist
   */
  .get(authorize(), controller.getCountry);

router
  .route('/state-province')
  /**
   * @api {get} v2/misc/state-province List StateProvinces
   * @apiDescription Get a list of StateProvinces
   * @apiVersion 1.0.0
   * @apiName ListStateProvince
   * @apiGroup Misc
   * @apiPermission user
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiSuccess {Object[]} List of StateProvinces.
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   */
  .get(authorize(), controller.listStateProvinces)

router
  .route('/city')
  /**
   * @api {get} v2/misc/city List City
   * @apiDescription Get a list of Cities
   * @apiVersion 1.0.0
   * @apiName ListCity
   * @apiGroup Misc
   * @apiPermission user
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiSuccess {Object[]} List of City.
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   */
  .get(authorize(), controller.listCities)


router
  .route('/category')
  /**
   * @api {get} v2/misc/post-category List Post Category
   * @apiDescription Get a list of Post Category
   * @apiVersion 1.0.0
   * @apiName ListProductCategories
   * @apiGroup Misc
   * @apiPermission user
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiSuccess {Object[]} productCategories List of Post Category.
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   */
  .get(authorize(), controller.listCategories)
  /**
   * @api {post} v2/misc/post-category Post Category
   * @apiDescription Create a new Post Category
   * @apiVersion 1.0.0
   * @apiName CreateProductCategory
   * @apiGroup Misc
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiParam  {String}             name      Post Category name
   * @apiParam  {String}             name      Post Category description
   *
   * @apiSuccess (Created 201) {String}  id           Post Category id
   * @apiSuccess (Created 201) {String}  name         Post Category name
   * @apiSuccess (Created 201) {String}  description  Post Category description
   * @apiSuccess (Created 201) {Date}    createdAt    Timestamp
   *
   * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401)  Unauthorized     Only authenticated users can create the data
   * @apiError (Forbidden 403)     Forbidden        Only admins can create the data
   */
  .post(authorize(ADMIN), validate(createAuxEntity), controller.createProductCategory);

router
  .route('/subcategory')
  /**
   * @api {get} v2/misc/post-sub-category List Post Sub-Category
   * @apiDescription Get a list of Post Sub-Category
   * @apiVersion 1.0.0
   * @apiName ListProductCategoryOutputs
   * @apiGroup Misc
   * @apiPermission user
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiSuccess {Object[]} productCategoryOutputs List of Post Sub-Category.
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   */
  .get(authorize(), controller.listSubCategories)
  /**
   * @api {post} v2/misc/post-category-output Post Sub-Category
   * @apiDescription Create a new Post Sub-Category
   * @apiVersion 1.0.0
   * @apiName CreateProductCategoryOutput
   * @apiGroup Misc
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiParam  {String}             name      Post Sub-Category name
   * @apiParam  {String}             name      Post Sub-Category description
   *
   * @apiSuccess (Created 201) {String}  id           Post Sub-Category id
   * @apiSuccess (Created 201) {String}  name         Post Sub-Category name
   * @apiSuccess (Created 201) {String}  description  Post Sub-Category description
   * @apiSuccess (Created 201) {Date}    createdAt    Timestamp
   *
   * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401)  Unauthorized     Only authenticated users can create the data
   * @apiError (Forbidden 403)     Forbidden        Only admins can create the data
   */
  .post(authorize(ADMIN), validate(createAuxEntity), controller.createProductCategoryOutput);

router
  .route('/department')
  /**
   * @api {get} v2/misc/department List Department
   * @apiDescription Get a list of Department
   * @apiVersion 1.0.0
   * @apiName ListDepartments
   * @apiGroup Misc
   * @apiPermission user
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiSuccess {Object[]} result List of Departments.
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   */
  .get(authorize(), controller.listDepartments)
  /**
   * @api {post} v2/misc/department Create Department
   * @apiDescription Create a new Department
   * @apiVersion 1.0.0
   * @apiName CreateDepartment
   * @apiGroup Misc
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiParam  {String}             name      Department name
   * @apiParam  {String}             name      Department description
   *
   * @apiSuccess (Created 201) {String}  id           Department id
   * @apiSuccess (Created 201) {String}  name         Department name
   * @apiSuccess (Created 201) {String}  description  Department description
   * @apiSuccess (Created 201) {Date}    createdAt    Timestamp
   *
   * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401)  Unauthorized     Only authenticated users can create the data
   * @apiError (Forbidden 403)     Forbidden        Only admins can create the data
   */
  .post(authorize(ADMIN), validate(createAuxEntity), controller.createDepartment)
  /**
   * @api {put} v2/misc/department Create Department
   * @apiDescription Create a new Department
   * @apiVersion 1.0.0
   * @apiName CreateDepartment
   * @apiGroup Misc
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiParam  {String}             name      Department name
   * @apiParam  {String}             name      Department description
   *
   * @apiSuccess (Created 201) {String}  id           Department id
   * @apiSuccess (Created 201) {String}  name         Department name
   * @apiSuccess (Created 201) {String}  description  Department description
   * @apiSuccess (Created 201) {Date}    createdAt    Timestamp
   *
   * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401)  Unauthorized     Only authenticated users can create the data
   * @apiError (Forbidden 403)     Forbidden        Only admins can create the data
   */
  .put(authorize(ADMIN), validate(createAuxEntity), departmentMiddleware.updateUsers, controller.updateDepartment);

router
  .route('/department/:id')
  .delete(authorize(), controller.removeDepartment);

router
  .route('/job-title')
  /**
   * @api {get} v2/misc/job-title List JobTitle
   * @apiDescription Get a list of JobTitle
   * @apiVersion 1.0.0
   * @apiName ListJobTitles
   * @apiGroup Misc
   * @apiPermission user
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiSuccess {Object[]} result List of JobTitle.
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   */
  .get(authorize(), controller.listJobTitles)
  /**
   * @api {post} v2/misc/job-title Create JobTitle
   * @apiDescription Create a new JobTitle
   * @apiVersion 1.0.0
   * @apiName CreateJobTitle
   * @apiGroup Misc
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiParam  {String}             name      JobTitle name
   * @apiParam  {String}             name      JobTitle description
   *
   * @apiSuccess (Created 201) {String}  id           JobTitle id
   * @apiSuccess (Created 201) {String}  name         JobTitle name
   * @apiSuccess (Created 201) {String}  description  JobTitle description
   * @apiSuccess (Created 201) {Date}    createdAt    Timestamp
   *
   * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401)  Unauthorized     Only authenticated users can create the data
   * @apiError (Forbidden 403)     Forbidden        Only admins can create the data
   */
  .post(authorize(ADMIN), validate(createAuxEntity), controller.createJobTitle)
  /**
   * @api {post} v2/misc/job-title Create JobTitle
   * @apiDescription Create a new JobTitle
   * @apiVersion 1.0.0
   * @apiName CreateJobTitle
   * @apiGroup Misc
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiParam  {String}             name      JobTitle name
   * @apiParam  {String}             name      JobTitle description
   *
   * @apiSuccess (Created 201) {String}  id           JobTitle id
   * @apiSuccess (Created 201) {String}  name         JobTitle name
   * @apiSuccess (Created 201) {String}  description  JobTitle description
   * @apiSuccess (Created 201) {Date}    createdAt    Timestamp
   *
   * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401)  Unauthorized     Only authenticated users can create the data
   * @apiError (Forbidden 403)     Forbidden        Only admins can create the data
   */
  .put(authorize(ADMIN), validate(createAuxEntity), jobTitleMiddleware.updateUsers, controller.updateJobTitle);

router
  .route('/job-title/:id')
  .delete(authorize(), controller.removeJobTitle);

router
  .route('/phone-prefix')
  /**
   * @api {get} v2/misc/phone-prefix List PhonePrefix
   * @apiDescription Get a list of PhonePrefix
   * @apiVersion 1.0.0
   * @apiName ListPhonePrefixes
   * @apiGroup Misc
   * @apiPermission user
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiSuccess {Object[]} result List of Companies.
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   */
  .get(authorize(), controller.listPhonePrefixes)
  /**
   * @api {post} v2/misc/phone-prefix Create PhonePrefix
   * @apiDescription Create a new PhonePrefix
   * @apiVersion 1.0.0
   * @apiName CreatePhonePrefix
   * @apiGroup Misc
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiParam  {String}             name      PhonePrefix name
   * @apiParam  {String}             name      PhonePrefix description
   *
   * @apiSuccess (Created 201) {String}  id           PhonePrefix id
   * @apiSuccess (Created 201) {String}  name         PhonePrefix name
   * @apiSuccess (Created 201) {String}  description  PhonePrefix description
   * @apiSuccess (Created 201) {Date}    createdAt    Timestamp
   *
   * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401)  Unauthorized     Only authenticated users can create the data
   * @apiError (Forbidden 403)     Forbidden        Only admins can create the data
   */
  .post(authorize(ADMIN), validate(createAuxEntity), controller.createPhonePrefix);

router
  .route('/market-type')
  /**
   * @api {get} v2/misc/market-type List Markets
   * @apiDescription Get a list of Market
   * @apiVersion 1.0.0
   * @apiName ListMarkets
   * @apiGroup Misc
   * @apiPermission user
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiSuccess {Object[]} result List of Markets.
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   */
  .get(authorize(), controller.listMarketTypes)

module.exports = router;
