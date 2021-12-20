const express = require('express');
const validate = require('express-validation');
const controller = require('../../../user/controllers/user.controller');
const middleware = require('../../../user/middlewares/user.middleware');
const {
  listUsers,
  createUser,
  replaceUser,
  updateUser,
} = require('../../../user/validations/user.validation');
const { authorize, ADMIN, LOGGED_USER } = require('../../../authentication/middleware/auth');
const router = express.Router();

/**
 * Load user when API with userId route parameter is hit
 */
router.param('userId', controller.load);


router
  .route('/')
/**
     * @api {get} v1/users List Users
     * @apiDescription Get a list of users
     * @apiVersion 1.0.0
     * @apiName ListUsers
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
  .get(validate(listUsers), controller.list)
/**
     * @api {post} v1/users Create User
     * @apiDescription Create a new user
     * @apiVersion 1.0.0
     * @apiName CreateUser
     * @apiGroup User
     * @apiPermission admin
     *
     * @apiHeader {String} Authorization   User's access token
     *
     * @apiParam  {String}             email     User's email
     * @apiParam  {String{6..128}}     password  User's password
     * @apiParam  {String{..128}}      [name]    User's name
     * @apiParam  {String=user,admin}  [role]    User's role
     *
     * @apiSuccess (Created 201) {String}  id         User's id
     * @apiSuccess (Created 201) {String}  name       User's name
     * @apiSuccess (Created 201) {String}  email      User's email
     * @apiSuccess (Created 201) {String}  role       User's role
     * @apiSuccess (Created 201) {Date}    createdAt  Timestamp
     *
     * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
     * @apiError (Unauthorized 401)  Unauthorized     Only authenticated users can create the data
     * @apiError (Forbidden 403)     Forbidden        Only admins can create the data
     */
  .post(authorize(ADMIN), validate(createUser), controller.create)
/**
     * @api {put} v1/users/:id Replace User
     * @apiDescription Replace the whole user document with a new one
     * @apiVersion 1.0.0
     * @apiName ReplaceUser
     * @apiGroup User
     * @apiPermission user
     *
     * @apiHeader {String} Authorization   User's access token
     *
     * @apiParam  {String}             email     User's email
     * @apiParam  {String{6..128}}     password  User's password
     * @apiParam  {String{..128}}      [name]    User's name
     * @apiParam  {String=user,admin}  [role]    User's role
     * (You must be an admin to change the user's role)
     *
     * @apiSuccess {String}  id         User's id
     * @apiSuccess {String}  name       User's name
     * @apiSuccess {String}  email      User's email
     * @apiSuccess {String}  role       User's role
     * @apiSuccess {Date}    createdAt  Timestamp
     *
     * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
     * @apiError (Unauthorized 401) Unauthorized Only authenticated users can modify the data
     * @apiError (Forbidden 403)    Forbidden    Only user with same id or admins can modify the data
     * @apiError (Not Found 404)    NotFound     User does not exist
     */
    .put(authorize(LOGGED_USER), controller.updateLoggedUser)

router
  .route('/all')
  /**
   * @api {get} v2/users/all List users
   * @apiDescription List users information
   * @apiVersion 2.0.0
   * @apiName ListAllusers
   * @apiGroup users
   * @apiPermission Admin
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object}   users        users
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     users does not exist
   */
  .get(authorize(), controller.listAll);

router
  .route('/coworkers')
  /**
     * @api {get} v2/users/coworkers User Profile
     * @apiDescription List users by current user company
     * @apiVersion 2.0.0
     * @apiName Coworkers
     * @apiGroup User
     * @apiPermission user
     *
     * @apiHeader {String} Authorization   User's access token
     *
     * @apiSuccess {String}  id         User's id
     * @apiSuccess {String}  name       User's name
     * @apiSuccess {String}  email      User's email
     * @apiSuccess {String}  role       User's role
     * @apiSuccess {Date}    createdAt  Timestamp
     *
     * @apiError (Unauthorized 401)  Unauthorized  Only authenticated Users can access the data
     */
  .get(authorize(), controller.listByCurrentUserCompany);

router
  .route('/company/list/:id')
  /**
     * @api {get} v2/users/company/list/:id User Profile
     * @apiDescription List users by company
     * @apiVersion 2.0.0
     * @apiName Coworkers
     * @apiGroup User
     * @apiPermission user
     *
     * @apiHeader {String} Authorization   User's access token
     *
     * @apiSuccess {String}  id         User's id
     * @apiSuccess {String}  name       User's name
     * @apiSuccess {String}  email      User's email
     * @apiSuccess {String}  role       User's role
     * @apiSuccess {Date}    createdAt  Timestamp
     *
     * @apiError (Unauthorized 401)  Unauthorized  Only authenticated Users can access the data
     */
  .get(authorize(), controller.listUsersByCompanyId);


router
  .route('/profile')
/**
     * @api {get} v1/users/profile User Profile
     * @apiDescription Get logged in user profile information
     * @apiVersion 1.0.0
     * @apiName UserProfile
     * @apiGroup User
     * @apiPermission user
     *
     * @apiHeader {String} Authorization   User's access token
     *
     * @apiSuccess {String}  id         User's id
     * @apiSuccess {String}  name       User's name
     * @apiSuccess {String}  email      User's email
     * @apiSuccess {String}  role       User's role
     * @apiSuccess {Date}    createdAt  Timestamp
     *
     * @apiError (Unauthorized 401)  Unauthorized  Only authenticated Users can access the data
     */
  .get(authorize(), controller.getUserProfile, middleware.checkBriefVisualizationPermissions);

router
  .route('/verifyUser')
/**
     * @api {post} v1/users/verifyEmail User Profile
     * @apiDescription Verify if user email already exists
     * @apiVersion 1.0.0
     * @apiName UserProfile
     * @apiGroup User
     *
     *
     * @apiSuccess {String}  id         User's id
     * @apiSuccess {String}  name       User's name
     * @apiSuccess {String}  email      User's email
     * @apiSuccess {String}  role       User's role
     * @apiSuccess {Date}    createdAt  Timestamp
     *
     */
  .post(controller.verifyUserEmail);

router
  .route('/loggedIn')
/**
     * @api {get} v1/users/logged User Profile
     * @apiDescription Get logged in user profile information
     * @apiVersion 1.0.0
     * @apiName UserProfile
     * @apiGroup User
     * @apiPermission user
     *
     * @apiHeader {String} Authorization   User's access token
     *
     * @apiSuccess {String}  id         User's id
     * @apiSuccess {String}  name       User's name
     * @apiSuccess {String}  email      User's email
     * @apiSuccess {String}  role       User's role
     * @apiSuccess {Date}    createdAt  Timestamp
     *
     * @apiError (Unauthorized 401)  Unauthorized  Only authenticated Users can access the data
     */
  .get(authorize(), controller.loggedIn);

router
  .route('/company')
/**
     * @api {get} v1/users/company User Company
     * @apiDescription Get logged in user company
     * @apiVersion 1.0.0
     * @apiName UserCompany
     * @apiGroup User
     * @apiPermission user
     *
     * @apiHeader {String} Authorization   User's access token
     *
     * @apiSuccess {String}  id         User's id
     * @apiSuccess {String}  name       User's name
     * @apiSuccess {String}  email      User's email
     * @apiSuccess {String}  role       User's role
     * @apiSuccess {Date}    createdAt  Timestamp
     *
     * @apiError (Unauthorized 401)  Unauthorized  Only authenticated Users can access the data
     */
  .get(authorize(), controller.getUserCompany);
router
  .route('/related-companies')
/**
     * @api {get} v1/users/company User Company
     * @apiDescription Get logged in user company
     * @apiVersion 1.0.0
     * @apiName UserCompany
     * @apiGroup User
     * @apiPermission user
     *
     * @apiHeader {String} Authorization   User's access token
     *
     * @apiSuccess {String}  id         User's id
     * @apiSuccess {String}  name       User's name
     * @apiSuccess {String}  email      User's email
     * @apiSuccess {String}  role       User's role
     * @apiSuccess {Date}    createdAt  Timestamp
     *
     * @apiError (Unauthorized 401)  Unauthorized  Only authenticated Users can access the data
     */
  .get(authorize(), controller.getUserRelatedCompanies);

router
  .route('/user-action')
/**
     * @api {get} v1/users/user-action List User Actions
     * @apiDescription Get a list of user actions
     * @apiVersion 1.0.0
     * @apiName ListUserActions
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
  .get(authorize(), controller.listUserActions)
/**
     * @api {post} v1/users/user-action Create User Action
     * @apiDescription Create a new user action
     * @apiVersion 1.0.0
     * @apiName CreateUserAction
     * @apiGroup User
     * @apiPermission admin
     *
     * @apiHeader {String} Authorization   User's access token
     *
     * @apiParam  {String}             email     User's email
     * @apiParam  {String{6..128}}     password  User's password
     * @apiParam  {String{..128}}      [name]    User's name
     * @apiParam  {String=user,admin}  [role]    User's role
     *
     * @apiSuccess (Created 201) {String}  id         User's id
     * @apiSuccess (Created 201) {String}  name       User's name
     * @apiSuccess (Created 201) {String}  email      User's email
     * @apiSuccess (Created 201) {String}  role       User's role
     * @apiSuccess (Created 201) {Date}    createdAt  Timestamp
     *
     * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
     * @apiError (Unauthorized 401)  Unauthorized     Only authenticated users can create the data
     * @apiError (Forbidden 403)     Forbidden        Only admins can create the data
     */
  .post(authorize(), controller.createUserAction)
/**
     * @api {put} v1/users/user-action Replace User
     * @apiDescription Update user action
     * @apiVersion 1.0.0
     * @apiName UpdateUserAction
     * @apiGroup User
     * @apiPermission user
     *
     * @apiHeader {String} Authorization   User's access token
     *
     * @apiParam  {String}             email     User's email
     * @apiParam  {String{6..128}}     password  User's password
     * @apiParam  {String{..128}}      [name]    User's name
     * @apiParam  {String=user,admin}  [role]    User's role
     * (You must be an admin to change the user's role)
     *
     * @apiSuccess {String}  id         User's id
     * @apiSuccess {String}  name       User's name
     * @apiSuccess {String}  email      User's email
     * @apiSuccess {String}  role       User's role
     * @apiSuccess {Date}    createdAt  Timestamp
     *
     * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
     * @apiError (Unauthorized 401) Unauthorized Only authenticated users can modify the data
     * @apiError (Forbidden 403)    Forbidden    Only user with same id or admins can modify the data
     * @apiError (Not Found 404)    NotFound     User does not exist
     */
    .put(authorize(), controller.updateUserAction)

router
  .route('/user-action/many')
  /**
     * @api {get} v1/users/user-action Create Many User Actions
     * @apiDescription Create a list of user actions
     * @apiVersion 1.0.0
     * @apiName CreateManyUserActions
     * @apiGroup User
     * @apiPermission admin
     *
     * @apiHeader {String} Authorization   User's access token
     *
     * @apiSuccess {Object[]} users List of userActions.
     *
     * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
     * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
     */
  .post(authorize(), controller.createManyUserActions)

router
  .route('/:userId')
/**
     * @api {get} v1/users/:id Get User
     * @apiDescription Get user information
     * @apiVersion 1.0.0
     * @apiName GetUser
     * @apiGroup User
     * @apiPermission user
     *
     * @apiHeader {String} Authorization   User's access token
     *
     * @apiSuccess {String}  id         User's id
     * @apiSuccess {String}  name       User's name
     * @apiSuccess {String}  email      User's email
     * @apiSuccess {String}  role       User's role
     * @apiSuccess {Date}    createdAt  Timestamp
     *
     * @apiError (Unauthorized 401) Unauthorized Only authenticated users can access the data
     * @apiError (Forbidden 403)    Forbidden    Only user with same id or admins can access the data
     * @apiError (Not Found 404)    NotFound     User does not exist
     */
  .get(authorize(LOGGED_USER), controller.get)
/**
     * @api {put} v1/users/:id Replace User
     * @apiDescription Replace the whole user document with a new one
     * @apiVersion 1.0.0
     * @apiName ReplaceUser
     * @apiGroup User
     * @apiPermission user
     *
     * @apiHeader {String} Authorization   User's access token
     *
     * @apiParam  {String}             email     User's email
     * @apiParam  {String{6..128}}     password  User's password
     * @apiParam  {String{..128}}      [name]    User's name
     * @apiParam  {String=user,admin}  [role]    User's role
     * (You must be an admin to change the user's role)
     *
     * @apiSuccess {String}  id         User's id
     * @apiSuccess {String}  name       User's name
     * @apiSuccess {String}  email      User's email
     * @apiSuccess {String}  role       User's role
     * @apiSuccess {Date}    createdAt  Timestamp
     *
     * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
     * @apiError (Unauthorized 401) Unauthorized Only authenticated users can modify the data
     * @apiError (Forbidden 403)    Forbidden    Only user with same id or admins can modify the data
     * @apiError (Not Found 404)    NotFound     User does not exist
     */
  .put(authorize(LOGGED_USER), validate(replaceUser), controller.replace)
/**
     * @api {patch} v1/users/:id Update User
     * @apiDescription Update some fields of a user document
     * @apiVersion 1.0.0
     * @apiName UpdateUser
     * @apiGroup User
     * @apiPermission user
     *
     * @apiHeader {String} Authorization   User's access token
     *
     * @apiParam  {String}             email     User's email
     * @apiParam  {String{6..128}}     password  User's password
     * @apiParam  {String{..128}}      [name]    User's name
     * @apiParam  {String=user,admin}  [role]    User's role
     * (You must be an admin to change the user's role)
     *
     * @apiSuccess {String}  id         User's id
     * @apiSuccess {String}  name       User's name
     * @apiSuccess {String}  email      User's email
     * @apiSuccess {String}  role       User's role
     * @apiSuccess {Date}    createdAt  Timestamp
     *
     * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
     * @apiError (Unauthorized 401) Unauthorized Only authenticated users can modify the data
     * @apiError (Forbidden 403)    Forbidden    Only user with same id or admins can modify the data
     * @apiError (Not Found 404)    NotFound     User does not exist
     */
  .patch(controller.update)
/**
     * @api {patch} v1/users/:id Delete User
     * @apiDescription Delete a user
     * @apiVersion 1.0.0
     * @apiName DeleteUser
     * @apiGroup User
     * @apiPermission user
     *
     * @apiHeader {String} Authorization   User's access token
     *
     * @apiSuccess (No Content 204)  Successfully deleted
     *
     * @apiError (Unauthorized 401) Unauthorized  Only authenticated users can delete the data
     * @apiError (Forbidden 403)    Forbidden     Only user with same id or admins can delete the data
     * @apiError (Not Found 404)    NotFound      User does not exist
     */
  .delete(authorize(LOGGED_USER), controller.remove);


module.exports = router;
