const Joi = require('joi');

module.exports = {

  // POST /v2/*
  createAuxEntity: {
    body: {
      name: Joi.string().required(),
      description: Joi.string(),
    },
  },

  createCompany: {
    body: {
      name: Joi.string().required(),
      allowedDomains: Joi.array().items().required(),
    },
  },
};
