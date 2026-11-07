import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  FolderOpen, Award, MessageSquare, MailWarning, Plus, ArrowRight, Eye, Clock,
  TrendingUp, KeyRound, LayoutDashboard,
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { PageHeader, Spinner, fadeUp, timeAgo } from "./AdminUI";
import "./Admin.css";

const AdminOverview = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/admin/stats`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setStats(data.stats);
        setRecent(data.recentMessages || []);
      } catch {
        toast.error("Failed to load dashboard stats.");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [token]);

  const now = new Date();
  const greeting = now.getHours() < 12 ? "Good Morning" : now.getHours() < 17 ? "Good Afternoon" : "Good Evening";

  const STAT_CARDS = [
    { label: "Projects",        value: stats?.projects ?? "—",       icon: <FolderOpen size={20} />,    color: "#ff6b35", to: "/admin/projects" },
    { label: "Certificates",    value: stats?.certificates ?? "—",   icon: <Award size={20} />,         color: "#4d8dff", to: "/admin/certificates" },
    { label: "Total Messages",  value: stats?.messages ?? "—",       icon: <MessageSquare size={20} />, color: "#22d67a", to: "/admin/messages" },
    { label: "Unread Messages", value: stats?.unreadMessages ?? "—", icon: <MailWarning size={20} />,   color: "#e5c07b", to: "/admin/messages", highlight: (stats?.unreadMessages ?? 0) > 0 },
  ];

  const QUICK_ACTIONS = [
    { label: "Add Project",     desc: "Create a new portfolio project", icon: <Plus size={16} />,     to: "/admin/projects" },
    { label: "Add Certificate", desc: "Add a new certification",        icon: <Plus size={16} />,     to: "/admin/certificates" },
    { label: "View Messages",   desc: "Check your inbox",               icon: <Eye size={16} />,      to: "/admin/messages" },
    { label: "Change Password", desc: "Update admin credentials",       icon: <KeyRound size={16} />, to: "/admin/password" },
  ];

  if (loading) return <div className="adm-load"><Spinner size={30} /></div>;

  const apiOk = !!stats; // the stats request succeeded → the API is reachable

  return (
    <div>
      <PageHeader
        eyebrow="Dashboard Overview" icon={LayoutDashboard}
        title={<>{greeting}, <em>Monish</em></>}
        sub={`${now.toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })} · ${now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}`}
      />

      <div className="adm-stats">
        {STAT_CARDS.map((card, i) => (
          <motion.button key={card.label} type="button" {...fadeUp(0.05 + i * 0.06)} onClick={() => navigate(card.to)}
            className="adm-card adm-card--hover adm-stat" style={{ "--c": card.color }} aria-label={`${card.label}: ${card.value}`}>
            <span className="adm-stat__top">
              <span className="adm-stat__ic" aria-hidden="true">{card.icon}</span>
              {card.highlight && <span className="adm-pill adm-pill--orange">NEW</span>}
            </span>
            <span className="adm-stat__v" style={{ display: "block" }}>{card.value}</span>
            <span className="adm-stat__l" style={{ display: "block" }}>{card.label}</span>
          </motion.button>
        ))}
      </div>

      <div className="adm-two">
        {/* Recent messages */}
        <motion.section {...fadeUp(0.25)} className="adm-card" aria-label="Recent messages" style={{ overflow: "hidden" }}>
          <div className="adm-card__bar">
            <h2 className="adm-h2"><Clock size={14} aria-hidden="true"/> Recent Messages</h2>
            <button type="button" onClick={() => navigate("/admin/messages")} className="adm-link">View All <ArrowRight size={12} aria-hidden="true"/></button>
          </div>

          {recent.length === 0 ? (
            <div className="adm-empty"><MessageSquare size={28} aria-hidden="true"/>No messages yet<br/><small>Messages from visitors will appear here</small></div>
          ) : (
            <div>
              {recent.map((m) => (
                <button key={m._id} type="button" onClick={() => navigate("/admin/messages")}
                  className={`adm-msgrow${!m.read ? " adm-msgrow--unread" : ""}`}>
                  <span className="adm-avatar adm-avatar--md" aria-hidden="true" style={m.read ? { color: "#8d9299", background: "rgba(255,255,255,.06)", borderColor: "rgba(255,255,255,.12)" } : undefined}>
                    {m.name?.[0]?.toUpperCase() ?? "?"}
                  </span>
                  <span className="adm-msgrow__body">
                    <span className="adm-msgrow__n">
                      <span className="adm-trunc" style={{ color: m.read ? "#9a9fa8" : "#fff" }}>{m.name}</span>
                      {!m.read && <span className="adm-unreadmark" aria-label="Unread"/>}
                    </span>
                    <span className="adm-msgrow__m adm-trunc" style={{ display: "block" }}>
                      <span style={{ color: "#aeb3ba" }}>{m.subject}</span>{" — "}{m.message}
                    </span>
                  </span>
                  <span className="adm-time">{timeAgo(m.createdAt)}</span>
                </button>
              ))}
            </div>
          )}
        </motion.section>

        {/* Quick actions */}
        <motion.section {...fadeUp(0.3)} className="adm-card adm-card--pad" aria-label="Quick actions">
          <h2 className="adm-h2" style={{ marginBottom: 18 }}><TrendingUp size={14} aria-hidden="true"/> Quick Actions</h2>
          <div className="adm-stack" style={{ gap: 10 }}>
            {QUICK_ACTIONS.map((a) => (
              <button key={a.label} type="button" onClick={() => navigate(a.to)} className="adm-quick">
                <span className="adm-quick__ic" aria-hidden="true">{a.icon}</span>
                <span style={{ minWidth: 0 }}><span className="adm-quick__t" style={{ display: "block" }}>{a.label}</span><span className="adm-quick__d" style={{ display: "block" }}>{a.desc}</span></span>
                <ArrowRight size={14} aria-hidden="true"/>
              </button>
            ))}
          </div>

          {/* Reflects the real stats request, not a hardcoded claim */}
          <div className={`adm-status${apiOk ? "" : " adm-status--bad"}`} role="status">
            <i aria-hidden="true"/>
            <div>
              <p>{apiOk ? "API connected" : "API unreachable"}</p>
              <small>{apiOk ? "Dashboard data loaded successfully" : "Could not load dashboard data"}</small>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default AdminOverview;