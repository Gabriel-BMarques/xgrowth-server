const mongoose = require('mongoose');

const postCategory = new mongoose.Schema({
  categoryId: {
    type: mongoose.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  postId: {
    type: mongoose.Types.ObjectId,
    ref: 'Post',
    required: true,
  },
  userId: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdBy: {
    type: String,
    required: true,
  },
  updatedBy: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

/**
 * @typedef postCategory
 */
const PostCategorySchema = mongoose.model('PostCategory', postCategory);
module.exports = PostCategorySchema;
