const mongoose = require('mongoose');

/**
 * CategoryPost Schema
 * @private
 */
const categoryPostSchema = new mongoose.Schema({
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
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
 * @typedef CategoryPost
 */
const CategoryPostSchema = mongoose.model('CategoryPost', categoryPostSchema);
module.exports = CategoryPostSchema;
