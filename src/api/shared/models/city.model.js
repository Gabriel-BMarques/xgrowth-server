const mongoose = require('mongoose');

/**
 * City Schema
 * @private
 */
const citySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  countryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Country',
    required: true,
  },
  stateProvinceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'StateProvince',
    required: true,
  },
}, {
  timestamps: true,
});

/**
 * @typedef City
 */
const CitySchema = mongoose.model('City', citySchema);
module.exports = CitySchema;
