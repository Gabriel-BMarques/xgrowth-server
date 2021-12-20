const Joi = require('joi');

module.exports = {

  // POST /v2/client-profile
  createClientProfile: {
    body: {
      firstName: Joi.string().required(),
      familyName: Joi.string().required(),
      birthdate: Joi.date().required(),
      categories: Joi.array().items().required(),
      department: Joi.object()
        .keys({ _id: Joi.string().required(), name: Joi.string().required() }),
      jobTitle: Joi.object().keys({ _id: Joi.string().required(), name: Joi.string().required() }),
      country: Joi.object().keys({ _id: Joi.string().required(), name: Joi.string().required() }),
      companyAdmin: Joi.boolean(),
      isBlocked: Joi.boolean(),
    },
  },

  // PUT /v2/client-profile
  updateClientProfile: {
    body: {
      _id: Joi.string().required(),
      firstName: Joi.string().required(),
      familyName: Joi.string().required(),
      birthdate: Joi.date().required(),
      categories: Joi.array().items().required(),
      department: Joi.object()
        .keys({ _id: Joi.string().required(), name: Joi.string().required() }),
      jobTitle: Joi.object().keys({ _id: Joi.string().required(), name: Joi.string().required() }),
      country: Joi.object().keys({ _id: Joi.string().required(), name: Joi.string().required() }),
      companyAdmin: Joi.boolean(),
      isBlocked: Joi.boolean(),

    },
  },
};
