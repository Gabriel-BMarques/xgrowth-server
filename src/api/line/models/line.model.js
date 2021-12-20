const mongoose = require('mongoose');
const Product = require('../../product/model/product.model');

/**
 * Line Schema
 * @private
 */
const lineSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    plantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Plant',
      required: true,
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

lineSchema.index(
  {
    name: 1,
    description: 1,
    plantId: 1,
    organization: 1,
    company: 1,
    createdBy: 1,
  },
  {
    collation: {
      locale: 'en',
      strength: 4,
    },
    name: 'linesIndexes',
  }
);

lineSchema.pre('remove', async function remove(next) {
  try {
    const productsToRemove = await Product.find({ lineId: this._id }).exec();
    await Promise.all(productsToRemove.map(async (product) => await product.remove()));
  } catch (error) {
    return next(error);
  }
});

/**
 * @typedef Line
 */
const LineSchema = mongoose.model('Line', lineSchema);
module.exports = LineSchema;
