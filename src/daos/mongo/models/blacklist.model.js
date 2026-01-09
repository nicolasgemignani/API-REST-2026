import mongoose from "mongoose";

const collectionName = "blacklist";

const blacklistSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
      index: true, // Improves lookup performance
    },
    expiresAt: {
      type: Date,
      required: true,
      description: "Date when the token becomes invalid",
    },
  },
  {
    timestamps: true, // Adds createdAt & updatedAt
  }
);

const BlacklistModel = mongoose.model(collectionName, blacklistSchema);

export default BlacklistModel;