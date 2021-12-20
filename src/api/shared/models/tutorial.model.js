const mongoose = require("mongoose");

/**
 * Tutorial Schema
 * @private
 */
const tutorialSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    topic: {
      type: String,
      required: true,
    },
    visible: {
      type: Boolean,
      required: true,
      default: false,
    },
    text: {
      type: String,
      required: true,
    },
    uploadedFiles: [
      {
        url: {
          type: String,
        },
        name: {
          type: String,
        },
        order: {
          type: Number,
        },
        description: {
          type: String,
        },
        type: {
          type: String,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);
/**
 * @typedef Tutorial
 */
module.exports = mongoose.model("Tutorial", tutorialSchema);
