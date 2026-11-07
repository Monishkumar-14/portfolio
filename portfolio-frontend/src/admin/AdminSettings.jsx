import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Settings, User, Shield, Trash2, AlertTriangle, Globe, Bell, Eye, Moon, RefreshCw, CheckCircle,
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { PageHeader, SettingRow, Spinner, Pill, fadeUp } from "./AdminUI";
import "./Admin.css";

const AdminSettings = () => {
  const { token } = useAuth();
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [clearing, setClearing] = useState(false);

  // Preferences live in this browser's localStorage only
  const [prefs, setPrefs] = useState(() => {
    try { return JSON.parse(localStorage.getItem("adminPrefs") || "{}"); } catch { return {}; }
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
    if (clearing) return;
    if (!window.confirm("Are you sure you want to delete ALL messages? This cannot be undone.")) return;
    if (!window.confirm("This is permanent. Click OK to delete every message.")) return;
    setClearing(true);
    try {
      // No bulk endpoint: fetch the IDs and delete them one by one
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
    } finally {
      setClearing(false);
    }
  };

  if (loading) return <div className="adm-load"><Spinner size={30} /></div>;

  const memberSince = admin?.createdAt && !Number.isNaN(new Date(admin.createdAt).getTime())
    ? new Date(admin.createdAt).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })
    : null;

  return (
    <div className="adm-narrow">
      <PageHeader eyebrow="Configuration" icon={Settings} title="Admin Settings" sub="Manage your admin profile and site preferences." />

      {/* Profile */}
      <motion.section {...fadeUp(0.05)} className="adm-card adm-card--pad adm-section" aria-label="Admin profile">
        <h2 className="adm-h2 adm-section__h"><User size={14} aria-hidden="true"/> Admin Profile</h2>
        <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 20, flexWrap: "wrap" }}>
          <span className="adm-avatar adm-avatar--lg" aria-hidden="true">{admin?.username?.[0]?.toUpperCase() ?? "M"}</span>
          <div style={{ minWidth: 0 }}>
            <p style={{ margin: 0, font: "800 18px/1.2 var(--mono)" }}>{admin?.username ?? "Admin"}</p>
            <p style={{ margin: "5px 0 0", font: "500 12px/1 var(--mono)", color: "var(--accent)" }}>Administrator</p>
            {memberSince && <p style={{ margin: "6px 0 0", font: "400 11px/1 var(--mono)", color: "var(--faint)" }}>Member since {memberSince}</p>}
          </div>
        </div>
        <div className="adm-infogrid">
          {[
            { label: "Username", value: admin?.username ?? "—", icon: User },
            { label: "Role", value: "Super Admin", icon: Shield },
            { label: "Auth", value: "JWT · 7 day expiry", icon: Shield },
            { label: "API", value: import.meta.env.VITE_API_URL || "localhost", icon: Globe },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="adm-info">
              <Icon size={14} aria-hidden="true" />
              <div style={{ minWidth: 0 }}><small>{label}</small><span title={String(value)}>{value}</span></div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Preferences */}
      <motion.section {...fadeUp(0.1)} className="adm-card adm-card--pad adm-section" aria-label="Preferences">
        <h2 className="adm-h2 adm-section__h"><Bell size={14} aria-hidden="true"/> Preferences</h2>
        <p className="adm-hint" style={{ margin: "-6px 0 16px" }}>Saved in this browser only. These toggles do not change the public website or the server.</p>
        <div className="adm-stack" style={{ gap: 12 }}>
          <SettingRow icon={Bell}  label="Email Notifications" desc="Receive email when someone sends a message" checked={prefs.emailNotifications ?? true} onChange={(v) => updatePref("emailNotifications", v)} />
          <SettingRow icon={Eye}   label="Show Chatbot Section" desc="Display the AI chatbot on the portfolio" checked={prefs.showChatbot ?? true} onChange={(v) => updatePref("showChatbot", v)} />
          <SettingRow icon={Moon}  label="Default Dark Mode" desc="New visitors see dark theme by default" checked={prefs.defaultDark ?? true} onChange={(v) => updatePref("defaultDark", v)} />
          <SettingRow icon={Globe} label="Show Resume Section" desc="Display resume/PDF viewer on portfolio" checked={prefs.showResume ?? true} onChange={(v) => updatePref("showResume", v)} />
        </div>
      </motion.section>

      {/* Session */}
      <motion.section {...fadeUp(0.15)} className="adm-card adm-card--pad adm-section" aria-label="Session and security">
        <h2 className="adm-h2 adm-section__h"><Shield size={14} aria-hidden="true"/> Session &amp; Security</h2>
        <div className="adm-stack" style={{ gap: 12 }}>
          <div className="adm-setting">
            <div className="adm-setting__l">
              <span className="adm-setting__ic" style={{ color: "var(--green)" }}><CheckCircle size={15} aria-hidden="true"/></span>
              <div><p className="adm-setting__t">Session Status</p><p className="adm-setting__d">Authenticated · JWT token active</p></div>
            </div>
            <Pill tone="green">Active</Pill>
          </div>
          <div className="adm-setting">
            <div className="adm-setting__l">
              <span className="adm-setting__ic"><RefreshCw size={15} aria-hidden="true"/></span>
              <div><p className="adm-setting__t">Token Expiry</p><p className="adm-setting__d">Tokens expire after 7 days</p></div>
            </div>
            <span className="adm-time">7d</span>
          </div>
        </div>
      </motion.section>

      {/* Danger zone */}
      <motion.section {...fadeUp(0.2)} className="adm-card adm-card--pad adm-card--danger adm-section" aria-label="Danger zone">
        <h2 className="adm-h2 adm-section__h" style={{ color: "var(--red)" }}><AlertTriangle size={14} aria-hidden="true" style={{ color: "var(--red)" }}/> Danger Zone</h2>
        <div className="adm-setting" style={{ background: "rgba(255,90,79,.05)", borderColor: "rgba(255,90,79,.2)" }}>
          <div>
            <p className="adm-setting__t" style={{ color: "#ff8a80" }}>Clear All Messages</p>
            <p className="adm-setting__d">Permanently delete all contact messages. This cannot be undone.</p>
          </div>
          <button type="button" onClick={clearAllMessages} disabled={clearing} className="adm-btn adm-btn--danger adm-btn--sm">
            {clearing ? <Spinner size={13}/> : <Trash2 size={13} aria-hidden="true"/>} Delete All
          </button>
        </div>
      </motion.section>
    </div>
  );
};

export default AdminSettings;