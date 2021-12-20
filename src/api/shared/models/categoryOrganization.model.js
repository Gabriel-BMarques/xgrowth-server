const mongoose = require('mongoose');

/**
 * Category Schema
 * @private
 */
const categoryOrganizationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  segment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Segment',
    required: false,
  },
  isPublic: {
    type: Boolean,
    required: false,
    default: false
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
 * @typedef Category
 */
const CategoryOrganizationSchema = mongoose.model('CategoryOrganization', categoryOrganizationSchema);
module.exports = CategoryOrganizationSchema;
