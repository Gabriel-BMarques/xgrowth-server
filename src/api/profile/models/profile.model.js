const mongoose = require('mongoose');

/**
 * ClientProfile Schema
 * @private
 */
const profileSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  familyName: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
  },
  department: {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
  },
  jobTitle: {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'JobTitle',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
  },
  country: {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Footprint',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  updateUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, {
  timestamps: true,
});

/**
 * @typedef Profile
 */
const ProfileSchema = mongoose.model('Profile', profileSchema);
module.exports = ProfileSchema;
