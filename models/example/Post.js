import mongoose from "mongoose";

const postSchema = mongoose.Schema(
  {
    user: {
      type: {},
      required: true,
    },
    files: {
      type: [
        {
          src: String,
          public_id: String,
        },
      ],
      required: false,
    },
    description: {
      type: String,
      required: true,
    },
    hashtag: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

export default Post;
