const mongoose = require('mongoose');

/**
 * Organization Type Schema
 * @private
 */
const organizationTypeSchema = new mongoose.Schema({
  name: {
      type: String,
      required: true
  },
  description: {
      type: String,
      required: true
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'OrganizationType'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true,
});

organizationTypeSchema.index({ '$**': 'text' });

/**
 * @typedef OrganizationType
 */
const OrganizationTypeSchema = mongoose.model('OrganizationType', organizationTypeSchema);

module.exports = OrganizationTypeSchema;
