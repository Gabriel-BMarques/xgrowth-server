const Joi = require('joi');

module.exports = {

  // POST /v2/notification
  createNotification: {
    body: {
      title: Joi.string(),
      description: Joi.string().required(),
    },
  },

  // PUT /v2/line
  updateNotification: {
    body: {
      _id: Joi.string(),
      title: Joi.string().required(),
    },
  },
};
