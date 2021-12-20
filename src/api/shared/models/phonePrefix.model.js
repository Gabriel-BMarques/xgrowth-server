const mongoose = require('mongoose');

/**
 * PhonePrefix Schema
 * @private
 */
const phonePrefixSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  updateUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, {
  timestamps: true,
});

/**
 * @typedef PhonePrefix
 */
const PhonePrefixSchema = mongoose.model('PhonePrefix', phonePrefixSchema);
module.exports = PhonePrefixSchema;
