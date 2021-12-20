const mongoose = require('mongoose');

/**
 * Line Type Schema
 * @private
 */
const lineTypeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  name: {
    label: {
      type: String,
      required: true,
    },
    value: {
      type: String,
      required: true,
    },
  },
  description: {
    label: {
      type: String,
      required: true,
    },
    value: {
      type: String,
      required: true,
    },
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  updateUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, {
  timestamps: true,
});

/**
 * @typedef LineType
 */
const LineTypeSchema = mongoose.model('LineType', lineTypeSchema);
module.exports = LineTypeSchema;
