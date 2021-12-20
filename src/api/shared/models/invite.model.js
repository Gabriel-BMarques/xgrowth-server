const mongoose = require('mongoose');

const status = ['sent', 'accepted'];
/**
 * Invite Schema
 * @private
 */
const inviteSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    match: /^\S+@\S+\.\S+$/,
    required: true,
    trim: true,
    lowercase: true,
  },
  domain: {
    type: String,
    required: true,
  },
  message: {
    type: String,
  },
  key: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: status,
    default: 'sent',
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
 * @typedef Invite
 */
const InviteSchema = mongoose.model('Invite', inviteSchema);
module.exports = InviteSchema;
