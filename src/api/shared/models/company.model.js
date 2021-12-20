const mongoose = require('mongoose');

/**
 *Company Schema
 * @private
 */
const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  allowedDomains: [{
    type: String,
  }],
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
 * @typedef Company
 */
const CompanySchema = mongoose.model('Company', companySchema);
module.exports = CompanySchema;
