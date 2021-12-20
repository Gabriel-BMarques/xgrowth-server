const mongoose = require('mongoose');
const {
  omitBy, isNil,
} = require('lodash');
const { number } = require('joi');

/**
 * CompanyProfile Schema
 * @private
 */
const companyProfileSchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: true,
  },
  corporateName: {
    type: String,
  },
  Email: {
    type: String,
  },
  Phone: {
    type: String,
  },
  corporateTaxPayer: {
    type: String,
  },
  description: {
    type: String,
  },
  coverImage: {
    type: String,
  },
  logo: {
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
  country: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Country',
  },
  type: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CompanyType'
  },
  companyWebsite: {
    type: String,
  },
  hasWebinarAccess: {
    type: Boolean,
    default: false,
  },
  addressLine1: {
    type: String,
  },
  addressLine2: {
    type: String,
  },
  stateProvinceRegion: {
    type: String,
  },
  city: {
    type: String,
  },
  zipCode: {
    type: String,
  },
  CreatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  UpdatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  yearOfEstablishment: {
    type: Number,
  },
  numberOfEmployees: {
    type: String,
  },
  numberOfPosts: {
    type: Number,
  },
  disable: {
    type: Boolean,
    default: false,
  },
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
  },
  FileId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'File',
  },
  postLimit: {
    type: Number,
  },
  postWaitDays: {
    type: Number,
  },
  Type: {
    type: Number,
  },
  OrganizationKey: [{
    type: String,
  }],
  annualReportsBase64: {
    type: String,
  },
  institutionalPresentationBase64: {
    type: String,
  },
  logoBase64: {
    type: String,
  },
  listingsAvailableCount: {
    type: Number,
  },
  allowedDomain: {
    type: String,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  LastActivity: {
    type: Date,
  },
}, {
  timestamps: true,
});

companyProfileSchema.index({ '$**': 'text' });

/**
 * Statics
 */
companyProfileSchema.statics = {

  /**
     * List companies in descending order of 'createdAt' timestamp.
     *
     * @returns {Promise<CompanyProfile[]>}
     */
  list() {
    const options = omitBy({}, isNil);

    return this.find(options)
      .sort({ createdAt: -1 })
      .exec();
  },
};
/**
 * @typedef CompanyProfile
 */
const CompanyProfileSchema = mongoose.model('CompanyProfile', companyProfileSchema);

companyProfileSchema.index(
  {
    _id: 1,
    organization: 1,
  },
  {
    collation: {
      locale: 'en',
      strength: 4,
    },
    name: 'companyProfilesIndexes'
  }
)

module.exports = CompanyProfileSchema;
