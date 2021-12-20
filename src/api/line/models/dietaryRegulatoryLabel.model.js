const mongoose = require('mongoose');

/**
 * Dietary Regulatory Label Schema
 * @private
 */
const dietaryRegulatoryLabelSchema = new mongoose.Schema({
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
 * @typedef DietaryRegulatoryLabel
 */
const DietaryRegulatoryLabelSchema = mongoose.model(
  'DietaryRegulatoryLabel',
  dietaryRegulatoryLabelSchema,
);
module.exports = DietaryRegulatoryLabelSchema;
