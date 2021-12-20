const mongoose = require('mongoose');

/**
 * NotificationUser Schema
 * @private
 */
const notificationUserSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    link: {
      type: String,
    },
    date: {
      type: Boolean,
      default: false,
    },
    display: {
      type: Boolean,
      default: true,
    },
    sentOn: {
      type: Date,
      default: Date.now,
    },
    read: {
      type: Boolean,
      default: false,
    },
    readOn: {
      type: Date,
    },
    briefId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Brief',
    },
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
    },
    webinarId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Webinar',
    },
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization',
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

/**
 * @typedef NotificationUser
 */
const NotificationUserSchema = mongoose.model('NotificationUser', notificationUserSchema);
module.exports = NotificationUserSchema;
