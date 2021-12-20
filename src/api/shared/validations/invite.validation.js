const Joi = require('joi');

module.exports = {

  // POST /v2/invite
  createInvite: {
    body: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
    },
  },

  // PUT /v2/invite/:inviteId
  updateInvite: {
    body: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
    },
  },
};
