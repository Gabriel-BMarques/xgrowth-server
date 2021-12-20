const mongoose = require('mongoose');

/**
 * Em Category Schema
 * @private
 */
const emCategorySchema = new mongoose.Schema({
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
 * @typedef EmCategory
 */
const EmCategorySchema = mongoose.model('EmCategory', emCategorySchema);
module.exports = EmCategorySchema;
