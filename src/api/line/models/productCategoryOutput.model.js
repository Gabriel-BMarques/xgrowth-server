const mongoose = require('mongoose');

/**
 * Product Category Output Schema
 * @private
 */
const productCategoryOutputSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  productCategoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProductCategory',
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
 * @typedef ProductCategoryOutput
 */
// eslint-disable-next-line max-len
const ProductCategoryOutputSchema = mongoose.model('ProductCategoryOutput', productCategoryOutputSchema);
module.exports = ProductCategoryOutputSchema;
