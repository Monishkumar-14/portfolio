import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Eye, Mail, X, CheckCheck } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

const ViewMessages = () => {
  const { token }    = useAuth();
  const [messages,   setMessages]   = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [selected,   setSelected]   = useState(null);
  const [filter,     setFilter]     = useState("all");

  const authHeader = { headers: { Authorization: `Bearer ${token}` } };

  const fetchMessages = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/messages`,
        authHeader
      );
      setMessages(data.messages || data);
    } catch {
      toast.error("Failed to fetch messages.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMessages(); }, []);

  const markRead = async (id) => {
    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/messages/${id}/read`,
        {},
        authHeader
      );
      setMessages((prev) =>
        prev.map((m) => m._id === id ? { ...m, read: true } : m)
      );
    } catch {}
  };

  const deleteMsg = async (id) => {
    if (!window.confirm("Delete this message?")) return;
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/messages/${id}`,
        authHeader
      );
      toast.success("Message deleted.");
      setMessages((prev) => prev.filter((m) => m._id !== id));
      if (selected?._id === id) setSelected(null);
    } catch {
      toast.error("Delete failed.");
    }
  };

  const openMessage = (msg) => {
    setSelected(msg);
    if (!msg.read) markRead(msg._id);
  };

  const timeAgo = (date) => {
    const diff = Date.now() - new Date(date).getTime();
    const h = Math.floor(diff / 3.6e6);
    const d = Math.floor(h / 24);
    if (d > 0) return `${d}d ago`;
    if (h > 0) return `${h}h ago`;
    return "Just now";
  };

  const filtered = messages.filter((m) => {
    if (filter === "unread") return !m.read;
    if (filter === "read")   return m.read;
    return true;
  });

  const unreadCount = messages.filter((m) => !m.read).length;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">
            Messages Inbox
          </h1>
          <p className="text-xs text-white/35 mt-1">
            {messages.length} total ·{" "}
            <span className="text-pink-400 font-semibold">
              {unreadCount} unread
            </span>
          </p>
        </div>
        {/* Filter tabs */}
        <div className="flex gap-1.5 p-1 rounded-[12px]
          bg-white/4 border border-white/8">
          {[
            { key: "all",    label: "All"    },
            { key: "unread", label: "Unread" },
            { key: "read",   label: "Read"   },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-4 py-1.5 rounded-[9px] text-xs font-semibold
                transition-all
                ${filter === key
                  ? "bg-violet-500/20 text-violet-300"
                  : "text-white/40 hover:text-white/70"
                }`}
            >
              {label}
              {key === "unread" && unreadCount > 0 && (
                <span className="ml-1.5 px-1.5 py-0.5 rounded-full
                  bg-pink-500/30 text-pink-400 text-[9px]">
                  {unreadCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Message list */}
      {loading ? (
        <div className="text-center py-20 text-white/30 text-sm">
          Loading messages...
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-white/30 text-sm">
          No messages in this category.
        </div>
      ) : (
        <div className="glass-card overflow-hidden">
          {/* Head */}
          <div className="grid px-5 py-3 border-b border-white/7
            text-[10px] font-semibold uppercase tracking-[1.5px]
            text-white/28"
            style={{ gridTemplateColumns: "140px 160px 1fr 90px 80px" }}>
            <span>From</span>
            <span>Email</span>
            <span>Message</span>
            <span>Time</span>
            <span>Actions</span>
          </div>

          <AnimatePresence>
            {filtered.map((m, i) => (
              <motion.div
                key={m._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1,  y: 0  }}
                exit={{ opacity: 0,      x: -20 }}
                transition={{ delay: i * 0.04 }}
                onClick={() => openMessage(m)}
                className={`grid px-5 py-4 border-b border-white/5
                  hover:bg-white/3 transition-colors items-center cursor-pointer
                  ${!m.read ? "bg-violet-500/4" : ""}`}
                style={{ gridTemplateColumns: "140px 160px 1fr 90px 80px" }}
              >
                {/* Name */}
                <div>
                  <p className={`text-sm font-bold
                    ${!m.read ? "text-white" : "text-white/65"}`}>
                    {m.name}
                  </p>
                  {!m.read && (
                    <span className="inline-flex items-center gap-1 mt-1
                      px-2 py-0.5 rounded-full text-[9px] font-semibold
                      bg-pink-500/15 border border-pink-500/25 text-pink-400">
                      Unread
                    </span>
                  )}
                </div>

                {/* Email */}
                <p className="text-[11px] text-white/40 truncate">{m.email}</p>

                {/* Preview */}
                <p className="text-xs text-white/45 truncate pr-4">
                  <span className="text-white/55">{m.subject} — </span>
                  {m.message}
                </p>

                {/* Time */}
                <p className="text-[11px] text-white/30 font-mono">
                  {timeAgo(m.createdAt)}
                </p>

                {/* Actions */}
                <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => openMessage(m)}
                    className="w-7 h-7 rounded-[8px] bg-cyan-500/10
                      border border-cyan-500/22 flex items-center
                      justify-center text-cyan-400
                      hover:bg-cyan-500/20 transition-all">
                    <Eye size={12}/>
                  </button>
                  <button
                    onClick={() => deleteMsg(m._id)}
                    className="w-7 h-7 rounded-[8px] bg-red-500/10
                      border border-red-500/22 flex items-center
                      justify-center text-red-400
                      hover:bg-red-500/20 transition-all">
                    <Trash2 size={12}/>
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Message Detail Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}
            onClick={(e) => e.target === e.currentTarget && setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1,    y: 0  }}
              exit={{ scale: 0.95,    y: 20 }}
              className="w-full max-w-lg glass-card p-8 relative"
            >
              {/* Close */}
              <button
                onClick={() => setSelected(null)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full
                  bg-white/8 border border-white/12 flex items-center
                  justify-center text-white/50 hover:text-white
                  hover:bg-white/15 transition-all">
                <X size={14}/>
              </button>

              {/* Sender info */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br
                  from-violet-600 to-cyan-500 flex items-center justify-center
                  text-lg font-bold flex-shrink-0">
                  {selected.name[0].toUpperCase()}
                </div>
                <div>
                  <p className="text-base font-bold">{selected.name}</p>
                  <p className="text-xs text-violet-300 mt-0.5">{selected.email}</p>
                </div>
                <div className="ml-auto flex items-center gap-1.5 px-3 py-1.5
                  rounded-full bg-green-500/10 border border-green-500/25
                  text-green-400 text-[10px] font-semibold">
                  <CheckCheck size={11}/> Read
                </div>
              </div>

              {/* Subject */}
              <div className="mb-4 p-3 rounded-[12px] bg-white/5
                border border-white/9">
                <p className="text-[10px] text-white/28 uppercase
                  tracking-[1px] mb-1">
                  Subject
                </p>
                <p className="text-sm font-semibold">{selected.subject}</p>
              </div>

              {/* Message body */}
              <div className="p-4 rounded-[14px] bg-white/4 border border-white/8
                mb-6">
                <p className="text-sm text-white/65 leading-relaxed">
                  {selected.message}
                </p>
              </div>

              {/* Time */}
              <p className="text-[11px] text-white/25 mb-5">
                Received: {new Date(selected.createdAt).toLocaleString()}
              </p>

              {/* Actions */}
              <div className="flex gap-3">
                <a
                  href={`mailto:${selected.email}?subject=Re: ${selected.subject}`}
                  className="flex-1 flex items-center justify-center gap-2
                    py-2.5 rounded-[12px] text-sm font-semibold
                    btn-primary-glass"
                >
                  <Mail size={14}/> Reply via Email
                </a>
                <button
                  onClick={() => deleteMsg(selected._id)}
                  className="px-5 py-2.5 rounded-[12px] text-sm font-semibold
                    bg-red-500/10 border border-red-500/22 text-red-400
                    hover:bg-red-500/20 transition-all"
                >
                  <Trash2 size={14}/>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ViewMessages;