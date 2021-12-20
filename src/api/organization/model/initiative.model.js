const mongoose = require('mongoose');

/**
 * Organization Type Schema
 * @private
 */
const initiativeSchema = new mongoose.Schema({
  name: {
      type: String,
      required: true
  },
  description: {
      type: String,
      required: true
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

initiativeSchema.index({ '$**': 'text' });

/**
 * @typedef Initiative
 */
const InitiativeSchema = mongoose.model('Initiative', initiativeSchema);

module.exports = InitiativeSchema;
