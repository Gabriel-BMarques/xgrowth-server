const mongoose = require('mongoose');

/**
 * Allergen Schema
 * @private
 */
const allergenSchema = new mongoose.Schema({
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
 * @typedef Allergen
 */
const AllergenSchema = mongoose.model('Allergen', allergenSchema);
module.exports = AllergenSchema;
