const mongoose = require('mongoose');

/**
 * CategoryPost Schema
 * @private
 */
const categoryUserSchema = new mongoose.Schema({
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  categoryOfUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CategoryUser',
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
 * @typedef CategoryUser
 */
const CategoryUserSchema = mongoose.model('CategoryUser', categoryUserSchema);
module.exports = CategoryUserSchema;
