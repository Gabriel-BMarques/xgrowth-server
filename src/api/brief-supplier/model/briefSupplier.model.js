const mongoose = require('mongoose');

/**
 * BriefSupplier Schema
 * @private
 */
const briefSupplierSchema = new mongoose.Schema({
  BriefId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Brief',
  },
  SupplierId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CompanyProfile',
    required: true,
  },
  Accepted: {
    type: Boolean,
    required: false,
  },
  SignedNda: {
    type: Boolean,
    required: true,
    default: false,
  },
  SignedNdaFile: {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
    },
    name: {
      type: String,
      required: false,
    },
    url: {
      type: String,
      required: false,
    },
  },
  SignedNdaFileId: {
    type: String,
    required: false,
  },
  NdaAcceptance: {
    type: Number,
    required: false,
  },
  SignedNdaOn: {
    type: Date,
    required: false
  },
  NdaAcceptanceReason: {
    type: String,
    required: false,
  },
  NdaFileId: {
    type: String,
    required: false,
  },
  Nda: {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'File',
      required: false,
    },
    url: {
      type: String,
      required: false,
    },
    Name: {
      type: String,
      required: false,
    },
    Order: {
      type: Number,
      required: false,
    },
    Description: {
      type: String,
      required: false,
    },
    Size: {
      type: Number,
      required: false,
    },
    Type: {
      type: String,
      required: false,
    },
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
 * @typedef BriefSupplier
 */
const BriefSupplierSchema = mongoose.model('BriefSupplier', briefSupplierSchema);

briefSupplierSchema.index(
  {
    SupplierId: 1,
    BriefId: 1
  },
  {
    collation: {
      locale: 'en',
      strength: 4,
    },
    name: 'briefSuppliersIndexes'
  }
)

module.exports = BriefSupplierSchema;
