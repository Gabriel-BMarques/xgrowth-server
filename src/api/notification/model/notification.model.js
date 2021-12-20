const mongoose = require('mongoose');

const statuses = ['sent', 'scheduled'];

/**
 * Notification Schema
 * @private
 */
const notificationSchema = new mongoose.Schema({
  title: {
    type: String,
    // required: true,
  },
  description: {
    type: String,
  },
  link: {
    type: String,
  },
  sendDate: {
    type: Date,
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  sentOn: {
    type: Date,
  },
  status: {
    type: String,
    enum: statuses,
    default: 'sent',
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
 * Statics
 */
notificationSchema.statics = {
  statuses,
};

/**
 * @typedef Notification
 */
const NotificationSchema = mongoose.model('Notification', notificationSchema);
module.exports = NotificationSchema;
