const mongoose = require('mongoose');
const { mongo } = require('../../../config/vars');

/**
 * User Action Schema
 * @private
 */
const userActionSchema = new mongoose.Schema({
  Id_GUID: {
      type: String
  },
  UserId: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: true
  },
  PostId: {
    type: mongoose.Types.ObjectId,
    ref: 'Post',
    required: false
  },
  BriefId: {
    type: mongoose.Types.ObjectId,
    ref: 'Brief',
    required: false
  },
  Type: {
      type: Number,
      required: true
  },
  TargetUserId: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: false
  },
  CompanyId: {
      type: mongoose.Types.ObjectId,
      required: true,
  }
}, {
  timestamps: true,
});

/**
 * @typedef UserAction
 */
const UserActionSchema = mongoose.model('UserAction', userActionSchema);
module.exports = UserActionSchema;
