import Message from "../models/Message.js";
import {
  sendContactNotification,
  sendAutoReply,
} from "../utils/sendEmail.js";

// ── POST /api/messages  (public) ──────────────────────────────────
export const createMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Validate
    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return res.status(400).json({ message: "Name, email and message are required." });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: "Invalid email address." });
    }

    // Save to MongoDB
    const saved = await Message.create({
      name:    name.trim(),
      email:   email.trim().toLowerCase(),
      subject: subject?.trim() || "General Enquiry",
      message: message.trim(),
    });

    // Send emails (non-blocking — don't fail the request if email fails)
    Promise.allSettled([
      sendContactNotification({ name, email, subject, message }),
      sendAutoReply({ name, email }),
    ]).catch(console.error);

    return res.status(201).json({
      success: true,
      message: "Message received! Monish will reply soon.",
      id: saved._id,
    });
  } catch (err) {
    console.error("createMessage error:", err);
    return res.status(500).json({ message: "Server error. Please try again." });
  }
};

// ── GET /api/messages  (admin only) ──────────────────────────────
export const getMessages = async (req, res) => {
  try {
    const messages = await Message.find()
      .sort({ createdAt: -1 });
    return res.json({ success: true, count: messages.length, messages });
  } catch (err) {
    console.error("getMessages error:", err);
    return res.status(500).json({ message: "Server error." });
  }
};

// ── PATCH /api/messages/:id/read  (admin only) ────────────────────
export const markRead = async (req, res) => {
  try {
    const msg = await Message.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );
    if (!msg) return res.status(404).json({ message: "Message not found." });
    return res.json({ success: true, message: msg });
  } catch (err) {
    return res.status(500).json({ message: "Server error." });
  }
};

// ── DELETE /api/messages/:id  (admin only) ────────────────────────
export const deleteMessage = async (req, res) => {
  try {
    await Message.findByIdAndDelete(req.params.id);
    return res.json({ success: true, message: "Message deleted." });
  } catch (err) {
    return res.status(500).json({ message: "Server error." });
  }
};