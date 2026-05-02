import express from "express";
import {
  createMessage,
  getMessages,
  markRead,
  deleteMessage,
} from "../controllers/messageController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/",          createMessage);           // public
router.get("/",  protect, getMessages);             // admin only
router.patch("/:id/read", protect, markRead);       // admin only
router.delete("/:id",     protect, deleteMessage);  // admin only

export default router;