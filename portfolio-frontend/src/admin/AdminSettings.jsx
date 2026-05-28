import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Settings, User, Shield, Trash2, AlertTriangle,
  Globe, Bell, Eye, Moon, RefreshCw, CheckCircle,
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: "easeOut" },
});

const AdminSettings = () => {
  const { token } = useAuth();
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  // Site preferences (stored in localStorage)
  const [prefs, setPrefs] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("adminPrefs") || "{}");
    } catch {
      return {};
    }
  });

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/admin/me`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setAdmin(data.admin);
      } catch {
        toast.error("Failed to load admin info.");
      } finally {
        setLoading(false);
      }
    };
    fetchAdmin();
  }, [token]);

  const updatePref = (key, val) => {
    const next = { ...prefs, [key]: val };
    setPrefs(next);
    localStorage.setItem("adminPrefs", JSON.stringify(next));
    toast.success("Preference saved!");
  };

  const clearAllMessages = async () => {
    if (!window.confirm("⚠️ Are you sure you want to delete ALL messages? This cannot be undone.")) return;
    if (!window.confirm("This is permanent. Type 'yes' mentally and click OK to proceed.")) return;
    try {
      // We'll delete all messages by fetching IDs and deleting one by one
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/messages`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const messages = data.messages || data;
      for (const m of messages) {
        await axios.delete(
          `${import.meta.env.VITE_API_URL}/api/messages/${m._id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      toast.success(`Deleted ${messages.length} message(s).`);
    } catch {
      toast.error("Failed to clear messages.");
    }
  };

  const Toggle = ({ label, desc, icon: Icon, value, onChange }) => (
    <div className="flex items-center justify-between p-4 rounded-[14px]
      bg-white/[0.03] border border-white/7 hover:border-white/12 transition-all">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-[12px] bg-white/5 border border-white/8
          flex items-center justify-center flex-shrink-0">
          <Icon size={15} className="text-white/40" />
        </div>
        <div>
          <p className="text-sm font-semibold">{label}</p>
          <p className="text-[11px] text-white/30 mt-0.5">{desc}</p>
        </div>
      </div>
      <button
        onClick={() => onChange(!value)}
        role="switch"
        aria-checked={value}
        aria-label={label}
        className={`relative w-11 h-6 rounded-full transition-all duration-200
          ${value
            ? "bg-violet-500/30 border-violet-500/40"
            : "bg-white/8 border-white/12"
          } border`}
      >
        <motion.div
          className={`absolute top-[3px] w-4 h-4 rounded-full transition-colors
            ${value ? "bg-violet-400" : "bg-white/30"}`}
          animate={{ left: value ? "calc(100% - 19px)" : "3px" }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        />
      </button>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <motion.div
          className="w-8 h-8 border-2 border-violet-400/40 border-t-violet-400 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
        />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <motion.div {...fadeUp(0)} className="mb-8">
        <div className="flex items-center gap-2.5 mb-1">
          <Settings size={16} className="text-violet-400" />
          <p className="text-[10px] font-semibold uppercase tracking-[2px]
            text-white/28">
            Configuration
          </p>
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight">
          Admin Settings
        </h1>
        <p className="text-xs text-white/35 mt-1">
          Manage your admin profile and site preferences.
        </p>
      </motion.div>

      {/* ── Profile Card ── */}
      <motion.div {...fadeUp(0.05)} className="glass-card p-7 mb-5">
        <div className="flex items-center gap-2 mb-5">
          <User size={14} className="text-violet-400" />
          <p className="text-xs font-bold uppercase tracking-[1px] text-white/30">
            Admin Profile
          </p>
        </div>

        <div className="flex items-center gap-5 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br
            from-violet-600 to-cyan-500 flex items-center justify-center
            text-2xl font-extrabold shadow-[0_4px_20px_rgba(124,58,237,0.35)]
            flex-shrink-0">
            {admin?.username?.[0]?.toUpperCase() ?? "M"}
          </div>
          <div>
            <h3 className="text-lg font-extrabold">{admin?.username ?? "Admin"}</h3>
            <p className="text-xs text-violet-300 font-medium mt-0.5">Administrator</p>
            <p className="text-[10px] text-white/25 mt-1">
              Member since {new Date(admin?.createdAt).toLocaleDateString("en-IN", {
                year: "numeric", month: "long", day: "numeric",
              })}
            </p>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { label: "Username", value: admin?.username ?? "—", icon: User },
            { label: "Role", value: "Super Admin", icon: Shield },
            { label: "Auth", value: "JWT · 7 day expiry", icon: Shield },
            { label: "API", value: import.meta.env.VITE_API_URL || "localhost", icon: Globe },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="flex items-center gap-3 p-3.5 rounded-[12px]
              bg-white/[0.03] border border-white/7">
              <Icon size={13} className="text-white/25 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-[9px] uppercase tracking-widest text-white/22">{label}</p>
                <p className="text-xs font-semibold text-white/60 truncate mt-0.5">{value}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── Preferences ── */}
      <motion.div {...fadeUp(0.1)} className="glass-card p-7 mb-5">
        <div className="flex items-center gap-2 mb-5">
          <Bell size={14} className="text-cyan-400" />
          <p className="text-xs font-bold uppercase tracking-[1px] text-white/30">
            Preferences
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <Toggle
            icon={Bell}
            label="Email Notifications"
            desc="Receive email when someone sends a message"
            value={prefs.emailNotifications ?? true}
            onChange={(v) => updatePref("emailNotifications", v)}
          />
          <Toggle
            icon={Eye}
            label="Show Chatbot Section"
            desc="Display the AI chatbot on the portfolio"
            value={prefs.showChatbot ?? true}
            onChange={(v) => updatePref("showChatbot", v)}
          />
          <Toggle
            icon={Moon}
            label="Default Dark Mode"
            desc="New visitors see dark theme by default"
            value={prefs.defaultDark ?? true}
            onChange={(v) => updatePref("defaultDark", v)}
          />
          <Toggle
            icon={Globe}
            label="Show Resume Section"
            desc="Display resume/PDF viewer on portfolio"
            value={prefs.showResume ?? true}
            onChange={(v) => updatePref("showResume", v)}
          />
        </div>
      </motion.div>

      {/* ── Session Info ── */}
      <motion.div {...fadeUp(0.15)} className="glass-card p-7 mb-5">
        <div className="flex items-center gap-2 mb-5">
          <Shield size={14} className="text-green-400" />
          <p className="text-xs font-bold uppercase tracking-[1px] text-white/30">
            Session & Security
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between p-4 rounded-[14px]
            bg-white/[0.03] border border-white/7">
            <div className="flex items-center gap-3">
              <CheckCircle size={15} className="text-green-400" />
              <div>
                <p className="text-sm font-semibold">Session Status</p>
                <p className="text-[11px] text-white/30 mt-0.5">
                  Authenticated · JWT Token Active
                </p>
              </div>
            </div>
            <span className="px-3 py-1.5 rounded-full text-[10px] font-bold
              bg-green-500/12 border border-green-500/25 text-green-400">
              Active
            </span>
          </div>

          <div className="flex items-center justify-between p-4 rounded-[14px]
            bg-white/[0.03] border border-white/7">
            <div className="flex items-center gap-3">
              <RefreshCw size={15} className="text-white/30" />
              <div>
                <p className="text-sm font-semibold">Token Expiry</p>
                <p className="text-[11px] text-white/30 mt-0.5">
                  Auto-expires after 7 days of inactivity
                </p>
              </div>
            </div>
            <span className="text-[11px] text-white/25 font-mono">7d</span>
          </div>
        </div>
      </motion.div>

      {/* ── Danger Zone ── */}
      <motion.div {...fadeUp(0.2)} className="glass-card p-7 border-red-500/15">
        <div className="flex items-center gap-2 mb-5">
          <AlertTriangle size={14} className="text-red-400" />
          <p className="text-xs font-bold uppercase tracking-[1px] text-red-400/50">
            Danger Zone
          </p>
        </div>

        <div className="flex items-center justify-between p-4 rounded-[14px]
          bg-red-500/5 border border-red-500/15">
          <div>
            <p className="text-sm font-semibold text-red-400/80">Clear All Messages</p>
            <p className="text-[11px] text-white/30 mt-0.5">
              Permanently delete all contact messages. This cannot be undone.
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={clearAllMessages}
            className="flex items-center gap-2 px-5 py-2.5 rounded-[10px]
              text-xs font-bold bg-red-500/12 border border-red-500/25
              text-red-400 hover:bg-red-500/22 transition-all flex-shrink-0"
          >
            <Trash2 size={13} /> Delete All
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminSettings;
