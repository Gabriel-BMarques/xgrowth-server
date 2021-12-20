const Joi = require('joi');

module.exports = {

  // POST /v2/notification-device
  createNotificationDevice: {
    body: {
      pushChannel: Joi.string().required(),
      tags: Joi.array().items().required(),
      registrationType: Joi.string().required(),
    },
  },

  // PUT /v2/notification-device
  updateNotificationDevice: {
    body: {
      _id: Joi.string().required(),
      pushChannel: Joi.string().required(),
      tags: Joi.array().items().required(),
      registrationType: Joi.string().required(),
    },
  },
};
