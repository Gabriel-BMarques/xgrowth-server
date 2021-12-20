const mongoose = require("mongoose");

const reactionTypes = ["happy", "sad", "neutral"];

/**
 * TutorialReaction Schema
 * @private
 */
const tutorialReactionSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: reactionTypes,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tutorialId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
/**
 * @typedef TutorialReaction
 */
module.exports = mongoose.model("TutorialReaction", tutorialReactionSchema);
