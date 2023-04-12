import mongoose from "mongoose";

const commentsSchema = mongoose.Schema(
  {
    user: {
      type: {},
      required: true,
    },
    postId: String,
    text: String,
  },
  { timestamps: true }
);

const Comments = mongoose.model("Comments", commentsSchema);

export default Comments;
