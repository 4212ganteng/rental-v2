import mongoose from "mongoose";

const likesSchema = mongoose.Schema(
  {
    user: {
      type: {},
      required: true,
    },
    postId: String,
  },
  { timestamps: true }
);

const Likes = mongoose.model("Likes", likesSchema);

export default Likes;
