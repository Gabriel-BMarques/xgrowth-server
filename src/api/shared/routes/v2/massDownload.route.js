const express = require('express');
const controller = require('../../controllers/massDownload.controller');
const { authorize } = require('../../../authentication/middleware/auth');

const router = express.Router();

router
  .route('/organizations')
  .get(authorize(), controller.downloadOrganizations);

router.route('/companies').get(authorize(), controller.downloadCompanies);

module.exports = router;
