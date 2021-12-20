const mongoose = require('mongoose');
const Line = require('../../line/models/line.model');
const lineController = require('../../line/controller/line.controller');

/**
 *Plant Schema
 * @private
 */
const plantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: false,
    },
    city: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'City',
      required: true,
    },
    stateProvinceRegion: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'StateProvince',
      required: true,
    },
    country: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Country',
      required: true,
    },
    contact: {
      type: String,
      required: false,
    },
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CompanyProfile',
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
  },
  {
    timestamps: true,
  }
);

plantSchema.pre('remove', async function remove(next) {
  try {
    Line.remove({ plantId: this._id });
  } catch (error) {
    return next(error);
  }
});

/**
 * @typedef Plant
 */
const PlantSchema = mongoose.model('Plant', plantSchema);
module.exports = PlantSchema;
