const Joi = require('joi');

module.exports = {

  // POST /v2/contact
  sendContactMessage: {
    body: {
      email: Joi.string().email().required(),
      message: Joi.string().max(500).required(),
    },
  },

  // POST /v2/mail/reactivation
  sendReactivationMessage: {
    body: {
      userEmail: Joi.string().email().required(),
    }
  }
};
