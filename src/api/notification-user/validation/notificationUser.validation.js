const Joi = require('joi');

module.exports = {

  // POST /v2/notification-user
  createNotificationUser: {
    body: {
      title: Joi.string().required(),
      description: Joi.string().required(),
    },
  },

  // PUT /v2/notification-user
  updateNotificationUser: {
    body: {
      read: Joi.boolean(),
    },
  },
};
