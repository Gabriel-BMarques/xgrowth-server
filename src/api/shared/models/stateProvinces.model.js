const mongoose = require('mongoose');

/**
 * StateProvince Schema
 * @private
 */
const stateProvinceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  countryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Country',
    required: true,
  },
}, {
  timestamps: true,
});

/**
 * @typedef StateProvince
 */
const StateProvinceSchema = mongoose.model('StateProvince', stateProvinceSchema);
module.exports = StateProvinceSchema;
