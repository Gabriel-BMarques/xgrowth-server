const mongoose = require('mongoose');

const postShareSchema = new mongoose.Schema({
  PostId: {
    type: mongoose.Types.ObjectId,
    ref: 'Post',
    required: true,
  },
  SenderId: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  RecipientId: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  Description: {
    type: String,
    required: false,
  },
  CreatedBy: {
    type: String,
    required: true,
  },
  UpdatedBy: {
    type: String,
    required: false,
  },
}, {
  timestamps: true,
});

/**
 * @typedef postShare
 */
const PostShareSchema = mongoose.model('PostShare', postShareSchema);
module.exports = PostShareSchema;
