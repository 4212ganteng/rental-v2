import express from "express";
import {
  createPost,
  getFeedPosts,
  getUserPosts,
  likePost,
  deletePost,
} from "../controllers/Posts.js";
import { verifyToken } from "../../middleware/Auth.js";
import { uploadFiles } from "../../middleware/uploadFiles.js";

const router = express.Router();

// CREATE
router.post("/posts", verifyToken, uploadFiles, createPost);

/* READ */
router.get("/posts", verifyToken, getFeedPosts);
router.get("/:userId/posts", verifyToken, getUserPosts);

/* UPDATE */
router.post("/like/:postId", verifyToken, likePost);

// DELETE
router.delete("/posts/:postId", verifyToken, deletePost);

export default router;
