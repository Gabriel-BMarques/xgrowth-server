const express = require('express');
const mailService = require('../../services/mailService');
const contactController = require('../../controllers/contact.controller');
const { authorize } = require('../../../authentication/middleware/auth');
const validate = require('express-validation');
const { sendReactivationMessage } = require('../../validations/contact.validation');
const router = express.Router();

router
  .route('/contact')
  /**
     * @api {post} v2/contact Contact Message
     * @apiDescription Send Contact Message
     * @apiVersion 2.0.0
     * @apiName SendContactMessage
     * @apiGroup Contact
     * @apiPermission public
     *
     * @apiParam  {String}             [userEmail]     User's E-mail
     *
     * @apiSuccess (Ok 200)  Successfully message sent
     *
     * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
     */
  .post(contactController.sendContactMessage);

router
  .route('/brief-accept')
/**
     * @api {post} v2/contact Send Brief Acceptance Message
     * @apiDescription Send brief acceptance message
     * @apiVersion 2.0.0
     * @apiName SendBriefAcceptanceMessage
     * @apiGroup Contact
     * @apiPermission public
     *
     * @apiParam  {String}             [userEmail]    User's email
     * @apiParam  {String}             firstName      First Name
     * @apiParam  {String{..128}}      [companyName]  Company Name
     *
     * @apiSuccess (Ok 200)  Successfully message sent
     *
     * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
     */
  .post(authorize(), mailService.sendSupplierAcceptedBriefMessage);

router
  .route('/brief-decline')
/**
     * @api {post} v2/contact Send Brief Decline Message
     * @apiDescription Send brief decline message
     * @apiVersion 2.0.0
     * @apiName SendBriefDeclinedMessage
     * @apiGroup Contact
     * @apiPermission public
     *
     * @apiParam  {String}             [userEmail]    User's email
     * @apiParam  {String}             firstName      First Name
     * @apiParam  {String{..128}}      [companyName]  Company Name
     *
     * @apiSuccess (Ok 200)  Successfully message sent
     *
     * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
     */
  .post(authorize(), mailService.sendSupplierDeclinedBriefMessage);

router
  .route('/new-post')
/**
     * @api {post} v2/contact Request message
     * @apiDescription Send New Post Message
     * @apiVersion 2.0.0
     * @apiName SendRequestMessage
     * @apiGroup Contact
     * @apiPermission public
     *
     * @apiParam  {String}             [userEmail]    User's email
     * @apiParam  {String}             firstName      First Name
     * @apiParam  {String{..128}}      [companyName]  Company Name
     * @apiParam  {String{..500}}      postId    Post ID
     *
     * @apiSuccess (Ok 200)  Successfully message sent
     *
     * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
     */
  .post(authorize(), mailService.sendNewPostMessage);

router
  .route('/new-brief')
/**
     * @api {post} v2/contact Request message
     * @apiDescription Send New Brief Message
     * @apiVersion 2.0.0
     * @apiName SendNewBriefMessage
     * @apiGroup Contact
     * @apiPermission public
     *
     * @apiParam  {String}             [userEmail]     User's E-mail
     *
     * @apiSuccess (Ok 200)  Successfully message sent
     *
     * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
     */
  .post(authorize(), mailService.sendNewBriefMessage);

router
  .route('/nda-acceptance')
/**
     * @api {post} v2/contact Request message
     * @apiDescription Send New Brief Message
     * @apiVersion 2.0.0
     * @apiName SendNewBriefMessage
     * @apiGroup Contact
     * @apiPermission public
     *
     * @apiParam  {String}             [userEmail]     User's E-mail
     * @apiParam  {String}             [briefId]     Brief ID
     *
     * @apiSuccess (Ok 200)  Successfully message sent
     *
     * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
     */
  .post(authorize(), mailService.sendNDAAcceptedMessage);

router
  .route('/nda-declining')
/**
     * @api {post} v2/nda-declining NDA Decline message
     * @apiDescription Send NDA Decline Message
     * @apiVersion 2.0.0
     * @apiName SendNdaDeclineMessage
     * @apiGroup Contact
     * @apiPermission public
     *
     * @apiParam  {String}             [userEmail]     User's E-mail
     * @apiParam  {String}             [briefId]     Brief ID
     *
     * @apiSuccess (Ok 200)  Successfully message sent
     *
     * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
     */
  .post(authorize(), mailService.sendNDADeclineMessage);

router
  .route('/nda-signed')
/**
     * @api {post} v2/nda-declining NDA Decline message
     * @apiDescription Send NDA Decline Message
     * @apiVersion 2.0.0
     * @apiName SendNdaDeclineMessage
     * @apiGroup Contact
     * @apiPermission public
     *
     * @apiParam  {String}             [userEmail]     User's E-mail
     * @apiParam  {String}             [briefId]     Brief ID
     *
     * @apiSuccess (Ok 200)  Successfully message sent
     *
     * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
     */
  .post(authorize(), mailService.sendSignedNDAMessage);

router
  .route('/reactivation')
/**
     * @api {post} v2/reactivation Account Reactivation Message
     * @apiDescription Send Account Reactivation Message
     * @apiVersion 2.0.0
     * @apiName SendAccountReactivationMessage
     * @apiGroup Contact
     * @apiPermission public
     *
     * @apiParam  {String}             [userEmail]     User's E-mail
     *
     * @apiSuccess (Ok 200)  Successfully message sent
     *
     * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
     */
  .post(validate(sendReactivationMessage), mailService.sendAccountReactivationMessageFromClient);

router
  .route('/forgot-password')
/**
     * @api {post} v2/forgot-password Forgot Password Message
     * @apiDescription Send Forgot Password Message
     * @apiVersion 2.0.0
     * @apiName SendForgotPasswordMessage
     * @apiGroup Contact
     * @apiPermission public
     *
     * @apiParam  {String}             [userEmail]     User's E-mail
     *
     * @apiSuccess (Ok 200)  Successfully message sent
     *
     * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
     */
  .post(validate(sendReactivationMessage), mailService.sendForgottenPasswordMessage);

router
  .route('/refer-solver')
/**
     * @api {post} v2/refer-solver Refer Solver Message
     * @apiDescription Send Refer Solver Message
     * @apiVersion 2.0.0
     * @apiName SendReferSolverMessage
     * @apiGroup Contact
     * @apiPermission public
     *
     * @apiParam  {String}             [userEmail]     User's E-mail
     *
     * @apiSuccess (Ok 200)  Successfully message sent
     *
     * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
     */
  .post(authorize(), mailService.sendReferSolverMessage);

router
  .route('/brief-response')
/**
     * @api {post} v2/ brief-reponse  Brief Reponse  Message
     * @apiDescription Send Brief Reponse Message
     * @apiVersion 2.0.0
     * @apiName sendNewBriefResponse
     * @apiGroup Contact
     * @apiPermission public
     *
     * @apiParam  {String}             [userEmail]     User's E-mail
     *
     * @apiSuccess (Ok 200)  Successfully message sent
     *
     * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
     */
  .post(authorize(), mailService.sendNewBriefResponse);
module.exports = router;
