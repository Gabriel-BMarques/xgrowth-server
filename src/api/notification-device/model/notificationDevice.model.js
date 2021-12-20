const mongoose = require('mongoose');

/**
 * NotificationDevice Schema
 * @private
 */
const notificationDeviceSchema = new mongoose.Schema({
  installationId: {
    type: String,
    required: true,
  },
  pushChannel: {
    type: String,
    required: true,
  },
  platform: {
    type: String,
    required: true,
  },
  tags: [
    {
      type: String,
      required: true,
    },
  ],
  registrationType: {
    type: String,
    required: true,
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
}, {
  timestamps: true,
});

/**
 * @typedef NotificationDevice
 */
const NotificationDeviceSchema = mongoose.model('NotificationDevice', notificationDeviceSchema);
module.exports = NotificationDeviceSchema;
