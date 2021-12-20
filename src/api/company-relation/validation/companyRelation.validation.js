const Joi = require('joi');

module.exports = {

  // POST /v2/company-relation
  createCompanyRelation: {
    body: {
      companyA: Joi.string().required(),
      companyB: Joi.string().required(),
    },
  },

  // PUT /v2/company-relation
  updateCompanyRelation: {
    body: {
      _id: Joi.string().required(),
      companyA: Joi.string().required(),
      companyB: Joi.string().required(),
    },
  },
};
