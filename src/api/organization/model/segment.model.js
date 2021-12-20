const mongoose = require('mongoose');

/**
 * Segment Schema
 * @private
 */
const segmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Segment',
    required: false
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
 * @typedef Segment
 */
const SegmentSchema = mongoose.model('Segment', segmentSchema);
module.exports = SegmentSchema;
