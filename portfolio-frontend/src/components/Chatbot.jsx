import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, RefreshCw, X, Download, ExternalLink, Zap, ChevronDown } from "lucide-react";
import { sendToGroq } from "../utils/geminiClient";

// ── Constants ─────────────────────────────────────────────────────
const RESUME_URL = "/Monishkumar_Resume.pdf";

const CATEGORIES = [
  {
    label: "Projects",
    icon: "🚀",
    questions: [
      {label: "SpareChange Project",   q: "Tell me about the SpareChange project" },
      {label: "Other Projects",        q: "What other projects has Monish built?" },
    ],
  },
  {
    label: "Background",
    icon: "🎓",
    questions: [
      {label: "Education",             q: "Where does Monish study?" },
      {label: "Achievements",          q: "What are Monish's achievements and certifications?" },
    ],
  },
  {
    label: "Skills",
    icon: "🛠️",
    questions: [
      {label: "Tech Stack",            q: "What tech stack does Monish use?" },
      {label: "Frontend Skills",       q: "What are Monish's frontend skills?" },
    ],
  },
  {
    label: "Connect",
    icon: "📬",
    questions: [
      {label: "Download Resume",       q: "How can I download Monish's resume?" },
      {label: "Contact Info",          q: "How can I contact Monish?" },
    ],
  },
];

const TOUR_STEPS = [
  "Tell me about Monish in one sentence.",
  "What projects has Monish built?",
  "What is his tech stack?",
  "What are his achievements?",
  "How can I contact Monish?",
];

const FOLLOW_UP_MAP = {
  project: ["🌐 Show other projects", "🛠️ What tech was used?", "📬 Contact Monish"],
  skill:   ["🚀 See his projects",    "📄 Download resume",      "📬 Get in touch"],
  resume:  ["📬 Contact Monish",      "🚀 See his projects",     "🎓 Learn about education"],
  default: ["🚀 See his projects",    "📄 Download resume",      "📬 Contact Monish"],
};

const RESUME_KEYWORDS = ["resume", "cv", "download", "pdf"];

// ── Helpers ───────────────────────────────────────────────────────
const getTime = () => {
  const d = new Date();
  return `${d.getHours()}:${String(d.getMinutes()).padStart(2, "0")}`;
};

const detectCategory = (text = "") => {
  const t = text.toLowerCase();
  if (t.includes("project") || t.includes("sparechange") || t.includes("built")) return "project";
  if (t.includes("skill") || t.includes("tech") || t.includes("stack") || t.includes("frontend")) return "skill";
  if (t.includes("resume") || t.includes("cv") || t.includes("download")) return "resume";
  return "default";
};

const isResumeQuery = (text = "") =>
  RESUME_KEYWORDS.some((k) => text.toLowerCase().includes(k));

// ── Sub-components ────────────────────────────────────────────────

// Glowing animated AI avatar
const AIAvatar = ({ size = "md" }) => {
  const dim = size === "sm" ? "w-7 h-7 text-sm" : "w-14 h-14 text-2xl";
  return (
    <div className={`relative flex-shrink-0 ${size === "sm" ? "" : "mb-4"}`}>
      <motion.div
        className={`${dim} rounded-full bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center relative z-10`}
        animate={{ boxShadow: ["0 0 10px rgba(124,58,237,0.4)", "0 0 30px rgba(124,58,237,0.7)", "0 0 10px rgba(124,58,237,0.4)"] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      >
        🤖
      </motion.div>
      {/* Pulse ring */}
      <motion.div
        className={`absolute inset-0 rounded-full border-2 border-violet-500/40`}
        animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeOut" }}
      />
    </div>
  );
};

// Typing indicator
const TypingDots = () => (
  <div className="flex items-center gap-1.5 px-4 py-3">
    {[0, 1, 2].map((i) => (
      <motion.div
        key={i}
        className="w-1.5 h-1.5 rounded-full bg-violet-400"
        animate={{ y: [0, -6, 0], opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 1.2, delay: i * 0.2, repeat: Infinity }}
      />
    ))}
  </div>
);

// Bold markdown renderer
const FormatText = ({ text }) => {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith("**") && p.endsWith("**") ? (
          <strong key={i} className="text-violet-300 font-semibold">{p.slice(2, -2)}</strong>
        ) : (
          <span key={i}>{p}</span>
        )
      )}
    </>
  );
};

// Streaming text renderer — reveals chars one by one
const StreamingText = ({ text, onDone }) => {
  const [displayed, setDisplayed] = useState("");
  const idx = useRef(0);

  useEffect(() => {
    idx.current = 0;
    setDisplayed("");
    const interval = setInterval(() => {
      idx.current += 3; // 3 chars per tick for snappy feel
      if (idx.current >= text.length) {
        setDisplayed(text);
        clearInterval(interval);
        onDone?.();
      } else {
        setDisplayed(text.slice(0, idx.current));
      }
    }, 12);
    return () => clearInterval(interval);
  }, [text]);

  return <FormatText text={displayed} />;
};

// Resume action card (shows inside chat when resume is requested)
const ResumeCard = () => (
  <motion.div
    initial={{ opacity: 0, y: 8, scale: 0.97 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    className="mt-3 flex gap-2"
  >
    <a
      href={RESUME_URL}
      download="Monishkumar_Resume.pdf"
      className="flex items-center gap-2 px-4 py-2.5 rounded-[12px] bg-violet-500/20 border border-violet-500/40 text-violet-300 text-xs font-semibold hover:bg-violet-500/30 transition-all"
    >
      <Download size={13} /> Download Resume
    </a>
    <a
      href={RESUME_URL}
      target="_blank"
      rel="noreferrer"
      className="flex items-center gap-2 px-4 py-2.5 rounded-[12px] bg-white/6 border border-white/12 text-white/60 text-xs font-semibold hover:bg-white/12 transition-all"
    >
      <ExternalLink size={13} /> View PDF
    </a>
  </motion.div>
);

// Chat bubble
const Bubble = ({ msg, isStreaming, onStreamDone }) => {
  const isUser = msg.role === "user";
  return (
    <motion.div
      initial={{ opacity: 0, y: 14, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`flex gap-2.5 items-end ${isUser ? "flex-row-reverse" : ""}`}
    >
      {isUser ? (
        <div className="w-7 h-7 rounded-full bg-white/12 border border-white/15 flex items-center justify-center text-sm flex-shrink-0 mb-1">
          👤
        </div>
      ) : (
        <AIAvatar size="sm" />
      )}

      <div className={`max-w-[78%] flex flex-col ${isUser ? "items-end" : "items-start"}`}>
        <div
          className={`px-4 py-3 text-[13px] leading-relaxed ${
            isUser
              ? "bg-gradient-to-br from-violet-500/40 to-cyan-500/30 border border-violet-500/35 rounded-[18px] rounded-br-[4px] text-white"
              : "bg-white/8 border border-white/10 rounded-[18px] rounded-bl-[4px] text-white/85"
          }`}
        >
          {isStreaming && !isUser ? (
            <StreamingText text={msg.text} onDone={onStreamDone} />
          ) : (
            <FormatText text={msg.text} />
          )}
          {/* Blinking cursor while streaming */}
          {isStreaming && !isUser && (
            <motion.span
              className="inline-block w-0.5 h-3.5 bg-violet-400 ml-0.5 align-middle"
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.6, repeat: Infinity }}
            />
          )}
        </div>

        {/* Resume card if applicable */}
        {!isUser && msg.showResume && !isStreaming && <ResumeCard />}

        <span className="text-[9px] text-white/20 font-mono mt-1 px-1">{msg.time}</span>
      </div>
    </motion.div>
  );
};

// Collapsible sidebar category
const CategoryGroup = ({ cat, onSend, disabled }) => {
  const [open, setOpen] = useState(true);
  return (
    <div>
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-1 py-1.5 text-[10px] font-bold uppercase tracking-[2px] text-white/28 hover:text-white/50 transition-colors"
      >
        <span className="flex items-center gap-1.5">
          <span>{cat.icon}</span> {cat.label}
        </span>
        <motion.span animate={{ rotate: open ? 0 : -90 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={11} />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden flex flex-col gap-1"
          >
            {cat.questions.map(({ icon, label, q }) => (
              <motion.button
                key={label}
                whileHover={{ x: 3, backgroundColor: "rgba(139,92,246,0.15)" }}
                whileTap={{ scale: 0.97 }}
                onClick={() => onSend(q)}
                disabled={disabled}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-[12px] text-xs font-medium bg-white/5 border border-white/9 text-white/50 hover:border-violet-500/30 hover:text-violet-300 transition-all text-left disabled:opacity-40"
              >
                <span className="text-sm flex-shrink-0">{icon}</span>
                {label}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ── Main Component ────────────────────────────────────────────────
export default function Chatbot() {
  const [messages,    setMessages]    = useState([]);
  const [input,       setInput]       = useState("");
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState(null);
  const [retryCount,  setRetryCount]  = useState(null);
  const [apiReady,    setApiReady]    = useState(false);
  const [streamingId, setStreamingId] = useState(null);   // id of the msg currently streaming
  const [followUps,   setFollowUps]   = useState([]);     // chips shown after AI reply
  const [tourStep,    setTourStep]    = useState(null);   // null = off, 0-4 = active

  const historyRef    = useRef([]);
  const bottomRef     = useRef(null);
  const isMounted     = useRef(false);
  const retryRef      = useRef(null);
  const lastQueryRef  = useRef("");
  const latencyRef    = useRef(0);
  const [latency,     setLatency]     = useState(null);

  // ── Init ──────────────────────────────────────────────────────
  useEffect(() => {
    const key = import.meta.env.VITE_GROQ_API_KEY;
    if (key && key.length > 10) setApiReady(true);
    else setError("Add VITE_GROQ_API_KEY to your .env — get a free key at console.groq.com");
  }, []);

  useEffect(() => {
  if (!isMounted.current) { 
    isMounted.current = true; 
    return; 
  }

  // Only scroll when a NEW message is added (not on loading state)
  if (messages.length > 0 && !loading) {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }
}, [messages]);

  useEffect(() => () => clearInterval(retryRef.current), []);

  // ── Tour logic ────────────────────────────────────────────────
  const startTour = () => {
    resetChat();
    setTourStep(0);
  };

  useEffect(() => {
    if (tourStep === null) return;
    if (tourStep >= TOUR_STEPS.length) { setTourStep(null); return; }
    const timer = setTimeout(() => sendMessage(TOUR_STEPS[tourStep], true), tourStep === 0 ? 300 : 800);
    return () => clearTimeout(timer);
  }, [tourStep]);

  // ── Core send ─────────────────────────────────────────────────
  const sendMessage = useCallback(async (text, fromTour = false) => {
    const q = (text || input).trim();
    if (!q || loading || !apiReady) return;

    setInput("");
    setError(null);
    setRetryCount(null);
    setFollowUps([]);
    clearInterval(retryRef.current);

    const userMsg = { role: "user", content: q };
    historyRef.current = [...historyRef.current, userMsg];

    const msgId = Date.now();
    setMessages((p) => [...p, { id: msgId, role: "user", text: q, time: getTime() }]);
    setLoading(true);
    latencyRef.current = Date.now();

    try {
      const reply = await sendToGroq(historyRef.current);
      const ms    = Date.now() - latencyRef.current;
      setLatency(ms);

      historyRef.current = [...historyRef.current, { role: "assistant", content: reply }];

      const aiId = msgId + 1;
      setMessages((p) => [
        ...p,
        {
          id:          aiId,
          role:        "ai",
          text:        reply,
          time:        getTime(),
          showResume:  isResumeQuery(q),
        },
      ]);
      setStreamingId(aiId);

      // Queue follow-up chips (shown after streaming ends)
      const cat = detectCategory(q + " " + reply);
      setFollowUps(FOLLOW_UP_MAP[cat] ?? FOLLOW_UP_MAP.default);

      // Advance tour after streaming (handled via onStreamDone)
      if (fromTour) {
        // tour advancement handled in onStreamDone
      }
    } catch (err) {
      historyRef.current = historyRef.current.slice(0, -1);
      setTourStep(null); // abort tour on error

      const status = err?.status;
      const msg    = err?.message || "";

      if (status === 429) {
        const isDaily = msg.includes("Day") || msg.includes("daily") || msg.includes("limit: 0");
        if (isDaily) {
          setError("Daily quota exhausted. Get a new free key at console.groq.com/keys");
        } else {
          const match = msg.match(/try again in ([\d.]+)s/i) || msg.match(/retry in (\d+)/i);
          const secs  = match ? Math.ceil(parseFloat(match[1])) + 1 : 30;
          lastQueryRef.current = q;
          setRetryCount(secs);
          retryRef.current = setInterval(() => {
            setRetryCount((prev) => {
              if (prev <= 1) {
                clearInterval(retryRef.current);
                setRetryCount(null);
                sendMessage(lastQueryRef.current);
                return null;
              }
              return prev - 1;
            });
          }, 1000);
        }
      } else if (status === 401 || msg.includes("GROQ_KEY_MISSING") || msg.includes("Invalid API Key")) {
        setError("Invalid API key. Get your free key at console.groq.com/keys");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }, [input, loading, apiReady]);

  const handleStreamDone = useCallback((msgId) => {
    setStreamingId(null);
    // If in tour mode, advance
    setTourStep((prev) => {
      if (prev === null) return null;
      return prev + 1;
    });
  }, []);

  const resetChat = () => {
    setMessages([]);
    setError(null);
    setRetryCount(null);
    setFollowUps([]);
    setStreamingId(null);
    setTourStep(null);
    clearInterval(retryRef.current);
    historyRef.current = [];
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const dismissError = () => {
    clearInterval(retryRef.current);
    setRetryCount(null);
    setError(null);
  };

  const handleFollowUp = (chip) => {
    // Strip leading emoji
    const clean = chip.replace(/^[\p{Emoji}\s]+/u, "").trim();
    if (clean.toLowerCase().includes("download resume")) {
      // trigger download without a message
      const a = document.createElement("a");
      a.href = RESUME_URL;
      a.download = "Monishkumar_Resume.pdf";
      a.click();
      return;
    }
    sendMessage(clean);
  };

  return (
    <div className="min-h-screen py-24 px-6 flex items-center">
      <div className="max-w-5xl mx-auto w-full">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <p className="text-[11px] font-semibold uppercase tracking-[3px] text-violet-400 mb-3">
            04 — Assistant
          </p>
          <h2 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-4">
            Chat with{" "}
            <span className="bg-gradient-to-r from-violet-400 via-cyan-400 to-pink-400 bg-clip-text text-transparent">
              my AI
            </span>
          </h2>
          <p className="text-sm text-white/40 max-w-md mx-auto leading-relaxed">
            Your personal AI guide to explore Monish's work and experience.{" "}
            <span className="text-violet-300 font-semibold">Powered by Groq · Llama 3.1</span>
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-5 items-stretch">
          {/* ══ Sidebar ══ */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-4"
          >
            <div className="glass-card p-6">
              {/* Glowing avatar */}
              <AIAvatar />

              <h3 className="text-[15px] font-bold mb-0.5">Monish AI Assistant</h3>
              <p className="text-[11px] text-white/35 leading-relaxed mb-4">
                Trained on Monish's projects,<br/>skills &amp; experience
              </p>

              {/* Status badge */}
              <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-[10px] font-semibold mb-3 ${
                apiReady
                  ? "bg-green-500/10 border-green-500/25 text-green-400"
                  : "bg-red-500/10 border-red-500/25 text-red-400"
              }`}>
                <motion.div
                  className={`w-1.5 h-1.5 rounded-full ${apiReady ? "bg-green-400" : "bg-red-400"}`}
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                {apiReady ? "Online · Ready" : "No API Key"}
              </div>

              {/* Latency indicator */}
              {latency && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-1.5 mb-4"
                >
                  <Zap size={10} className="text-cyan-400" />
                  <span className="text-[10px] text-cyan-400/70 font-mono">
                    {latency < 1000 ? `${latency}ms` : `${(latency / 1000).toFixed(1)}s`} last response
                  </span>
                </motion.div>
              )}

              <div className="h-px bg-white/7 mb-4" />

              {/* Tour button */}
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={startTour}
                disabled={loading}
                className="w-full mb-4 py-2.5 px-4 rounded-[12px] text-xs font-bold bg-gradient-to-r from-violet-600/30 to-cyan-500/20 border border-violet-500/35 text-violet-300 hover:from-violet-600/45 hover:to-cyan-500/35 transition-all flex items-center justify-center gap-2 disabled:opacity-40"
              >
                🚀 Start Guided Tour
              </motion.button>

              {/* Quick questions by category */}
              <div className="flex flex-col gap-3">
                {CATEGORIES.map((cat) => (
                  <CategoryGroup
                    key={cat.label}
                    cat={cat}
                    onSend={(q) => sendMessage(q)}
                    disabled={loading || !apiReady}
                  />
                ))}
              </div>
            </div>

            {/* Powered by card */}
            <div className="glass-card p-4">
              <p className="text-[10px] font-semibold uppercase tracking-[2px] text-white/28 mb-1">
                Powered by
              </p>
              <p className="text-[12px] font-bold text-white/60">
                Groq <span className="text-white/25 font-normal">·</span> LLaMA 3.1 8B
              </p>
              <p className="text-[10px] text-white/25 mt-1">
                Fast inference · Multi-turn memory
              </p>
            </div>
          </motion.div>

          {/* ══ Chat Window ══ */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="glass-card overflow-hidden flex flex-col h-full"
          >
            {/* Chat header */}
            <div className="flex items-center gap-3 px-6 py-4 border-b border-white/8 bg-violet-500/5 flex-shrink-0">
              <div className="relative flex-shrink-0">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center text-base">
                  🤖
                </div>
                <motion.div
                  className="absolute inset-0 rounded-full border border-violet-400/30"
                  animate={{ scale: [1, 1.35, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold truncate">Monish AI Assistant</p>
                <p className="text-[11px] text-white/40 flex items-center gap-1.5 mt-0.5">
                  <motion.span
                    className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block flex-shrink-0"
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                  Groq AI · Llama 3.1 · Always online
                </p>
              </div>

              {/* Tour progress */}
              {tourStep !== null && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-1.5 mr-2"
                >
                  {TOUR_STEPS.map((_, i) => (
                    <div
                      key={i}
                      className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
                        i < tourStep ? "bg-violet-400" : i === tourStep ? "bg-cyan-400" : "bg-white/15"
                      }`}
                    />
                  ))}
                </motion.div>
              )}

              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={resetChat}
                title="Clear chat"
                className="w-8 h-8 rounded-full bg-white/6 border border-white/10 flex items-center justify-center text-white/50 hover:bg-white/12 hover:text-white transition-all flex-shrink-0"
              >
                <RefreshCw size={13} />
              </motion.button>
            </div>

            {/* Messages area */}
            <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4">

              {/* Welcome state */}
              {messages.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-5 rounded-[18px] bg-violet-500/8 border border-violet-500/15"
                >
                  <p className="text-sm font-bold text-violet-300 mb-2">👋 Hey there!</p>
                  <p className="text-xs text-white/45 leading-relaxed mb-4">
                    I'm Monish's AI assistant — ask me anything about his projects, skills,
                    achievements, or experience. Or hit{" "}
                    <span className="text-violet-300 font-semibold">Start Guided Tour</span> for
                    a curated walkthrough!
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {["🚀 Projects", "🎓 Education", "💼 Skills", "📄 Resume"].map((s) => (
                      <button
                        key={s}
                        onClick={() => sendMessage(s.replace(/^[\p{Emoji}\s]+/u, "").trim())}
                        className="px-3 py-1.5 rounded-full text-[11px] bg-violet-500/12 border border-violet-500/25 text-violet-300 hover:bg-violet-500/25 transition-all"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Messages */}
              {messages.map((msg) => (
                <Bubble
                  key={msg.id}
                  msg={msg}
                  isStreaming={msg.id === streamingId}
                  onStreamDone={() => handleStreamDone(msg.id)}
                />
              ))}

              {/* Typing indicator */}
              {loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-end gap-2.5"
                >
                  <AIAvatar size="sm" />
                  <div className="bg-white/8 border border-white/10 rounded-[18px] rounded-bl-[4px]">
                    <TypingDots />
                  </div>
                </motion.div>
              )}

              {/* Follow-up chips — shown after streaming completes */}
              <AnimatePresence>
                {followUps.length > 0 && !loading && streamingId === null && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-wrap gap-2 pl-9"
                  >
                    <p className="w-full text-[10px] text-white/25 mb-1 font-medium">👉 You might also ask:</p>
                    {followUps.map((chip) => (
                      <motion.button
                        key={chip}
                        whileHover={{ scale: 1.04, y: -1 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={() => handleFollowUp(chip)}
                        className="px-3 py-1.5 rounded-full text-[11px] bg-white/6 border border-white/12 text-white/50 hover:bg-violet-500/15 hover:border-violet-500/30 hover:text-violet-300 transition-all"
                      >
                        {chip}
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Error / retry banner */}
              {(error || retryCount !== null) && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-2 px-4 py-3 rounded-[14px] bg-red-500/10 border border-red-500/25 text-red-400 text-xs"
                >
                  <span className="flex-shrink-0 mt-0.5">⚠️</span>
                  <span className="flex-1 leading-relaxed">
                    {retryCount !== null
                      ? `Rate limited — auto-retrying in ${retryCount}s…`
                      : error}
                  </span>
                  <button onClick={dismissError} className="flex-shrink-0 ml-1 mt-0.5 hover:text-red-300 transition-colors">
                    <X size={12} />
                  </button>
                </motion.div>
              )}

              <div ref={bottomRef} />
            </div>

            {/* Input bar */}
            <div className="flex items-center gap-2.5 p-4 border-t border-white/8 bg-black/10 flex-shrink-0">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder={
                  apiReady
                    ? "Ask about projects, skills, or experience…"
                    : "Add VITE_GROQ_API_KEY to .env…"
                }
                disabled={loading || !apiReady}
                className="flex-1 bg-white/7 border border-white/10 rounded-full px-5 py-2.5 text-[13px] text-white placeholder-white/22 outline-none focus:border-violet-500/50 focus:bg-violet-500/8 focus:shadow-[0_0_0_3px_rgba(124,58,237,0.12)] transition-all disabled:opacity-50"
              />
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.94 }}
                onClick={() => sendMessage()}
                disabled={loading || !input.trim() || !apiReady}
                className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center text-white shadow-[0_4px_20px_rgba(124,58,237,0.4)] disabled:opacity-40 disabled:cursor-not-allowed transition-all flex-shrink-0"
              >
                <Send size={15} />
              </motion.button>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}