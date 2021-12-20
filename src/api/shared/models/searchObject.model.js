const mongoose = require('mongoose');

/**
 * SearchObject Schema
 * @private
 */
const searchObjectSchema = new mongoose.Schema({
  companyProfile: {},
  plants: [],
  lines: [],
  listings: [],
});

searchObjectSchema.index({ '$**': 'text' });
/**
 * @typedef SearchObject
 */
const SearchObjectSchema = mongoose.model('SearchObject', searchObjectSchema);
module.exports = SearchObjectSchema;
