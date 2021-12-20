const mongoose = require('mongoose');

/**
 * Collection Schema
 * @private
 */
const collectionSchema = new mongoose.Schema({
  Name: {
    type: String,
    required: true,
  },
  Members: [{
    name: {
      type: String,
      required: false,
    },
    canEdit: {
      type: String,
      required: false,
    },
  }],
  postsIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Posts',
  }],
  UserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  CreatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  UpdatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, {
  timestamps: true,
});

/**
 * @typedef Collection
 */
const CollectionSchema = mongoose.model('Collection', collectionSchema);
module.exports = CollectionSchema;
