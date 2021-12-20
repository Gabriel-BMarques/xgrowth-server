const mongoose = require('mongoose');

/**
 * BriefType Schema
 * @private
 */
const briefTypeSchema = new mongoose.Schema({
  type: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
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
 * @typedef BriefType
 */
const BriefTypeSchema = mongoose.model('BriefType', briefTypeSchema);
module.exports = BriefTypeSchema;
