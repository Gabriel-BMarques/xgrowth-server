const mongoose = require('mongoose');

/**
 *Uploaded File Schema
 * @private
 */
const uploadedFileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  url: {
    type: String,
    required: true,
  },
  size: {
    type: Number,
  },
});

uploadedFileSchema.index({ '$**': 'text' });

uploadedFileSchema.pre('remove', async function invalid(next) {
  if (!this) {
    next(new Error('Invalid entity id.'));
  }

  next();
});

/**
 * @typedef uploadedFile
 */
const UploadedFileSchema = mongoose.model('UploadedFile', uploadedFileSchema);
module.exports = UploadedFileSchema;
