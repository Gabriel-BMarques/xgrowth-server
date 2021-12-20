const mongoose = require('mongoose');

/**
 *Supplier Schema
 * @private
 */
const supplierSchema = new mongoose.Schema({
  CompanyId: {
    type: String,
    required: true,
  },
  PostLimit: [{
    type: String,
  }],
  PostWaitDays: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  FileId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'File',
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
 * @typedef Supplier
 */
const SupplierSchema = mongoose.model('Supplier', supplierSchema);
module.exports = SupplierSchema;
