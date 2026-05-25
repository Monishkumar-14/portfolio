import jwt         from "jsonwebtoken";
import Admin       from "../models/Admin.js";
import Project     from "../models/Project.js";
import Certificate from "../models/Certificate.js";
import Message     from "../models/Message.js";

// ── POST /api/admin/login ─────────────────────────────────────────
export const loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username?.trim() || !password?.trim()) {
      return res.status(400).json({ message: "Username and password are required." });
    }

    const admin = await Admin.findOne({ username: username.trim().toLowerCase() });
    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const isMatch = await admin.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const token = jwt.sign(
      { id: admin._id, username: admin.username },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      success: true,
      token,
      admin: { id: admin._id, username: admin.username },
    });
  } catch (err) {
    console.error("loginAdmin error:", err);
    return res.status(500).json({ message: "Server error. Please try again." });
  }
};

// ── POST /api/admin/seed  (run once to create first admin) ────────
export const seedAdmin = async (req, res) => {
  try {
    const existing = await Admin.findOne({ username: "monish" });
    if (existing) {
      return res.json({ message: "Admin already exists. Use /api/admin/login." });
    }

    await Admin.create({
      username: "monish",
      password: "Monish@2024",
    });

    return res.status(201).json({
      success: true,
      message: "Admin created successfully!",
      credentials: { username: "monish", password: "Monish@2024" },
    });
  } catch (err) {
    console.error("seedAdmin error:", err);
    return res.status(500).json({ message: "Server error." });
  }
};

// ── POST /api/admin/change-password  (protected) ──────────────────
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Both passwords are required." });
    }
    if (newPassword.length < 8) {
      return res.status(400).json({ message: "New password must be at least 8 characters." });
    }

    const admin = await Admin.findById(req.admin.id);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found." });
    }

    const isMatch = await admin.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ message: "Current password is incorrect." });
    }

    admin.password = newPassword;
    await admin.save(); // triggers bcrypt pre-save hook

    return res.json({ success: true, message: "Password changed successfully." });
  } catch (err) {
    console.error("changePassword error:", err);
    return res.status(500).json({ message: "Server error." });
  }
};

// ── GET /api/admin/me  (protected — verify token) ─────────────────
export const getMe = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id).select("-password");
    if (!admin) return res.status(404).json({ message: "Admin not found." });
    return res.json({ success: true, admin });
  } catch (err) {
    return res.status(500).json({ message: "Server error." });
  }
};

// ── GET /api/admin/stats  (protected — dashboard overview) ────────
export const getStats = async (req, res) => {
  try {
    const [projects, certificates, messages, unreadMessages, recentMessages] =
      await Promise.all([
        Project.countDocuments(),
        Certificate.countDocuments(),
        Message.countDocuments(),
        Message.countDocuments({ read: false }),
        Message.find().sort({ createdAt: -1 }).limit(5).lean(),
      ]);

    return res.json({
      success: true,
      stats: { projects, certificates, messages, unreadMessages },
      recentMessages,
    });
  } catch (err) {
    console.error("getStats error:", err);
    return res.status(500).json({ message: "Server error." });
  }
};