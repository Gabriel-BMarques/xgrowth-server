const express = require('express');
const mailAction = require('../../../mail-action/controller/mailAction.controller');
const { authorize } = require('../../../authentication/middleware/auth');
const validate = require('express-validation');
const { sendReactivationMessage } = require('../../validations/contact.validation');
const router = express.Router();

router
  .route('/')
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
  .post(authorize(), mailAction.create)
  .get(authorize(), mailAction.listByReceiverId)
module.exports = router;
