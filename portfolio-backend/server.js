import express    from "express";
import mongoose   from "mongoose";
import cors       from "cors";
import dotenv     from "dotenv";
import projectRoutes     from "./routes/projects.js";
import certificateRoutes from "./routes/certificates.js";
import messageRoutes     from "./routes/messages.js";
import authRoutes        from "./routes/auth.js";

dotenv.config();

const app  = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ────────────────────────────────────────────────────
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// ── Routes ────────────────────────────────────────────────────────
app.use("/api/admin",        authRoutes);
app.use("/api/projects",     projectRoutes);
app.use("/api/certificates", certificateRoutes);
app.use("/api/messages",     messageRoutes);

// ── Health check ─────────────────────────────────────────────────
app.get("/", (req, res) => res.json({ status: "🚀 Portfolio API running" }));

// ── Connect DB + Start ────────────────────────────────────────────
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => console.log(`🚀 Server on port ${PORT}`));
  })
  .catch((err) => {
    console.error("❌ MongoDB error:", err.message);
    process.exit(1);
  });