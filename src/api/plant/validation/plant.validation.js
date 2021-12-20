/* eslint max-len: ["error", { "ignoreComments": true }] */
const Joi = require('joi');

module.exports = {

  // POST /v2/plant
  createPlant: {
    body: {
      name: Joi.string().required(),
      address: Joi.string(),
      city: Joi.string().required(),
      stateProvinceRegion: Joi.string().required(),
      country: Joi.string().required(),
      contact: Joi.string(),
    },
  },

  // PUT /v2/plant
  updatePlant: {
    body: {
      _id: Joi.string().required(),
      name: Joi.string().required(),
      address: Joi.string(),
      city: Joi.string().required(),
      stateProvinceRegion: Joi.string().required(),
      country: Joi.string().required(),
      contact: Joi.string(),
    },
  },
};
