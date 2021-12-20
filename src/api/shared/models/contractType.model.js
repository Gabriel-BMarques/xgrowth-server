const mongoose = require('mongoose');

/**
 * Contract Type Schema
 * @private
 */
const contractTypeSchema = new mongoose.Schema({
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
 * @typedef ContractType
 */
const ContractTypeSchema = mongoose.model('ContractType', contractTypeSchema);
module.exports = ContractTypeSchema;
