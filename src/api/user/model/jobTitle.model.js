const mongoose = require('mongoose');

/**
 * Job Title Schema
 * @private
 */
const jobTitleSchema = new mongoose.Schema({
  number: {
    type: Number,
    required: false,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  otherValues: [
    {
      type: String,
      required: false
    }
  ]
}, {
  timestamps: true,
});

/**
 * @typedef JobTitle
 */
const JobTitleSchema = mongoose.model('JobTitle', jobTitleSchema);
module.exports = JobTitleSchema;
