import mongoose from "mongoose";

// One vote per user per post; value is an upvote (+1) or downvote (-1).
const voteSchema = new mongoose.Schema(
  {
    postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true, index: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    value: { type: Number, enum: [1, -1], required: true },
  },
  { timestamps: true }
);

voteSchema.index({ postId: 1, userId: 1 }, { unique: true });

export default mongoose.models.Vote || mongoose.model("Vote", voteSchema);
