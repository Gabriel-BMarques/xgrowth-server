/* eslint max-len: ["error", { "ignoreComments": true }] */
const Joi = require('joi');

module.exports = {
  // POST /v2/product
  createProduct: {
    body: {
      name: Joi.string().required(),
      uploadedFiles: Joi.allow(null).optional(),
      weight: Joi.number().allow(null).optional(),
      measuringUnit: Joi.string().allow(null).optional(),
      salesMarket: Joi.array().items(Joi.string()).allow(null).optional(),
    },
  },

  // PUT /v2/product
  updateProduct: {
    body: {
      name: Joi.string().required(),
      uploadedFiles: Joi.allow(null).optional(),
      weight: Joi.number().min(0.01).allow(null).optional(),
      measuringUnit: Joi.string().allow(null).optional(),
      salesMarket: Joi.array().items(Joi.string()).allow(null).optional(),
    },
  },
};
