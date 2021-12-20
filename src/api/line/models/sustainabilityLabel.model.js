const mongoose = require('mongoose');

/**
 * Sustainability Label Schema
 * @private
 */
const sustainabilityLabelSchema = new mongoose.Schema({
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
 * @typedef SustainabilityLabel
 */
const SustainabilityLabelSchema = mongoose.model('SustainabilityLabel', sustainabilityLabelSchema);
module.exports = SustainabilityLabelSchema;
