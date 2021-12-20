const mongoose = require('mongoose');

const statuses = ['open', 'accepted', 'closed'];

/**
 * Request Schema
 * @private
 */
const requestSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
  },
  footprints: [{
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Footprint',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
  }],
  emCategories: [{
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'EmCategory',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
  }],
  segments: [{
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Segment',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
  }],
  subSegmentation: [{
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SubSegmentation',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
  }],
  contractTypes: [{
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Certification',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
  }],
  onlyApprovedSuppliers: {
    type: Boolean,
    default: false,
  },
  lineTypes: [{
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'LineType',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
  }],
  productCategory: {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ProductCategory',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
  },
  productCategoryOutputs: [{
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ProductCategoryOutput',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
  }],
  productOutputOthers: [{
    type: String,
  }],
  totalVolume: {
    type: Number,
  },
  estimatedConversionCost: {
    type: Number,
  },
  productCertifications: [{
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Certification',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
  }],
  rawMaterialsTraceability: [{
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'RawMaterialsTraceability',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
  }],
  status: {
    type: String,
    enum: statuses,
    default: 'open',
  },
  acceptants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
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
 * Statics
 */
requestSchema.statics = {
  statuses,
};

/**
 * @typedef Request
 */
const RequestSchema = mongoose.model('Request', requestSchema);
module.exports = RequestSchema;
