const express = require('express');
const controller = require('../../../organization/controller/segment.controller');
const userController = require('../../../user/controllers/user.controller');
const { authorize } = require('../../../authentication/middleware/auth');

const router = express.Router();

/**
 * Load user when API with userId route parameter is hit
 */
router.param('userId', userController.load);

router
  .route('/')
  /**
   * @api {get} v1/Segment List Segments
   * @apiDescription List Segments information
   * @apiVersion 1.0.0
   * @apiName GetSegment
   * @apiGroup Segment
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object}   Segment        Segment
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     Segment does not exist
   */
  .get(authorize(), controller.list)
  /**
   * @api {post} v1/Segment Create Segment
   * @apiDescription Create a new Segment
   * @apiVersion 1.0.0
   * @apiName createSegment
   * @apiGroup Segment
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiParam  {Object}                 object   Segment object
   *
   * @apiSuccess (Created 201) {Object}  Segment        Segment
   *
   * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   */
  .post(authorize(), controller.create)
  /**
   * @api {put} v1/Segment Update Segment
   * @apiDescription Update a Segment
   * @apiVersion 1.0.0
   * @apiName UpdateSegment
   * @apiGroup Segment
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
  * @apiParam  {String}                 _id       Segment id
   * @apiParam  {Object}                 Segment     Segment object
   *
   * @apiSuccess {String}   _id        Segment id
   *
   * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     Segment does not exist
   */
  .put(authorize(), controller.update);

router
  .route('/all')
  /**
   * @api {get} v1/Segment/all List Segments
   * @apiDescription List Segments information
   * @apiVersion 1.0.0
   * @apiName ListAllSegments
   * @apiGroup Segment
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object}   Segment        Segment
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     Segment does not exist
   */
  .get(authorize(), controller.list);

router
  .route('/sub-segment')
  /**
   * @api {get} v1/Segment/all List Sub Segments
   * @apiDescription List Sub Segments information
   * @apiVersion 1.0.0
   * @apiName ListSubSegments
   * @apiGroup Segment
   * @apiPermission User
   *
   * @apiHeader {String} Authorization User's access token
   *
   * @apiSuccess {Object}   Segment
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     Segment does not exist
   */
  .get(authorize(), controller.listSubSegments);

router
  .route('/:id')
  /**
   * @api {get} v2/segment/:id Get Segment
   * @apiDescription Get Segment Information
   * @apiVersion 2.0.0
   * @apiName GetSegment
   * @apiGroup Segment
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess (No Content 204)  Successfully deleted
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     Segment does not exist
   */
   .get(authorize(), controller.get)
    /**
   * @api {get} v2/segment/:id Delete Segment
   * @apiDescription Delete campaign category information
   * @apiVersion 2.0.0
   * @apiName DeleteSegment
   * @apiGroup Segment
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess (No Content 204)  Successfully deleted
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     Segment does not exist
   */
  .delete(authorize(), controller.remove);

module.exports = router;
