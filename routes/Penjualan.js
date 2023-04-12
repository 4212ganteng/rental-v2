import express from "express";
import PenjualanController from "../controllers/PenjualanController.js";

// import { verifyToken } from "../middleware/Auth.js";

const router = express.Router();
// create
router.post("/create", PenjualanController.Create);

export default router;
