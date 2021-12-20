const mongoose = require('mongoose');

/**
 * Raw Materials Traceability Schema
 * @private
 */
const rawMaterialsTraceabilitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
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
 * @typedef RawMaterialsTraceability
 */
// eslint-disable-next-line max-len
const RawMaterialsTraceabilitySchema = mongoose.model('RawMaterialsTraceability', rawMaterialsTraceabilitySchema);
module.exports = RawMaterialsTraceabilitySchema;
