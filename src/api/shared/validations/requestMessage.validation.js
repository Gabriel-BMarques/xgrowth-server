const Joi = require('joi');

module.exports = {

  // PUT /v2/line
  sendRequestMessage: {
    body: {
      productName: Joi.string().required(),
      productDescription: Joi.string().required(),
      productLine: Joi.string().required(),
      requestAmount: Joi.string().required(),
      companyName: Joi.string().required(),
      senderEmail: Joi.string().required(),
      message: Joi.string().required(),
    },
  },
};
