const mongoose = require('mongoose');

/**
 * BusinessUnit Schema
 * @private
 */
const businessUnitSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  countries: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Country',
    }
  ],
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CompanyProfile',
  },
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
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
 * @typedef BusinessUnit
 */
module.exports = mongoose.model('BusinessUnit', businessUnitSchema);
