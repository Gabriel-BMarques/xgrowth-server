const mongoose = require('mongoose');

/**
 * CollectionPost Schema
 * @private
 */
const collectionPostSchema = new mongoose.Schema({
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
  },
  collectionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Collection',
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
 * @typedef CollectionPost
 */
const CollectionPostSchema = mongoose.model('CollectionPost', collectionPostSchema);
module.exports = CollectionPostSchema;
