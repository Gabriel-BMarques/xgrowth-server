const mongoose = require('mongoose');

/**
 * BriefMarket Schema
 * @private
 */
const briefMarketSchema = new mongoose.Schema({
  BriefId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Brief',
  },
  MarketType: {
    type: Number,
    required: false,
  },
  CountryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Country',
    required: false,
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
 * @typedef BriefMarket
 */
const BriefMarketSchema = mongoose.model('BriefMarket', briefMarketSchema);
module.exports = BriefMarketSchema;
