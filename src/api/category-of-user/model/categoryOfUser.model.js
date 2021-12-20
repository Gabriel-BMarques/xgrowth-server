const mongoose = require('mongoose');

/**
 * CategoryPost Schema
 * @private
 */
const categoryOfUserSchema = new mongoose.Schema({
  name: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
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
 * @typedef CategoryOfUser
 */
const CategoryOfUserSchema = mongoose.model('CategoryOfUser', categoryOfUserSchema);
module.exports = CategoryOfUserSchema;
