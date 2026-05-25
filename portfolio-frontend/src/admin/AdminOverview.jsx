import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  FolderOpen, Award, MessageSquare, MailWarning,
  Plus, ArrowRight, Eye, Clock, TrendingUp,
  Sparkles, Activity,
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: "easeOut" },
});

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

  const timeAgo = (date) => {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    const hrs = Math.floor(mins / 60);
    const days = Math.floor(hrs / 24);
    if (days > 0) return `${days}d ago`;
    if (hrs > 0) return `${hrs}h ago`;
    if (mins > 0) return `${mins}m ago`;
    return "Just now";
  };

  const now = new Date();
  const greeting =
    now.getHours() < 12 ? "Good Morning" :
    now.getHours() < 17 ? "Good Afternoon" : "Good Evening";

  const STAT_CARDS = [
    {
      label: "Projects",
      value: stats?.projects ?? "—",
      icon: <FolderOpen size={20} />,
      iconBg: "bg-violet-500/15 border-violet-500/30",
      iconColor: "text-violet-400",
      glow: "rgba(124,58,237,0.15)",
      to: "/admin/projects",
    },
    {
      label: "Certificates",
      value: stats?.certificates ?? "—",
      icon: <Award size={20} />,
      iconBg: "bg-cyan-500/12 border-cyan-500/28",
      iconColor: "text-cyan-400",
      glow: "rgba(6,182,212,0.15)",
      to: "/admin/certificates",
    },
    {
      label: "Total Messages",
      value: stats?.messages ?? "—",
      icon: <MessageSquare size={20} />,
      iconBg: "bg-green-500/12 border-green-500/28",
      iconColor: "text-green-400",
      glow: "rgba(74,222,128,0.15)",
      to: "/admin/messages",
    },
    {
      label: "Unread Messages",
      value: stats?.unreadMessages ?? "—",
      icon: <MailWarning size={20} />,
      iconBg: "bg-pink-500/12 border-pink-500/28",
      iconColor: "text-pink-400",
      glow: "rgba(236,72,153,0.15)",
      to: "/admin/messages",
      highlight: (stats?.unreadMessages ?? 0) > 0,
    },
  ];

  const QUICK_ACTIONS = [
    {
      label: "Add Project",
      desc: "Create a new portfolio project",
      icon: <Plus size={16} />,
      cls: "bg-violet-500/15 border-violet-500/30 text-violet-400 hover:bg-violet-500/25",
      to: "/admin/projects",
    },
    {
      label: "Add Certificate",
      desc: "Add a new certification",
      icon: <Plus size={16} />,
      cls: "bg-cyan-500/12 border-cyan-500/28 text-cyan-400 hover:bg-cyan-500/22",
      to: "/admin/certificates",
    },
    {
      label: "View Messages",
      desc: "Check your inbox",
      icon: <Eye size={16} />,
      cls: "bg-pink-500/12 border-pink-500/28 text-pink-400 hover:bg-pink-500/22",
      to: "/admin/messages",
    },
    {
      label: "Change Password",
      desc: "Update admin credentials",
      icon: <Activity size={16} />,
      cls: "bg-amber-500/12 border-amber-500/28 text-amber-400 hover:bg-amber-500/22",
      to: "/admin/password",
    },
  ];

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
    <div>
      {/* Welcome header */}
      <motion.div {...fadeUp(0)} className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles size={18} className="text-violet-400" />
          <p className="text-[10px] font-semibold uppercase tracking-[2px] text-white/28">
            Dashboard Overview
          </p>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight mb-1">
          {greeting},{" "}
          <span className="bg-gradient-to-r from-violet-400 via-cyan-400 to-pink-400
            bg-clip-text text-transparent">
            Monish
          </span>
          {" "}👋
        </h1>
        <p className="text-sm text-white/40">
          {now.toLocaleDateString("en-IN", {
            weekday: "long", year: "numeric", month: "long", day: "numeric",
          })}
          {" · "}
          <span className="text-white/30">
            {now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
          </span>
        </p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {STAT_CARDS.map((card, i) => (
          <motion.div
            key={card.label}
            {...fadeUp(0.05 + i * 0.08)}
            whileHover={{ y: -6, boxShadow: `0 20px 50px ${card.glow}` }}
            onClick={() => navigate(card.to)}
            className={`glass-card p-6 cursor-pointer group transition-all duration-300
              ${card.highlight ? "ring-1 ring-pink-500/30" : ""}`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-11 h-11 rounded-[14px] flex items-center justify-center
                border ${card.iconBg} transition-transform group-hover:scale-110`}>
                <span className={card.iconColor}>{card.icon}</span>
              </div>
              {card.highlight && (
                <span className="flex items-center gap-1 px-2.5 py-1 rounded-full
                  bg-pink-500/15 border border-pink-500/25 text-pink-400
                  text-[9px] font-bold animate-pulse">
                  NEW
                </span>
              )}
            </div>
            <p className="text-3xl font-extrabold tracking-tight mb-1">{card.value}</p>
            <p className="text-xs text-white/40 font-medium">{card.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-5">

        {/* Recent Messages */}
        <motion.div {...fadeUp(0.3)} className="glass-card overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4
            border-b border-white/7">
            <div className="flex items-center gap-2.5">
              <Clock size={14} className="text-violet-400" />
              <p className="text-sm font-bold">Recent Messages</p>
            </div>
            <button
              onClick={() => navigate("/admin/messages")}
              className="flex items-center gap-1.5 text-[11px] font-semibold
                text-violet-400 hover:text-violet-300 transition-colors"
            >
              View All <ArrowRight size={12} />
            </button>
          </div>

          {recent.length === 0 ? (
            <div className="py-14 text-center">
              <MessageSquare size={28} className="text-white/15 mx-auto mb-3" />
              <p className="text-sm text-white/30">No messages yet</p>
              <p className="text-xs text-white/20 mt-1">
                Messages from visitors will appear here
              </p>
            </div>
          ) : (
            <div>
              {recent.map((m, i) => (
                <motion.div
                  key={m._id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35 + i * 0.06 }}
                  onClick={() => navigate("/admin/messages")}
                  className={`flex items-center gap-4 px-6 py-4 border-b border-white/5
                    hover:bg-white/3 transition-colors cursor-pointer
                    ${!m.read ? "bg-violet-500/4" : ""}`}
                >
                  {/* Avatar */}
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center
                    flex-shrink-0 text-xs font-bold
                    ${!m.read
                      ? "bg-gradient-to-br from-violet-600 to-cyan-500 text-white"
                      : "bg-white/8 text-white/40"
                    }`}>
                    {m.name?.[0]?.toUpperCase() ?? "?"}
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className={`text-sm font-semibold truncate
                        ${!m.read ? "text-white" : "text-white/60"}`}>
                        {m.name}
                      </p>
                      {!m.read && (
                        <span className="w-1.5 h-1.5 rounded-full bg-pink-500 flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-white/35 truncate mt-0.5">
                      <span className="text-white/50">{m.subject}</span>
                      {" — "}{m.message}
                    </p>
                  </div>

                  {/* Time */}
                  <span className="text-[10px] text-white/25 font-mono flex-shrink-0">
                    {timeAgo(m.createdAt)}
                  </span>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Quick Actions */}
        <motion.div {...fadeUp(0.35)} className="glass-card p-6">
          <div className="flex items-center gap-2.5 mb-5">
            <TrendingUp size={14} className="text-cyan-400" />
            <p className="text-sm font-bold">Quick Actions</p>
          </div>

          <div className="flex flex-col gap-3">
            {QUICK_ACTIONS.map((action, i) => (
              <motion.button
                key={action.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.07 }}
                whileHover={{ x: 4 }}
                onClick={() => navigate(action.to)}
                className={`flex items-center gap-4 p-4 rounded-[14px] border
                  transition-all text-left ${action.cls}`}
              >
                <div className="w-9 h-9 rounded-[12px] flex items-center justify-center
                  bg-white/5 border border-white/8 flex-shrink-0">
                  {action.icon}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold">{action.label}</p>
                  <p className="text-[11px] text-white/30 mt-0.5">{action.desc}</p>
                </div>
                <ArrowRight size={14} className="ml-auto opacity-40" />
              </motion.button>
            ))}
          </div>

          {/* Portfolio status */}
          <div className="mt-5 p-4 rounded-[14px] bg-green-500/7 border border-green-500/20">
            <div className="flex items-center gap-2.5">
              <motion.div
                className="w-2.5 h-2.5 rounded-full bg-green-400 flex-shrink-0"
                animate={{
                  boxShadow: [
                    "0 0 6px #4ade80",
                    "0 0 20px #4ade80",
                    "0 0 6px #4ade80",
                  ],
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <div>
                <p className="text-xs font-bold text-green-400">Portfolio Live</p>
                <p className="text-[10px] text-green-400/50 mt-0.5">
                  All systems operational
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminOverview;
