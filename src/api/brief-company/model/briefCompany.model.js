const mongoose = require('mongoose');

/**
 * BriefCompany Schema
 * @private
 */
const briefCompanySchema = new mongoose.Schema({
  BriefId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Brief',
  },
  CompanyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CompanyProfile',
    required: false,
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
 * @typedef BriefCompany
 */
const BriefCompanySchema = mongoose.model('BriefCompany', briefCompanySchema);
module.exports = BriefCompanySchema;
