const Joi = require('joi');

module.exports = {
  // POST /v2/auth/register
  register: {
    body: {
      email: Joi.string().email().required(),
      password: Joi.string().required().max(128),
    },
  },

  // POST /v2/auth/create
  create: {
    body: {
      email: Joi.string().email().required(),
    },
  },

  // POST /v2/auth/login
  login: {
    body: {
      email: Joi.string().email().required(),
      password: Joi.string().required().max(128),
    },
  },

  activate: {
    query: {
      activationKey: Joi.string().required().max(20),
    },
  },

  reactivate: {
    query: {
      reactivationKey: Joi.string().required().max(20),
    },
  },

  // POST /v2/auth/facebook
  // POST /v2/auth/google
  oAuth: {
    body: {
      access_token: Joi.string().required(),
    },
  },

  // POST /v2/auth/refresh
  refresh: {
    body: {
      email: Joi.string().email().required(),
      refreshToken: Joi.string().required(),
    },
  },

  // POST /v2/auth/reset-password/init
  resetInit: {
    body: {
      email: Joi.string().email().required(),
    },
  },

  // POST /v2/auth/reset-password/finish
  resetFinish: {
    body: {
      password: Joi.string().required().max(20),
    },
  },
};
