const mongoose = require('mongoose');

const postCompany = new mongoose.Schema({
  PostId: {
    type: mongoose.Types.ObjectId,
    ref: 'post',
    required: true,
  },
  CompanyId: {
    type: mongoose.Types.ObjectId,
    ref: 'company',
    required: true,
  },
  UserId: {
    type: mongoose.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  CreatedBy: {
    type: String,
    required: true,
  },
  UpdatedBy: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

/**
 * @typedef postCompany
 */
const PostCompany = mongoose.model('postCompany', postCompany);
module.exports = PostCompany;
