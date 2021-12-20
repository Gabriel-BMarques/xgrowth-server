const Joi = require('joi');

module.exports = {

  // POST /v2/company-profile
  createCompanyProfile: {
    body: {
      companyName: Joi.string().required(),
    },
  },

  // PUT /v2/company-profile
  updateCompanyProfile: {
    body: {
      _id: Joi.string().required(),
      companyName: Joi.string().required(),
    },
  },
};
