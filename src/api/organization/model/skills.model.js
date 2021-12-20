const mongoose = require('mongoose');

/**
 * Skills Schema
 * @private
 */
const skillsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    segment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Segment',
      required: false,
    },
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization',
      required: false
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

/**
 * @typedef Skills
 */
const SkillsSchema = mongoose.model('Skills', skillsSchema);
module.exports = SkillsSchema;
