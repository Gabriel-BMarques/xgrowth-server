const mongoose = require("mongoose");

const invitationStatuses = ["pending approval", "invited", "attending", "not attending"];

/**
 * WebinarInvitation Schema
 * @private
 */
const webinarInvitationSchema = new mongoose.Schema(
  {
    invitedUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    webinarId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Webinar",
    },
    status: {
      type: String,
      enum: invitationStatuses,
      default: "pending approval",
    },
  },
  {
    timestamps: true,
  }
);
/**
 * @typedef WebinarInvitation
 */
module.exports = mongoose.model("WebinarInvitation", webinarInvitationSchema);
