const Joi = require('joi');

module.exports = {

  // POST /v2/post
  createPost: {
    body: {
      supplierId: Joi.string(),
      title: Joi.string(),
      description: Joi.string(),
      isConfidential: Joi.boolean(),
      isExclusive: Joi.boolean(),
      typeOfContent: Joi.number(),
      isPublic: Joi.boolean(),
      productImageBase64: Joi.string(),
    },
  },

  // PUT /v2/post
  updatePost: {
    body: {
      _id: Joi.string(),
      title: Joi.string(),
      description: Joi.string(),
      isPublic: Joi.boolean(),
      productImageBase64: Joi.string(),
    },
  },
};
