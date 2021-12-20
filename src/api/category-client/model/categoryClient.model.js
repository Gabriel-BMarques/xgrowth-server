const mongoose = require('mongoose');

/**
 * CategoryClient Schema
 * @private
 */
const categoryClientSchema = new mongoose.Schema({
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
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
 * @typedef CategoryClient
 */
const CategoryClientSchema = mongoose.model('CategoryClient', categoryClientSchema);
module.exports = CategoryClientSchema;
