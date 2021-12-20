const mongoose = require('mongoose');

/**
 * Post Sub Category Schema
 * @private
 */
const postSubCategorySchema = new mongoose.Schema({
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
 * @typedef PostSubCategory
 */
const PostSubCategorySchema = mongoose.model('PostSubCategory', postSubCategorySchema);
module.exports = PostSubCategorySchema;
