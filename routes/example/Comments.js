import express from "express";
import { commentPost, deleteComment } from "../controllers/comments.js";
import { verifyToken } from "../../middleware/Auth.js";

const router = express.Router();

// CREATE
router.post("/comment/:postId", verifyToken, commentPost);

// DELETE
router.delete("/comment", verifyToken, deleteComment);

export default router;
