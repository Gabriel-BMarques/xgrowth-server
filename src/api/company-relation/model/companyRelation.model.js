const mongoose = require('mongoose');
const {
  omitBy, isNil,
} = require('lodash');

/**
 * CompanyRelation Schema
 * @private
 */
const companyRelationSchema = new mongoose.Schema({
  companyA: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CompanyProfile',
  },
  companyB: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CompanyProfile',
  },
  disabled: {
    type: Boolean,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, {
  timestamps: true,
});

companyRelationSchema.index({ '$**': 'text' });

/**
 * Statics
 */
companyRelationSchema.statics = {

  /**
     * List company relations in descending order of 'createdAt' timestamp.
     *
     * @returns {Promise<CompanyRelation[]>}
     */
  list() {
    const options = omitBy({}, isNil);

    return this.find(options)
      .sort({ createdAt: -1 })
      .exec();
  },
};
/**
 * @typedef CompanyRelation
 */
const CompanyRelationSchema = mongoose.model('CompanyRelation', companyRelationSchema);

companyRelationSchema.index(
  {
    companyA: 1,
    companyB: 1
  },
  {
    collation: {
      locale: 'en',
      strength: 4,
    },
    name: 'companyRelationsIndexes'
  }
)

module.exports = CompanyRelationSchema;
