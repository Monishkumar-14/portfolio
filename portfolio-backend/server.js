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

// ── Allowed origins ───────────────────────────────────────────────
const ALLOWED_ORIGINS = [
  "http://localhost:5173",
  "http://localhost:4173",
  "http://127.0.0.1:5173",
  "https://monishdev.online",
  "https://www.monishdev.online",
  "https://portfolio-phi-ten-lxkms7co9f.vercel.app",
  process.env.CLIENT_URL,           // still respected if set in .env
].filter(Boolean);                  // removes undefined if CLIENT_URL isn't set

// ── Middleware ────────────────────────────────────────────────────
app.use(cors({
  origin: (origin, callback) => {
    // allow requests with no origin (Postman, curl, server-to-server)
    if (!origin || ALLOWED_ORIGINS.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS blocked: ${origin}`));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// Handle preflight requests for all routes
app.options("*", cors());

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// ── Routes ────────────────────────────────────────────────────────
app.use("/api/admin",        authRoutes);
app.use("/api/projects",     projectRoutes);
app.use("/api/certificates", certificateRoutes);
app.use("/api/messages",     messageRoutes);

// ── Health check ─────────────────────────────────────────────────
app.get("/", (req, res) => res.json({ status: "Portfolio API running" }));

// ── Connect DB + Start ────────────────────────────────────────────
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("[OK] MongoDB connected");
    app.listen(PORT, () => console.log(`[SERVER] Running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("[ERROR] MongoDB:", err.message);
    process.exit(1);
  });