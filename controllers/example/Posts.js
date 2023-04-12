// schema
import Post from "../../models/Post.js";
import User from "../../models/User.js";
import Likes from "../../models/Likes.js";
Comments;

import { Response } from "../helpers/response.js";
import { userResponse } from "../../dto/user/userResponse.js";
import { cloudinaryDestroyer } from "@packages/cloudinary.js";
import Comments from "../../models/Comments.js";
import { postResponse } from "../../dto/post/postResponse.js";

/* CREATE */
export const createPost = async (req, res) => {
  try {
    const { description } = req.body;
    const { id: userId } = req.user;
    const files = req.urls;

    const getUser = await User.findById(userId);
    const user = userResponse(getUser);

    const newPost = new Post({
      user,
      files,
      description,
    });
    await newPost.save();

    const post = await Post.find();
    res
      .status(201)
      .json(Response.successResponse({ post }, "Success Create Post!"));
  } catch (err) {
    res.status(409).json(Response.errorResponse(err.message));
  }
};

/* READ */
export const getFeedPosts = async (req, res) => {
  try {
    const posts = await Post.find();

    const response = await Promise.all(
      posts.map(async (post) => {
        const comments = await Comments.find({ postId: post.id });
        const likes = await Likes.find({ postId: post.id });
        const rawPostResponse = postResponse(post);

        return { ...rawPostResponse, comments, likes };
      })
    );

    return res
      .status(200)
      .json(Response.successResponse({ posts: response }, ""));
  } catch (err) {
    return res.status(409).json(Response.errorResponse(err.message));
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const post = await Post.find({ userId });
    res.status(200).json(Response.successResponse({ post }, ""));
  } catch (err) {
    res.status(409).json(Response.errorResponse(err.message));
  }
};

export const likePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { id: userId } = req.user;

    const getUser = await User.findById(userId);
    const user = userResponse(getUser);

    const newLikes = new Likes({
      user,
      postId,
    });

    const isLiked = await Likes.findOne({ "user._id": user._id });

    if (isLiked) {
      await Likes.deleteOne({ "user._id": user._id, postId });
      return res.status(200).json(Response.successResponse(null, "unliked"));
    }

    await newLikes.save();

    return res
      .status(200)
      .json(Response.successResponse({ newLikes }, "liked!"));
  } catch (err) {
    return res.status(409).json(Response.errorResponse(err.message));
  }
};

// DELETE
export const deletePost = async (req, res) => {
  const { postId } = req.params;

  try {
    const currentPost = await Post.findById(postId);

    const publicIds = currentPost.files.map((file) => file.public_id);

    await cloudinaryDestroyer(publicIds);

    await Post.deleteOne({ _id: postId });

    return res
      .status(200)
      .json(Response.successResponse(null, "Success delete your post!"));
  } catch (error) {
    return res.status(409).json(Response.errorResponse(error.message));
  }
};
