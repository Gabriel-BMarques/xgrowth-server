const Joi = require('joi');

module.exports = {

  // POST /v2/listing
  createListing: {
    body: {
      lineId: Joi.string().required(),
    },
  },

  // PUT /v2/listing
  updateListing: {
    body: {
      _id: Joi.string().required(),
    },
  },
};
