const mongoose = require('mongoose');

/**
 * Em SubSegmentation Schema
 * @private
 */
const subSegmentationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
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
 * @typedef SubSegmentation
 */
const SubSegmentationSchema = mongoose.model('SubSegmentation', subSegmentationSchema);
module.exports = SubSegmentationSchema;
