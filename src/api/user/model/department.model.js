const mongoose = require('mongoose');

/**
 * Department Schema
 * @private
 */
const departmentSchema = new mongoose.Schema({
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
 * @typedef Department
 */
const DepartmentSchema = mongoose.model('Department', departmentSchema);
module.exports = DepartmentSchema;
