const Joi = require('joi');
const User = require('../model/user.model');

module.exports = {

  // GET /v2/users
  listUsers: {
    query: {
      page: Joi.number().min(1),
      perPage: Joi.number().min(1).max(100),
      name: Joi.string(),
      email: Joi.string(),
      role: Joi.string().valid(User.roles),
      userBlocked: Joi.boolean(),
    },
  },

  // POST /v2/users
  createUser: {
    body: {
      email: Joi.string().email().required(),
      password: Joi.string().min(6).max(128).required(),
      name: Joi.string().max(128),
      role: Joi.string().valid(User.roles),
      userBlocked: Joi.boolean(),
    },
  },

  // PUT /v2/users/:userId
  replaceUser: {
    body: {
      email: Joi.string().email().required(),
      password: Joi.string().min(6).max(128).required(),
      name: Joi.string().max(128),
      role: Joi.string().valid(User.roles),
    },
    params: {
      userId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
  },

  // PATCH /v2/users/:userId
  updateUser: {
    body: {
      email: Joi.string().email(),
      name: Joi.string().max(128),
      role: Joi.string().valid(User.roles),
    },
  },
};
