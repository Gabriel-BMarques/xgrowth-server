const express = require('express');
const controller = require('../../../organization/controller/skills.controller');
const userController = require('../../../user/controllers/user.controller');
const { authorize } = require('../../../authentication/middleware/auth');
const { get } = require('../../../organization/controller/segment.controller');


const router = express.Router();

/**
 * Load user when API with userId route parameter is hit
 */
router.param('userId', userController.load);

router
  .route('/')
  /**
   * @api {get} v1/skills Get Skills
   * @apiDescription Get Skills information
   * @apiVersion 1.0.0
   * @apiName GetSkills
   * @apiGroup Skills
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object}   Skills        Skills
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     Skills does not exist
   */
  .get(authorize(), controller.list)

  /**
   * @api {post} v1/skills Create Skills
   * @apiDescription Create a new Skills
   * @apiVersion 1.0.0
   * @apiName CreateSkills
   * @apiGroup Skills
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiParam  {Object}                 object   Skills object
   *
   * @apiSuccess (Created 201) {Object}  Skills        Skills
   *
   * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   */
  // .post(authorize(), validate(createSkills), controller.create)
  .post(authorize(), controller.create)
  /**
   * @api {put} v1/skills Update Skills
   * @apiDescription Update a Skills
   * @apiVersion 1.0.0
   * @apiName UpdateSkills
   * @apiGroup Skills
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiParam  {String}                 _id              Skills id
   * @apiParam  {Object}                 Skills   Skills object
   *
   * @apiSuccess {String}   _id        Skills id
   *
   * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     Skills does not exist
   */
  .put(authorize(), controller.update);

router
  .route('/by-segment')
  /**
   * @api {get} v2/skills List Skills by Segment
   * @apiDescription List Skills by Segment
   * @apiVersion 2.0.0
   * @apiName ListSkillsBySegment
   * @apiGroup Skills
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiParam  {String}                 _id              Skills id
   * @apiParam  {Object}                 Skills   Skills object
   *
   * @apiSuccess {String}   _id        Skills id
   *
   * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Not Found 404)    NotFound     Skills does not exist
   */
  .get(authorize(), controller.listBySegment);

router
  .route('/all')
  /**
   * @api {get} v1/skills/all List All Skills with optional filter
   * @apiDescription List All Skills  information with optional filter
   * @apiVersion 1.0.0
   * @apiName ListAllSkills
   * @apiGroup Skills
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object}   Skills        Skills
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     Skills does not exist
   */
  .get(authorize(), controller.list); // removed authorize(), may have to put it back

router
  .route('/:id')
  /**
   * @api {get} v2/skills/:id Get Skill
   * @apiDescription Get Skill
   * @apiVersion 2.0.0
   * @apiName GetSkill
   * @apiGroup Skills
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object}   Skills        Skills
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     Skills does not exist
   */
  .get(authorize(), controller.get)
  /**
   * @api {get} v2/skills/:id Delete Skill
   * @apiDescription Delete Skill
   * @apiVersion 2.0.0
   * @apiName DeleteSkill
   * @apiGroup Skills
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess {Object}   Skills        Skills
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   * @apiError (Not Found 404)    NotFound     Skills does not exist
   */
  .delete(authorize(), controller.remove);

module.exports = router;
