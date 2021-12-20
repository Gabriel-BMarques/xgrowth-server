const mongoose = require('mongoose');

/**
 * PostCompany Schema
 * @private
 */
const postCompanySchema = new mongoose.Schema({
  CompanyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  PostId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
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
 * @typedef PostCompany
 */
const PostCompanySchema = mongoose.model('PostCompany', postCompanySchema);
module.exports = PostCompanySchema;
