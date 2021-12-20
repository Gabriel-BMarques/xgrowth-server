const mongoose = require('mongoose');

/**
 * GlobalRegion Schema
 * @private
 */
const globalRegionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
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
 * @typedef GlobalRegion
 */
const GlobalRegionSchema = mongoose.model('GlobalRegion', globalRegionSchema);
module.exports = GlobalRegionSchema;
