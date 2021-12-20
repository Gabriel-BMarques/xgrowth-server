const Joi = require('joi');

module.exports = {

  // POST /v2/organization
  createOrganization: {
    body: {
      name: Joi.string().required(),
      domain: Joi.string().required(),
    },
  },

  // PUT /v2/organization
  updateOrganization: {
    body: {
      _id: Joi.string().required(),
      name: Joi.string().required(),
      domain: Joi.string().required(),
    },
  },
};
