import mongoose from "mongoose";

const collectionName = "blacklist";

const blacklistSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
      index: true, 
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 } 
    },
  },
  {
    timestamps: true,
  }
);

const BlacklistModel = mongoose.model(collectionName, blacklistSchema);

export default BlacklistModel;