const mongoose = require('mongoose');

/**
 * CategoryBrief Schema
 * @private
 */
const briefCategorySchema = new mongoose.Schema({
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  briefId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Brief',
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, {
  timestamps: true,
});

/**
 * @typedef CategoryBrief
 */
const BriefCategorySchema = mongoose.model('BriefCategory', briefCategorySchema);
module.exports = BriefCategorySchema;
