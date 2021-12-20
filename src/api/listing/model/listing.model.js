const mongoose = require('mongoose');

/**
 * Listing Schema
 * @private
 */
const listingSchema = new mongoose.Schema({
  lineId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'line',
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  freeCapacity: {
    type: Number,
    required: true,
  },
  conversionCost: {
    type: Number,
    required: true,
  },
  minimumContractLength: {
    type: Number,
  },
  contractType: [{
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ContractType',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
  }],
  industrialTrial: {
    type: Boolean,
  },
  products: [{
    productName: {
      type: String,
      required: true,
    },
    packages: [{
      packageName: {
        type: String,
        required: true,
      },
      ranges: [{
        from: {
          type: Number,
          required: true,
        },
        fromMeasuringUnit: {
          type: String,
          required: true,
        },
        to: {
          type: Number,
          required: true,
        },
        toMeasuringUnit: {
          type: String,
          required: true,
        },
        tons: {
          type: Number,
          required: true,
        },
      }],
    }],
  }],
  proposals: [{
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    message: {
      type: String,
    },
  }],
  companyProfileId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CompanyProfile',
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
 * @typedef Listing
 */
const ListingSchema = mongoose.model('Listing', listingSchema);
module.exports = ListingSchema;
