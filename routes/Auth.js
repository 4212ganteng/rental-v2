import express from "express";
import { login, register, verifyEmail } from "../controllers/Auth.js";

const router = express.Router();

router.post("/login", login);
router.get("/verify-email/:emailVerificationCode", verifyEmail);
router.post("/register", register);

export default router;
