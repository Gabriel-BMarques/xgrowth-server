const Joi = require('joi');

module.exports = {

  // POST /v2/line
  createLine: {
    body: {
      name: Joi.string().required(),
      plantId: Joi.string().required(),
    },
  },

  // PUT /v2/line
  updateLine: {
    body: {
      _id: Joi.string().required(),
      name: Joi.string().required(),
      plantId: Joi.string().required(),
    },
  },
};
