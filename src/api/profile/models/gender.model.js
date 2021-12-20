const mongoose = require('mongoose');

/**
 * Gender Schema
 * @private
 */
const genderSchema = new mongoose.Schema({
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
 * @typedef Gender
 */
const GenderSchema = mongoose.model('Gender', genderSchema);
module.exports = GenderSchema;
