const httpStatus = require('http-status');
const mailService = require('../services/mailService');

/**
 * Send Contact Message
 * @public
 */
exports.sendContactMessage = async (req, res, next) => {
  try {
    console.log('CUZINHO');
    let { email, name, subject, message, receiver } = req.body;

    mailService.sendContactMessage(name, email, subject, message, receiver);

    res.status(httpStatus.OK);
    return res.json();
  } catch (err) {
    return next(err);
  }
};

exports.sendRequestMessage = async (req, res, next) => {
  try {
    const { senderEmail } = req.body;
    const { productName } = req.body;
    const { productLine } = req.body;
    const productAmount = req.body.requestAmount;
    const { companyName } = req.body;
    const { productDescription } = req.body;
    const { packageType } = req.body;
    const { message } = req.body;

    mailService.sendRequestMessage(
      senderEmail,
      productName,
      productLine,
      companyName,
      productDescription,
      message,
      packageType,
      productAmount,
    );

    res.status(httpStatus.OK);
    return res.json();
  } catch (err) {
    return next(err);
  }
};
