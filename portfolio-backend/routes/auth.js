import express from "express";
import {
  loginAdmin,
  seedAdmin,
  changePassword,
  getMe,
  getStats,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/login",           loginAdmin);
router.post("/seed",            seedAdmin);
router.post("/change-password", protect, changePassword);
router.get("/me",               protect, getMe);
router.get("/stats",            protect, getStats);

export default router;