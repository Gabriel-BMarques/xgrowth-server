const mongoose = require("mongoose");

const reviewStatuses = ["pending", "approved", "denied"];
const types = ["training", "bootcamp", "insights", "promotion"];

/**
 * Webinar Schema
 * @private
 */
const webinarSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    meetingLink: {
      type: String,
    },
    reviewStatus: {
      type: String,
      enum: reviewStatuses,
      default: "pending",
    },
    denialReason: {
      type: String,
    },
    type: {
      type: String,
      enum: types,
      default: "insights",
    },
    eventDate: {
      type: Date,
    },
    eventEndDate: {
      type: Date,
    },
    eventDuration: {
      type: String,
      default: 1,
    },
    eventTimezone: {
      offset: {
        type: Number,
        required: false,
      },
      text: {
        type: String,
        required: false,
      },
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
    isPublished: {
      type: Boolean,
      default: false,
    },
    targetDepartments: [
      {
        type: String,
      },
    ],
    targetCompanies: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CompanyProfile",
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);
/**
 * @typedef Webinar
 */
module.exports = mongoose.model("Webinar", webinarSchema);
