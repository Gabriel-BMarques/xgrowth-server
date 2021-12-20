const express = require('express');
// const validate = require('express-validation');
const controller = require('../../controllers/file.controller');
const { authorize } = require('../../../authentication/middleware/auth');

const router = express.Router();

const multer = require('multer');

const inMemoryStorage = multer.memoryStorage();
// eslint-disable-next-line object-shorthand
const uploadStrategy = multer({
  storage: inMemoryStorage,
  limits: {
    fieldSize: 8 * 1024 * 1024 * 1024,
  },
}).array('file');

router
  .route('/')
  .post(authorize(), uploadStrategy, controller.create, () => {});

router
  .route('/editor')
  .post(authorize(), uploadStrategy, controller.editorUpload, () => {});


router
  .route('/removeImage')
  .post(authorize(), controller.removeImage, () => {});

module.exports = router;
