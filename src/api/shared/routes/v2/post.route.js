const express = require('express');
const controller = require('../../../post/controller/post.controller');
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
   * @api {get} v2/post List Posts
   * @apiDescription List Posts information
   * @apiVersion 2.0.0
   * @apiName GetPost
   * @apiGroup Post
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object}   Post        Post
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     Post does not exist
   */
  .get(authorize(), controller.list)
  /**
   * @api {post} v2/post Create Post
   * @apiDescription Create a new Post
   * @apiVersion 2.0.0
   * @apiName createPost
   * @apiGroup Post
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiParam  {Object}                 object   Post object
   *
   * @apiSuccess (Created 201) {Object}  Post        Post
   *
   * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   */
  .post(authorize(), controller.create)
  /**
   * @api {put} v2/post Update Post
   * @apiDescription Update a Post
   * @apiVersion 2.0.0
   * @apiName updatePost
   * @apiGroup Post
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiParam  {String}                 _id       Post id
   * @apiParam  {Object}                 Post     Post object
   *
   * @apiSuccess {String}   _id        Post id
   *
   * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     Post does not exist
   */
  .put(authorize(), controller.update);

router
  .route('/organization')
  /**
   * @api {get} v2/post List Posts By Organization
   * @apiDescription List Posts information By Organization
   * @apiVersion 2.0.0
   * @apiName ListPostsByOrganization
   * @apiGroup Post
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object}   Post        Post
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     Post does not exist
   */
  .get(authorize(), controller.listByOrganization);

router
  .route('/byClient')
  /**
   * @api {get} v2/post List Posts
   * @apiDescription List Posts information
   * @apiVersion 2.0.0
   * @apiName GetPost
   * @apiGroup Post
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object}   Post        Post
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     Post does not exist
   */
  .get(authorize(), controller.listByClient);

router
  .route('/company/:id')
  /**
   * @api {get} v2/post/company/:id List posts of a company
   * @apiDescription List posts of a company information
   * @apiVersion 2.0.0
   * @apiName GetCompanyPosts
   * @apiGroup Post
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object}   Post        Post
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     Post does not exist
   */
  .get(authorize(), controller.getCompanyPosts);

router
  .route('/company/count/:id')
  /**
   * @api {get} v2/post/company/count/:id Count posts of a company
   * @apiDescription Count posts of a company
   * @apiVersion 2.0.0
   * @apiName CountCompanyPostsPosts
   * @apiGroup Post
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object}   Post        Post
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     Post does not exist
   */
  .get(authorize(), controller.countCompanyPosts);

router
  .route('/brief/:companyId/list/:briefId')
  /**
   * @api {get} v2/post/brief/:id List brief responses
   * @apiDescription List brief responses
   * @apiVersion 2.0.0
   * @apiName GetBriefResponses
   * @apiGroup Post
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object}   Post        Post
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     BriefResponses does not exists
   */
  .get(authorize(), controller.listBriefResponsesBySupplier);

router
  .route('/brief-responses/list')
  /**
   * @api {get} v2/post/brief/:id List brief responses
   * @apiDescription List brief responses
   * @apiVersion 2.0.0
   * @apiName GetBriefResponses
   * @apiGroup Post
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object}   Post        Post
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     BriefResponses does not exists
   */
  .get(authorize(), controller.listBriefResponses);

router
  .route('/brief-responses/by-organization/:organizationId')
  /**
   * @api {get} v2/post/brief-responses/by-organization List brief responses by organization
   * @apiDescription List brief responses by organization
   * @apiVersion 2.0.0
   * @apiName GetBriefResponsesByOrganization
   * @apiGroup Post
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object}   Post        Post
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     BriefResponses does not exists
   */
  .get(authorize(), controller.listBriefResponsesByOrganization);

router
  .route('/share')
  /**
   * @api {get} v2/post/share/ create Post Share
   * @apiDescription create post shares
   * @apiVersion 2.0.0
   * @apiName PostShares
   * @apiGroup Post
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object}   Post        Post
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     BriefResponses does not exists
   */
  .post(authorize(), controller.createPostShare);

router
  .route('/share/list/:id')
  /**
   * @api {get} v2/post/share/:id list Post Share
   * @apiDescription list post shares
   * @apiVersion 2.0.0
   * @apiName GetPostShares
   * @apiGroup Post
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object}   Post        Post
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     BriefResponses does not exists
   */
  .get(authorize(), controller.listPostSharesByUser);

router.route('/share/by-post/list/:postId').get(authorize(), controller.listPostSharesByPostId);

router.route('/share/remove/:id').delete(authorize(), controller.removePostShare);

router
  .route('/all')
  /**
   * @api {get} v2/post/all List Posts
   * @apiDescription List Posts information
   * @apiVersion 2.0.0
   * @apiName ListAllPosts
   * @apiGroup Post
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object}   Post        Post
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     Post does not exist
   */
  .get(authorize(), controller.list);

router
  .route('/feed')
  /**
   * @api {get} v2/post/feed List Feed Posts
   * @apiDescription List Posts information
   * @apiVersion 2.0.0
   * @apiName ListFeedPosts
   * @apiGroup Post
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object}   Post        Post
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     Post does not exist
   */
  .get(authorize(), controller.listFeedPostsByCompany);

router
  .route('/list/:id')
  /**
   * @api {get} v2/post/list/:id List Company Profile Posts
   * @apiDescription List Posts information
   * @apiVersion 2.0.0
   * @apiName ListCompanyProfilePosts
   * @apiGroup Post
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object}   Post        Post
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     Post does not exist
   */
  .get(authorize(), controller.listCompanyProfilePosts);

router
  .route('/:id')
  /**
   * @api {get} v2/post/:id Get Post
   * @apiDescription Get Post information
   * @apiVersion 2.0.0
   * @apiName GetPost
   * @apiGroup Post
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object}   Post        Post
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     Post does not exist
   */
  .get(authorize(), controller.get)
  /**
   * @api {get} v2/post/:id Delete Post
   * @apiDescription Delete campaign category information
   * @apiVersion 2.0.0
   * @apiName DeletePost
   * @apiGroup Post
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess (No Content 204)  Successfully deleted
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     Post does not exist
   */
  .delete(authorize(), controller.remove);

router
  .route('/details/:id')
  /**
   * @api {get} v2/post/details/:id Get Post Details
   * @apiDescription Get Post Details
   * @apiVersion 2.0.0
   * @apiName GetPost
   * @apiGroup Post
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object}   Post        Post
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     Post does not exist
   */
  .get(authorize(), controller.getPostDetails)

module.exports = router;
