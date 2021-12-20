const mongoose = require('mongoose');

/**
 *File Schema
 * @private
 */
const fileSchema = new mongoose.Schema({
  Name: {
    type: String,
    required: false,
  },
  Size: {
    type: Number,
    required: false,
  },
  BriefId_Attachment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Brief',
  },
  BriefId_Media: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Brief',
  },
  Order: {
    type: Number,
    required: false,
  },
  PostId_Attachment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
  },
  url: {
    type: String,
    required: true,
  },
  type: {
    type: String,
  },
}, {
  timestamps: true,
});

fileSchema.index({ '$**': 'text' });

fileSchema.pre('remove', async function invalid(next) {
  if (!this) {
    next(new Error('Invalid entity id.'));
  }

  next();
});

/**
 * @typedef File
 */
const FileSchema = mongoose.model('File', fileSchema);
module.exports = FileSchema;
