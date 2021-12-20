const Joi = require('joi');

module.exports = {

  // POST /v2/line
  createRequest: {
    body: {
      title: Joi.string().required(),
      description: Joi.string().required(),
      startDate: Joi.date().required(),
      // endDate: Joi.date().required(),
    },
  },

  // PUT /v2/line
  updateRequest: {
    body: {
      _id: Joi.string().required(),
      title: Joi.string().required(),
      description: Joi.string().required(),
      startDate: Joi.date().required(),
      // endDate: Joi.date().required(),
    },
  },
};
