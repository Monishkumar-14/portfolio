import express from "express";
import { chatWithGroq } from "../controllers/chatController.js";

const router = express.Router();

// POST /api/chat — public endpoint for mobile app chatbot
router.post("/", chatWithGroq);

export default router;
