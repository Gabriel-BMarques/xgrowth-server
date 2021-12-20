/* eslint-disable max-len */
const express = require('express');
const controller = require('../../../post/controller/postRating.controller');
const { authorize } = require('../../../authentication/middleware/auth');
const router = express.Router();

router
  .route('/')
  /**
   * @api {post} v2/post-rating Create PostRating
   * @apiDescription Create a new PostRating
   * @apiVersion 1.0.0
   * @apiName CreatePostRating
   * @apiGroup PostRating
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiParam  {Object}                 object   PostRating object
   *
   * @apiSuccess (Created 201) {Object}  PostRating        PostRating
   *
   * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   */
  .post(authorize(), controller.create)
  /**
   * @api {put} v2/post-rating Update PostRating
   * @apiDescription Update a PostRating
   * @apiVersion 1.0.0
   * @apiName UpdatePostRating
   * @apiGroup PostRating
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiParam  {String}                 _id              PostRating id
   * @apiParam  {Object}                 PostRating   PostRating object
   *
   * @apiSuccess {String}   _id        PostRating id
   *
   * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     companyType does not exist
   */
  .put(authorize(), controller.update)
  /**
   * @api {put} v2/post-rating Update PostRating
   * @apiDescription Update a PostRating
   * @apiVersion 1.0.0
   * @apiName UpdatePostRating
   * @apiGroup PostRating
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiParam  {String}                 _id              PostRating id
   * @apiParam  {Object}                 PostRating   PostRating object
   *
   * @apiSuccess {String}   _id        PostRating id
   *
   * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     PostRating does not exist
   */
  .get(authorize(), controller.list)

router
  .route('/all')
  /**
   * @api {get} v2/post-rating/suppliers/all List All PostRating with optional filter
   * @apiDescription List All PostRating  information with optional filter
   * @apiVersion 1.0.0
   * @apiName ListAllPostRating
   * @apiGroup PostRating
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object}   PostRating        PostRating
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     PostRating does not exist
   */
  .get(authorize(), controller.list);

router
  .route('/:id')
    /**
   * @api {delete} v2/post-rating Delete PostRating
   * @apiDescription Delete a PostRating
   * @apiVersion 1.0.0
   * @apiName Delete PostRating
   * @apiGroup PostRating
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiParam  {String}                 _id              PostRating id
   * @apiParam  {Object}                 PostRating   PostRating object
   *
   * @apiSuccess {String}   _id        PostRating id
   *
   * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     companyType does not exist
   */
  .delete(authorize(), controller.delete);

module.exports = router;