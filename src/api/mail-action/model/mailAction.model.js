const mongoose = require("mongoose");

/**
 * mailAction Schema
 * @private
 */

const mailActionSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * @typedef MailAction
 */
const MailActionSchema = mongoose.model("MailAction", mailActionSchema);

module.exports = MailActionSchema;
