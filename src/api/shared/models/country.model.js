const mongoose = require('mongoose');

/**
 * Country Schema
 * @private
 */
const countrySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  globalRegion: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'GlobalRegion',
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
 * @typedef Country
 */
const CountrySchema = mongoose.model('Country', countrySchema);
module.exports = CountrySchema;
