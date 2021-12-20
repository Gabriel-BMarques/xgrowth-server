const mongoose = require('mongoose');
const azureStorage = require('azure-storage');
const blobService = azureStorage.createBlobService();

/**
 *Product Schema
 * @private
 */
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    plantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Plant',
      required: false,
    },
    lineId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Line',
      required: false,
    },
    isPublished: {
      type: Boolean,
    },
    uploadedFiles: [
      {
        url: {
          type: String,
          required: false,
        },
        Name: {
          type: String,
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
    ],
    weight: {
      type: Number,
      required: false,
    },
    measuringUnit: {
      type: String,
      required: false,
    },
    salesMarket: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Country',
        required: false,
      },
    ],
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CompanyProfile',
      required: true,
    },
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization',
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

productSchema.pre('remove', async function (next) {
  try {
    if (!this) {
      return next(new Error('Invalid entity id.'));
    }

    if (this.uploadedFiles?.length > 0) {
      Object.entries(this.uploadedFiles).forEach(([key, value]) => {
        const blobName = value.url.replace('https://weleverimages.blob.core.windows.net/app-images/', '');
        blobService.deleteBlobIfExists('app-images', blobName, (err) => {
          if (err) {
            console.log(err);
          }
        });
      });
    }

    return next();
  } catch (error) {
    console.log(error);
    return next(error);
  }
});

productSchema.index(
  {
    name: 1,
    description: 1,
    samples: 1,
    company: 1,
    organization: 1,
    createdBy: 1,
    isPublished: 1,
    lineId: 1,
  },
  {
    collation: {
      locale: 'en',
      strength: 4,
    },
    name: 'productsIndexes',
  }
);

/**
 * @typedef Product
 */
const ProductSchema = mongoose.model('Product', productSchema);

module.exports = ProductSchema;
