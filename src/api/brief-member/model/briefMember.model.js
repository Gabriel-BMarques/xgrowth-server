const mongoose = require('mongoose');

/**
 * BriefMember Schema
 * @private
 */
const briefMemberSchema = new mongoose.Schema({
  BriefId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Brief',
  },
  UserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  Admin: {
    type: Boolean,
    required: true,
    default: false,
  },
  IsContact: {
    type: Boolean,
    required: true,
    default: false,
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
 * @typedef BriefMember
 */
const BriefMemberSchema = mongoose.model('BriefMember', briefMemberSchema);

briefMemberSchema.index(
  {
    UserId: 1,
    BriefId: 1
  },
  {
    collation: {
      locale: 'en',
      strength: 4,
    },
    name: 'briefMembersIndexes'
  }
)

module.exports = BriefMemberSchema;
