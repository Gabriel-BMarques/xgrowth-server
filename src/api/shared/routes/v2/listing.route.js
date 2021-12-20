const express = require('express');
const validate = require('express-validation');
const controller = require('../../../listing/controller/listing.controller');
const userController = require('../../../user/controllers/user.controller');
const { authorize } = require('../../../authentication/middleware/auth');

const {
  createListing,
  updateListing,
} = require('../../../listing/validation/listing.validation');

const router = express.Router();

/**
 * Load user when API with userId route parameter is hit
 */
router.param('userId', userController.load);

router
  .route('/')
  /**
   * @api {get} v1/listing List Listings
   * @apiDescription List Listings information
   * @apiVersion 1.0.0
   * @apiName GetListing
   * @apiGroup Listing
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object}   Listing        Listing
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     Listing does not exist
   */
  .get(authorize(), controller.listByUserId)
  /**
   * @api {post} v1/listing Create Listing
   * @apiDescription Create a new Listing
   * @apiVersion 1.0.0
   * @apiName createListing
   * @apiGroup Listing
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiParam  {Object}                 object   Listing object
   *
   * @apiSuccess (Created 201) {Object}  Listing        Listing
   *
   * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   */
  .post(authorize(), validate(createListing), controller.create)
  /**
   * @api {put} v1/listing Update Listing
   * @apiDescription Update a Listing
   * @apiVersion 1.0.0
   * @apiName updateListing
   * @apiGroup Listing
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
  * @apiParam  {String}                 _id       Listing id
   * @apiParam  {Object}                 Listing     Listing object
   *
   * @apiSuccess {String}   _id        Listing id
   *
   * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     Listing does not exist
   */
  .put(authorize(), validate(updateListing), controller.update);

router
  .route('/line/:lineId')
  /**
   * @api {get} v1/listing/line/:lineId List Listings of a line
   * @apiDescription List Listings of a line information
   * @apiVersion 1.0.0
   * @apiName GetLineListings
   * @apiGroup Listing
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object}   Listing        Listing
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     Listing does not exist
   */
  .get(authorize(), controller.listByLineId);

router
  .route('/:id')
  /**
   * @api {get} v1/listing/:id Get Listing
   * @apiDescription Get Listing information
   * @apiVersion 1.0.0
   * @apiName GetListing
   * @apiGroup Listing
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object}   Listing        Listing
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     Listing does not exist
   */
  .get(authorize(), controller.get)
  /**
   * @api {get} v1/listing/:id Delete Listing
   * @apiDescription Delete campaign category information
   * @apiVersion 1.0.0
   * @apiName DeleteListing
   * @apiGroup Listing
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess (No Content 204)  Successfully deleted
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     Listing does not exist
   */
  .delete(authorize(), controller.remove);

router
  .route('/:id/proposal')
  /**
   * @api {get} v1/listing/:id/proposal Send proposal
   * @apiDescription Send proposal
   * @apiVersion 1.0.0
   * @apiName SendProposal
   * @apiGroup Listing
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object}   Listing        Listing
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     Listing does not exist
   */
  .post(authorize(), controller.sendProposal);

router
  .route('/user/:userId/count')
  /**
   * @api {get} v1/listing/user/:userId/count Count Listing by user
   * @apiDescription Count Listing information
   * @apiVersion 1.0.0
   * @apiName CountListingByUser
   * @apiGroup Listing
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object}   Listing        Listing
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     Listing does not exist
   */
  .get(authorize(), controller.countByUserId);

module.exports = router;
