const mongoose = require('mongoose');

/**
 * CompanyType Schema
 * @private
 */
const companyTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
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
 * @typedef CompanyType
 */
module.exports = mongoose.model('CompanyType', companyTypeSchema);
