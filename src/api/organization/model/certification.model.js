const mongoose = require('mongoose');

/**
 * Certification Schema
 * @private
 */
const certificationSchema = new mongoose.Schema({
  name: {
      type: String,
      required: true
  },
  description: {
      type: String,
      required: true
  },
  createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true,
});

/**
 * @typedef Certification
 */
const CertificationSchema = mongoose.model('Certification', certificationSchema);

module.exports = CertificationSchema;
