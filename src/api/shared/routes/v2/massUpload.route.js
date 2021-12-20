const express = require('express');
const multer = require('multer');
const controller = require('../../../shared/controllers/massUpload.controller');
const userController = require('../../../user/controllers/user.controller');
const { authorize } = require('../../../authentication/middleware/auth');
const { isAdmin } = require('../../middlewares/isAdmin');
const path = require('path');

const router = express.Router();

const inMemoryStorage = multer.memoryStorage();
const xlsxUploadStrategy = multer({
  storage: inMemoryStorage,
  fileFilter: (req, file, cb) => {
    const fileTypes = /xls|xlsx|csv|ods/;
    const mimeTypes = [
      'text/csv', // csv
      'application/vnd.oasis.opendocument.spreadsheet', // ods
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // xlsx
      'application/vnd.ms-excel', // xls
    ];
    const fileType = fileTypes.test(file.originalname);
    const extName = fileTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimeType = mimeTypes.includes(file.mimetype);
    return fileType && mimeType && extName
      ? cb(null, true)
      : cb(
          JSON.stringify({
            'en-US': new Error(
              'Wrong file extension! Accepted formats: .xls, .xlsx, .csv, .ods'
            ),
            'pt-BR': new Error(
              'Extensão do arquivo incorreto! Formatos aceitos: .xls, .xlsx, .csv, .ods'
            ),
          }),
          false
        );
  },
}).single('file');

/**
 * Load user when API with userId route parameter is hit
 */
router.param('userId', userController.load);

router
  .route('/')
  /**
   * @api {post} v2/mass-upload Mass upload
   * @apiDescription Mass upload
   * @apiVersion 1.0.0
   * @apiName massUpload
   * @apiGroup MassUpload
   * @apiPermission User
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess (Created 201) {Object}  {}        {}
   *
   * @apiError (Bad Notification 400)   ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users (with permissions) can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id can access the data
   */
  .post(authorize(), [xlsxUploadStrategy, isAdmin], controller.massUpload);

module.exports = router;
