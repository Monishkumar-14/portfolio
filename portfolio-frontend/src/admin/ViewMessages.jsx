import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Eye, Mail, CheckCheck, MessageSquare } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { Modal, PageHeader, Pill, Spinner, timeAgo } from "./AdminUI";
import "./Admin.css";

const RowActions = ({ m, onView, onDelete }) => (
  <div className="adm-actions" onClick={(e) => e.stopPropagation()}>
    <button type="button" onClick={() => onView(m)} aria-label={`View message from ${who(m)}`} className="adm-iconbtn adm-iconbtn--blue"><Eye size={14}/></button>
    <button type="button" onClick={() => onDelete(m._id)} aria-label={`Delete message from ${who(m)}`} className="adm-iconbtn adm-iconbtn--danger"><Trash2 size={14}/></button>
  </div>
);

const who = (m) => m.name?.trim() || "Anonymous";

const COLS = "150px 190px minmax(0, 1fr) 90px 84px";

const ViewMessages = () => {
  const { token }    = useAuth();
  const [messages,   setMessages]   = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [selected,   setSelected]   = useState(null);
  const [filter,     setFilter]     = useState("all");

  const authHeader = { headers: { Authorization: `Bearer ${token}` } };

  const fetchMessages = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/messages`, authHeader);
      setMessages(data.messages || data);
    } catch {
      toast.error("Failed to fetch messages.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMessages(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const markRead = async (id) => {
    try {
      await axios.patch(`${import.meta.env.VITE_API_URL}/api/messages/${id}/read`, {}, authHeader);
      setMessages((prev) => prev.map((m) => (m._id === id ? { ...m, read: true } : m)));
    } catch { /* non-critical */ }
  };

  const deleteMsg = async (id) => {
    if (!window.confirm("Delete this message?")) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/messages/${id}`, authHeader);
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

  const filtered = messages.filter((m) => (filter === "unread" ? !m.read : filter === "read" ? m.read : true));
  const unreadCount = messages.filter((m) => !m.read).length;

  // Selected message, kept in sync with the list (e.g. after it is marked read)
  const current = selected ? messages.find((m) => m._id === selected._id) || selected : null;

  return (
    <div>
      <PageHeader
        eyebrow="Inbox" icon={MessageSquare} title="Messages Inbox"
        sub={<>{messages.length} total · <span style={{ color: "var(--accent)", fontWeight: 600 }}>{unreadCount} unread</span></>}
        action={
          <div className="adm-tabs" role="group" aria-label="Filter messages">
            {[{ key: "all", label: "All" }, { key: "unread", label: "Unread" }, { key: "read", label: "Read" }].map(({ key, label }) => (
              <button key={key} type="button" className="adm-tab" aria-pressed={filter === key} onClick={() => setFilter(key)}>
                {label}{key === "unread" && unreadCount > 0 && <span className="adm-count">{unreadCount}</span>}
              </button>
            ))}
          </div>
        }
      />

      {loading ? (
        <div className="adm-load"><Spinner size={28}/></div>
      ) : filtered.length === 0 ? (
        <div className="adm-card adm-empty"><MessageSquare size={28} aria-hidden="true"/>No messages in this category.</div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="adm-card adm-table" style={{ "--cols": COLS }}>
            <div className="adm-row adm-row--head"><span>From</span><span>Email</span><span>Message</span><span>Time</span><span>Actions</span></div>
            <AnimatePresence>
              {filtered.map((m) => (
                <motion.div key={m._id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -16 }}
                  role="button" tabIndex={0} aria-label={`Open message from ${who(m)}`}
                  onClick={() => openMessage(m)}
                  onKeyDown={(e) => { if (e.target === e.currentTarget && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); openMessage(m); } }}
                  className={`adm-row adm-row--click${!m.read ? " adm-row--unread" : ""}`}>
                  <div style={{ minWidth: 0 }}>
                    <p className="adm-row__t adm-trunc" style={{ color: m.read ? "#aeb3ba" : "#fff" }}>{who(m)}</p>
                    {!m.read && <span style={{ display: "inline-block", marginTop: 6 }}><Pill tone="orange">Unread</Pill></span>}
                  </div>
                  <p className="adm-row__s adm-trunc" style={{ margin: 0 }}>{m.email}</p>
                  <p className="adm-row__s adm-trunc" style={{ margin: 0, color: "#aeb3ba" }}><span style={{ color: "#d4d4d4" }}>{m.subject} — </span>{m.message}</p>
                  <span className="adm-time">{timeAgo(m.createdAt)}</span>
                  <RowActions m={m} onView={openMessage} onDelete={deleteMsg} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Mobile cards */}
          <div className="adm-cards">
            {filtered.map((m) => (
              <div key={m._id} role="button" tabIndex={0} aria-label={`Open message from ${who(m)}`} onClick={() => openMessage(m)}
                onKeyDown={(e) => { if (e.target === e.currentTarget && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); openMessage(m); } }}
                className={`adm-card adm-cardrow${!m.read ? " adm-cardrow--unread" : ""}`} style={{ cursor: "pointer" }}>
                <div className="adm-cardrow__top">
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <p className="adm-row__t adm-trunc" style={{ color: m.read ? "#aeb3ba" : "#fff" }}>{who(m)} {!m.read && <Pill tone="orange">NEW</Pill>}</p>
                    <p className="adm-row__s adm-trunc">{m.email}</p>
                  </div>
                  <span className="adm-time">{timeAgo(m.createdAt)}</span>
                </div>
                <p className="adm-row__s" style={{ margin: "0 0 12px", color: "#aeb3ba" }}>
                  <strong style={{ color: "#d4d4d4" }}>{m.subject}</strong> — {m.message?.length > 80 ? `${m.message.slice(0, 80)}…` : m.message}
                </p>
                <RowActions m={m} onView={openMessage} onDelete={deleteMsg} />
              </div>
            ))}
          </div>
        </>
      )}

      <AnimatePresence>
        {current && (
          <Modal
            title={current.subject || "Message"} subtitle={`Received ${new Date(current.createdAt).toLocaleString()}`}
            onClose={() => setSelected(null)} width={560}
            footer={<>
              <button type="button" onClick={() => deleteMsg(current._id)} className="adm-btn adm-btn--danger" aria-label="Delete message"><Trash2 size={14} aria-hidden="true"/> Delete</button>
              <a href={`mailto:${current.email}?subject=${encodeURIComponent(`Re: ${current.subject || ""}`)}`} className="adm-btn adm-btn--primary"><Mail size={14} aria-hidden="true"/> REPLY VIA EMAIL</a>
            </>}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18, flexWrap: "wrap" }}>
              <span className="adm-avatar adm-avatar--md" aria-hidden="true">{current.name?.[0]?.toUpperCase() ?? "?"}</span>
              <div style={{ minWidth: 0, flex: 1 }}>
                <p style={{ margin: 0, font: "700 15px/1.3 var(--sans)" }}>{who(current)}</p>
                <p className="adm-trunc" style={{ margin: "3px 0 0", font: "400 12px/1.2 var(--mono)", color: "var(--blue)" }}>{current.email}</p>
              </div>
              <Pill tone="green"><CheckCheck size={11} aria-hidden="true"/> Read</Pill>
            </div>
            <div className="adm-meta" style={{ marginBottom: 14 }}><small>Subject</small><p>{current.subject}</p></div>
            <div className="adm-msgbox">{current.message}</div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ViewMessages;