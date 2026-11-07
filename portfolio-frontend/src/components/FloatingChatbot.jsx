import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence, MotionConfig } from "framer-motion";
import {
  Send, RefreshCw, X, Minus, Download, ExternalLink, Bot, User, Mail, Pencil, Check,
  AlertCircle, ArrowRight, Loader2,
} from "lucide-react";
import { sendToGroq } from "../utils/geminiClient";
import "./FloatingChatbot.css";
import { submitContactMessage, contactErrorDetail, MAX_MESSAGE_LENGTH, SUBJECT_SUGGESTIONS } from "../utils/contactApi";
import { flowReducer, initialFlow, FIELD_OF, isCollecting, isFlowActive, hasData } from "../utils/contactFlow";

const RESUME_URL = "/Monishkumar_Resume.pdf";

const STARTERS = [
  "Explore my projects",
  "Ask about my technical skills",
  "Tell me about my AstraZeneca internship",
  "Show my certifications",
  "Ask about my education",
];

const DM_LABEL = "Send Monish a direct message right now";

// Bot copy for each contact-flow step.
const PROMPTS = {
  collecting_name: "First, what's your name?",
  collecting_email: "Nice to meet you! What's your email address?",
  collecting_subject: "What would you like to contact Monish about?",
  collecting_message: "Great! Now tell me what you'd like to discuss.",
  review: "Here's your message summary. Please check the details before sending.",
};
const FIELD_CFG = {
  collecting_name: { field: "name", label: "name", placeholder: "Enter your name...", type: "text", autoComplete: "name", maxLength: 80 },
  collecting_email: { field: "email", label: "email address", placeholder: "Enter your email address...", type: "email", autoComplete: "email", maxLength: 254 },
  collecting_subject: { field: "subject", label: "subject", placeholder: "Enter your subject...", type: "text", autoComplete: "off", maxLength: 120 },
  collecting_message: { field: "message", label: "message", placeholder: "Type your message...", type: "text", autoComplete: "off", maxLength: MAX_MESSAGE_LENGTH },
};
const STEP_NUMBER = { collecting_name: 1, collecting_email: 2, collecting_subject: 3, collecting_message: 4 };
const EDIT_FIELDS = [["name", "Name"], ["email", "Email"], ["subject", "Subject"], ["message", "Message"]];

const RESUME_KEYWORDS = ["resume", "cv", "download", "pdf"];

const getTime = () => {
  const d = new Date();
  return `${d.getHours()}:${String(d.getMinutes()).padStart(2, "0")}`;
};

const isResumeQuery = (text = "") =>
  RESUME_KEYWORDS.some((k) => text.toLowerCase().includes(k));

// Mini-markdown renderer
const FormatText = ({ text }) => {
  const lines = text.split("\n");
  return (
    <div className="flex flex-col gap-0.5">
      {lines.map((line, li) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={li} className="h-1.5" />;
        const bulletMatch = trimmed.match(/^[-•*]\s+(.*)/);
        if (bulletMatch) {
          return (
            <div key={li} className="flex gap-2 items-start pl-1">
              <span className="mt-[2px] flex-shrink-0 text-[10px]" style={{ color: "var(--primary-accent)" }}>●</span>
              <span>{renderBold(bulletMatch[1])}</span>
            </div>
          );
        }
        const numMatch = trimmed.match(/^(\d+)[.)]\s+(.*)/);
        if (numMatch) {
          return (
            <div key={li} className="flex gap-2 items-start pl-1">
              <span className="font-bold flex-shrink-0 text-[11px] min-w-[16px]" style={{ color: "var(--tech-blue)" }}>{numMatch[1]}.</span>
              <span>{renderBold(numMatch[2])}</span>
            </div>
          );
        }
        return <p key={li}>{renderBold(trimmed)}</p>;
      })}
    </div>
  );
};

const renderBold = (text) => {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((p, i) =>
    p.startsWith("**") && p.endsWith("**") ? (
      <strong key={i} className="font-semibold" style={{ color: "var(--primary-accent)" }}>{p.slice(2, -2)}</strong>
    ) : (
      <span key={i}>{p}</span>
    )
  );
};

// Streaming text renderer
const StreamingText = ({ text, onDone }) => {
  const [displayed, setDisplayed] = useState("");
  const idx = useRef(0);

  useEffect(() => {
    idx.current = 0;
    setDisplayed("");
    const interval = setInterval(() => {
      idx.current += 3;
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

const Bubble = ({ msg, isStreaming, onStreamDone, children }) => {
  const isUser = msg.role === "user";
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`flex gap-2 items-end ${isUser ? "flex-row-reverse" : ""}`}
    >
      {isUser ? (
        <div className="w-6 h-6 rounded-md flex items-center justify-center text-sm flex-shrink-0 mb-1"
          style={{ background: "var(--badge-bg)", border: "1px solid var(--badge-border)" }}>
          <User size={12} />
        </div>
      ) : (
        <div className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 mb-1"
          style={{ background: "rgba(255,107,53,0.15)", border: "1px solid rgba(255,107,53,0.25)" }}>
          <Bot size={12} style={{ color: "var(--primary-accent)" }} />
        </div>
      )}

      <div className={`max-w-[82%] flex flex-col ${isUser ? "items-end" : "items-start"}`}>
        <div
          className={`px-3 py-2 text-[12px] leading-relaxed rounded-lg ${
            isUser
              ? "chatbot-user-bubble rounded-br-sm"
              : "chatbot-bot-bubble rounded-bl-sm"
          }`}
        >
          {isStreaming && !isUser ? (
            <StreamingText text={msg.text} onDone={onStreamDone} />
          ) : msg.raw ? (
            <p className="whitespace-pre-wrap break-words">{msg.text}</p>
          ) : (
            <FormatText text={msg.text} />
          )}
          {isStreaming && !isUser && (
            <motion.span
              className="inline-block w-0.5 h-3 ml-0.5 align-middle"
              style={{ background: "var(--primary-accent)" }}
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.6, repeat: Infinity }}
            />
          )}
        </div>

        {!isUser && msg.showResume && !isStreaming && (
          <div className="mt-2 flex gap-2">
            <a href={RESUME_URL} download="Monishkumar_Resume.pdf"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[10px] font-mono font-semibold transition-all"
              style={{ background: "rgba(255,107,53,0.15)", border: "1px solid rgba(255,107,53,0.25)", color: "var(--primary-accent)" }}>
              <Download size={11} /> Download
            </a>
            <a href={RESUME_URL} target="_blank" rel="noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[10px] font-mono font-semibold transition-all"
              style={{ background: "var(--badge-bg)", border: "1px solid var(--badge-border)", color: "var(--text-muted)" }}>
              <ExternalLink size={11} /> View PDF
            </a>
          </div>
        )}

        {children}

        <span className="text-[8px] font-mono mt-0.5 px-1" style={{ color: "var(--text-ultra-faint)" }}>{msg.time}</span>
      </div>
    </motion.div>
  );
};

/* ── Contact-flow cards (rendered inside a Bubble) ── */
const flowBtn = (primary) => ({
  background: primary ? "var(--primary-accent)" : "var(--badge-bg)",
  border: `1px solid ${primary ? "var(--primary-accent)" : "var(--badge-border)"}`,
  color: primary ? "#FFFFFF" : "var(--text-secondary)",
});
const FLOW_BTN_CLASS =
  "flex items-center justify-center gap-1.5 px-3 py-2 min-h-[36px] rounded-md text-[11px] font-mono font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary-accent)]";

const ReviewCard = ({ data, active, onEdit, onSend }) => (
  <div className="mt-2 w-full rounded-lg overflow-hidden" style={{ background: "var(--bg-surface)", border: "1px solid rgba(255,107,53,0.3)" }}>
    <dl className="p-3 flex flex-col gap-2 text-[11px] font-mono">
      {[["Name", data.name], ["Email", data.email], ["Subject", data.subject], ["Message", data.message]].map(([k, v]) => (
        <div key={k}>
          <dt className="text-[9px] uppercase tracking-widest mb-0.5" style={{ color: "var(--text-faint)" }}>{k}</dt>
          <dd className={`break-words whitespace-pre-wrap ${k === "Message" ? "max-h-28 overflow-y-auto pr-1" : ""}`}
            style={{ color: k === "Email" ? "var(--primary-accent)" : "var(--text-primary, var(--text-heading))" }}>{v}</dd>
        </div>
      ))}
    </dl>
    {active && (
      <div className="flex gap-2 p-3 pt-0">
        <button type="button" onClick={onEdit} className={`${FLOW_BTN_CLASS} flex-1`} style={flowBtn(false)}><Pencil size={12} aria-hidden="true" /> Edit Details</button>
        <button type="button" onClick={onSend} className={`${FLOW_BTN_CLASS} flex-1`} style={flowBtn(true)}><Send size={12} aria-hidden="true" /> Send Message</button>
      </div>
    )}
  </div>
);

const ChipRow = ({ items, onPick, disabled }) => (
  <div className="mt-2 flex flex-wrap gap-1.5" role="group" aria-label="Subject suggestions">
    {items.map((s) => (
      <button key={s} type="button" disabled={disabled} onClick={() => onPick(s)}
        className={`${FLOW_BTN_CLASS} !py-1.5 !min-h-[32px]`}
        style={{ background: "rgba(255,107,53,0.1)", border: "1px solid rgba(255,107,53,0.3)", color: "var(--primary-accent)" }}>
        {s}
      </button>
    ))}
  </div>
);

export default function FloatingChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [apiReady, setApiReady] = useState(false);
  const [streamingId, setStreamingId] = useState(null);

  // Contact-flow state (kept apart from the AI conversation: historyRef never sees these messages).
  const [flow, setFlow] = useState(initialFlow);
  const [draft, setDraft] = useState("");
  const [live, setLive] = useState("");
  const [vvh, setVvh] = useState(null);

  const historyRef = useRef([]);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const triggerRef = useRef(null);
  const flowRef = useRef(initialFlow);
  const sendingRef = useRef(false);
  const idRef = useRef(0);

  useEffect(() => {
    const key = import.meta.env.VITE_GROQ_API_KEY;
    if (key && key.length > 10) setApiReady(true);
    else setError("Add VITE_GROQ_API_KEY to your .env");
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loading]);

  // Focus management
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      triggerRef.current?.focus();
    }
  }, [isOpen]);

  // Escape to close
  useEffect(() => {
    const handleEsc = (e) => { if (e.key === "Escape" && isOpen) setIsOpen(false); };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isOpen]);

  // Keep the panel inside the visual viewport when the mobile keyboard opens.
  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return undefined;
    const update = () => setVvh(window.innerWidth < 640 ? vv.height : null);
    update();
    vv.addEventListener("resize", update);
    window.addEventListener("resize", update);
    return () => { vv.removeEventListener("resize", update); window.removeEventListener("resize", update); };
  }, []);

  /* ── Contact flow helpers ── */
  const dispatchFlow = useCallback((action) => {
    const next = flowReducer(flowRef.current, action);
    flowRef.current = next;
    setFlow(next);
    return next;
  }, []);

  const pushFlow = useCallback((entry) => {
    const id = `f-${++idRef.current}`;
    setMessages((p) => [...p, { id, flow: true, role: "ai", time: getTime(), ...entry }]);
    if (entry.role !== "user" && entry.text) setLive(entry.text);
    return id;
  }, []);
  const dropMessage = useCallback((id) => setMessages((p) => p.filter((m) => m.id !== id)), []);

  const announce = (next) => {
    if (next.step === "review") pushFlow({ text: PROMPTS.review, kind: "review", data: { ...next.data } });
    else pushFlow({ text: PROMPTS[next.step], kind: next.step === "collecting_subject" ? "chips" : undefined });
  };

  const startContact = () => {
    if (isFlowActive(flowRef.current.step)) { inputRef.current?.focus(); return; }
    dispatchFlow({ type: "START" });
    setDraft("");
    pushFlow({ role: "user", raw: true, text: DM_LABEL });
    pushFlow({ text: "Sure! I'll help you send Monish a message. Let's collect a few details first." });
    pushFlow({ text: PROMPTS.collecting_name });
  };

  const submitValue = (value) => {
    const prev = flowRef.current;
    if (!isCollecting(prev.step)) return;
    const field = FIELD_OF[prev.step];
    const next = dispatchFlow({ type: "SUBMIT_FIELD", value });
    if (next.error) { setLive(next.error); return; } // invalid: draft stays untouched
    pushFlow({ role: "user", raw: true, text: next.data[field] });
    setDraft("");
    if (prev.returnToReview) {
      pushFlow({ text: "Updated! Here's your summary again.", kind: "review", data: { ...next.data } });
    } else announce(next);
  };

  const requestEdit = () => {
    if (!flowRef.current.step || !["review", "error"].includes(flowRef.current.step)) return;
    dispatchFlow({ type: "EDIT_REQUEST" });
    pushFlow({ text: "Which detail would you like to edit?", kind: "choose-edit" });
  };

  const editField = (field, label) => {
    const next = dispatchFlow({ type: "EDIT_FIELD", field });
    if (next.step === flowRef.current.step && !next.returnToReview) return;
    pushFlow({ role: "user", raw: true, text: `Edit ${label.toLowerCase()}` });
    pushFlow({ text: `Sure! Enter the new ${label.toLowerCase()}.` });
    setDraft(next.data[field]);
  };

  const sendContact = async () => {
    if (sendingRef.current) return; // prevent duplicate submissions
    const cur = flowRef.current;
    if (cur.step !== "review" && cur.step !== "error") return;
    sendingRef.current = true;
    dispatchFlow({ type: "SEND_START" });
    const statusId = pushFlow({ text: "Sending your message...", kind: "status" });
    try {
      await submitContactMessage(cur.data); // same backend as the Contact section; resolves only on 2xx
      dropMessage(statusId);
      dispatchFlow({ type: "SEND_OK" });
      pushFlow({
        kind: "success",
        text: "Your message has been sent successfully! Thanks for reaching out to Monish. I'll get back to you as soon as possible.",
      });
    } catch (err) {
      dropMessage(statusId);
      const detail = contactErrorDetail(err);
      dispatchFlow({ type: "SEND_FAIL", detail });
      pushFlow({ kind: "failure", detail, text: "Sorry, I couldn't send your message right now. Please try again." });
    } finally {
      sendingRef.current = false;
    }
  };

  const requestCancel = () => {
    const next = dispatchFlow({ type: "CANCEL_REQUEST" });
    if (next.step === "idle") { setDraft(""); pushFlow({ text: "Message cancelled. Ask me anything about Monish!" }); }
  };
  const confirmDiscard = () => {
    dispatchFlow({ type: "CANCEL_CONFIRM" });
    setDraft("");
    pushFlow({ text: "No problem, I've discarded that message. Ask me anything about Monish!" });
  };

  const sendMessage = useCallback(async (text) => {
    const q = (text || input).trim();
    if (!q || loading || !apiReady) return;
    if (isFlowActive(flowRef.current.step)) return; // never route contact details to the AI

    setInput("");
    setError(null);

    const userMsg = { role: "user", content: q };
    historyRef.current = [...historyRef.current, userMsg];

    const msgId = Date.now();
    setMessages((p) => [...p, { id: msgId, role: "user", text: q, time: getTime() }]);
    setLoading(true);

    try {
      const reply = await sendToGroq(historyRef.current);
      historyRef.current = [...historyRef.current, { role: "assistant", content: reply }];

      const aiId = msgId + 1;
      setMessages((p) => [
        ...p,
        { id: aiId, role: "ai", text: reply, time: getTime(), showResume: isResumeQuery(q) },
      ]);
      setStreamingId(aiId);
    } catch (err) {
      historyRef.current = historyRef.current.slice(0, -1);
      const status = err?.status;
      if (status === 429) {
        setError("Rate limited — please wait a moment.");
      } else if (status === 401) {
        setError("Invalid API key.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }, [input, loading, apiReady]);

  const handleStreamDone = useCallback(() => {
    setStreamingId(null);
  }, []);

  const resetChat = () => {
    const f = flowRef.current;
    if (f.step === "sending") return;
    if (isFlowActive(f.step) && hasData(f)) { dispatchFlow({ type: "CANCEL_REQUEST" }); return; } // ask before discarding
    dispatchFlow({ type: "CANCEL_CONFIRM" });
    setDraft("");
    setMessages([]);
    setError(null);
    setStreamingId(null);
    historyRef.current = [];
  };

  /* Composer mode: normal AI chat, a contact-flow field, or locked (buttons in the chat drive the flow). */
  const flowActive = isFlowActive(flow.step);
  const collecting = isCollecting(flow.step);
  const cfg = FIELD_CFG[flow.step];
  const isMessageStep = flow.step === "collecting_message";
  const composerMode = collecting ? "input" : flowActive ? "locked" : "ai";

  const submitDraft = () => submitValue(draft);
  const handleKey = (e) => {
    if (e.nativeEvent?.isComposing) return;
    if (e.key !== "Enter") return;
    if (composerMode === "input") {
      if (isMessageStep && e.shiftKey) return; // Shift+Enter = newline in the message field
      e.preventDefault();
      submitDraft();
    } else if (composerMode === "ai" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Move focus to the composer whenever the active step changes.
  useEffect(() => {
    if (isOpen && (composerMode === "input")) setTimeout(() => inputRef.current?.focus(), 50);
  }, [flow.step, isOpen, composerMode]);

  // Auto-grow the multiline message field (max ~5 lines) without breaking the layout.
  useEffect(() => {
    const el = inputRef.current;
    if (isMessageStep && el && el.tagName === "TEXTAREA") {
      el.style.height = "auto";
      el.style.height = `${Math.min(el.scrollHeight, 110)}px`;
    }
  }, [draft, isMessageStep, isOpen]);

  // Latest card of each kind is the only interactive one.
  const latest = {};
  messages.forEach((m) => { if (m.kind) latest[m.kind] = m.id; });

  return (
    <MotionConfig reducedMotion="user">
    <>
      {/* Floating trigger button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            ref={triggerRef}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            onClick={() => setIsOpen(true)}
            aria-label="Open Monish AI Assistant"
            className="cbx-launch"
            // 24px from the bottom on desktop; on phones, 12px above the glass tab bar (--mnav-offset is set by MobileTabBar)
            style={{ bottom: "calc(var(--mnav-offset, 12px) + 12px)" }}
          >
            <img
              src="/monish-profile.jpg"
              alt="Monish AI"
              className="cbx-launch__img"
              style={{ objectPosition: "center 15%" }}
              width={40}
              height={40}
            />
            {/* Availability dot */}
            <span className="cbx-launch__dot" aria-hidden="true" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Floating chat panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            role="dialog"
            aria-label="Monish AI Assistant"
            className="cbx-panel fixed z-50 flex flex-col overflow-hidden rounded-xl"
            style={{
              ...(vvh ? { maxHeight: `${Math.max(280, vvh - 16)}px` } : {}),
              background: "var(--bg-card)",
              border: "1px solid var(--border-card)",
              boxShadow: "0 20px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,107,53,0.1)",
            }}
          >
            {/* Chat header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b flex-shrink-0"
              style={{ borderColor: "var(--divider)", background: "var(--bg-surface)" }}>
              <div className="relative flex-shrink-0">
                <img src="/monish-profile.jpg" alt="Monish" className="cbx-hav w-8 h-8 rounded-full object-cover"
                  style={{ objectPosition: "center 15%" }} width={32} height={32} />
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2"
                  style={{ background: "#18C98B", borderColor: "var(--bg-surface)" }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold font-mono" style={{ color: "var(--text-heading)" }}>
                  Monish<span style={{ color: "var(--primary-accent)" }}>.ai</span>
                </p>
                <p className="text-[10px] font-mono flex items-center gap-1" style={{ color: "var(--accent-success)" }}>
                  // Open to Work
                </p>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => setIsOpen(false)} aria-label="Minimize chat"
                  className="w-7 h-7 flex items-center justify-center rounded-md transition-all"
                  style={{ color: "var(--text-faint)" }}>
                  <Minus size={14} />
                </button>
                <button onClick={() => setIsOpen(false)} aria-label="Close chat"
                  className="w-7 h-7 flex items-center justify-center rounded-md transition-all"
                  style={{ color: "var(--text-faint)" }}>
                  <X size={14} />
                </button>
              </div>
            </div>

            <div className="sr-only" role="status" aria-live="polite">{live}</div>

            {/* Messages area */}
            <div className="cbx-messages p-4 flex flex-col gap-3">
              {/* Welcome state */}
              {messages.length === 0 && (
                <div className="p-4 rounded-lg" style={{ background: "var(--badge-bg)", border: "1px solid var(--badge-border)" }}>
                  <div className="flex items-center gap-2 mb-2">
                    <Bot size={14} style={{ color: "var(--primary-accent)" }} />
                    <p className="text-sm font-bold font-mono" style={{ color: "var(--primary-accent)" }}>
                      Hey!
                    </p>
                  </div>
                  <p className="text-xs leading-relaxed mb-3" style={{ color: "var(--text-muted)" }}>
                    I'm Monish's AI assistant. Ask me anything about his projects, skills, or experience.
                  </p>
                  <div className="flex flex-col gap-1.5">
                    {STARTERS.map((s) => (
                      <button
                        key={s}
                        onClick={() => sendMessage(s)}
                        disabled={!apiReady || loading}
                        className="text-left px-3 py-2 rounded-md text-[11px] font-mono transition-all
                          hover:border-[var(--primary-accent)] disabled:opacity-40"
                        style={{
                          background: "var(--bg-surface)",
                          border: "1px solid var(--border-card)",
                          color: "var(--primary-accent)",
                        }}
                      >
                        {">"} {s}
                      </button>
                    ))}
                    {/* Direct message: works even without the AI key (separate backend) */}
                    <button
                      type="button"
                      onClick={startContact}
                      className="text-left px-3 py-2 rounded-md text-[11px] font-mono font-semibold transition-all
                        hover:brightness-125 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
                        focus-visible:outline-[var(--primary-accent)]"
                      style={{
                        background: "rgba(255,107,53,0.14)",
                        border: "1px solid var(--primary-accent)",
                        color: "var(--primary-accent)",
                      }}
                    >
                      {">"} {DM_LABEL}
                    </button>
                  </div>
                </div>
              )}

              {messages.map((msg) => {
                const isLatest = latest[msg.kind] === msg.id;
                let extra = null;
                if (msg.kind === "chips" && isLatest && flow.step === "collecting_subject") {
                  extra = <ChipRow items={SUBJECT_SUGGESTIONS} onPick={submitValue} />;
                } else if (msg.kind === "review") {
                  extra = (
                    <ReviewCard
                      data={msg.data}
                      active={isLatest && flow.step === "review" && !flow.choosingEdit}
                      onEdit={requestEdit}
                      onSend={sendContact}
                    />
                  );
                } else if (msg.kind === "choose-edit" && isLatest && flow.choosingEdit) {
                  extra = (
                    <div className="mt-2 flex flex-wrap gap-1.5" role="group" aria-label="Choose a detail to edit">
                      {EDIT_FIELDS.map(([f, label]) => (
                        <button key={f} type="button" onClick={() => editField(f, label)} className={`${FLOW_BTN_CLASS} !min-h-[32px]`} style={flowBtn(false)}>{label}</button>
                      ))}
                    </div>
                  );
                } else if (msg.kind === "status") {
                  extra = <div className="mt-1.5 flex items-center gap-2 text-[10px] font-mono" style={{ color: "var(--text-faint)" }}><Loader2 size={13} className="animate-spin motion-reduce:animate-none" aria-hidden="true" style={{ color: "var(--primary-accent)" }} /></div>;
                } else if (msg.kind === "success" && isLatest && flow.step === "success") {
                  extra = <button type="button" onClick={startContact} className={`${FLOW_BTN_CLASS} mt-2`} style={flowBtn(true)}><Check size={12} aria-hidden="true" /> Start a New Message</button>;
                } else if (msg.kind === "failure") {
                  extra = (
                    <>
                      {msg.detail && <p className="mt-1 text-[10px] font-mono break-words" style={{ color: "var(--text-faint)" }}>{msg.detail}</p>}
                      {isLatest && flow.step === "error" && !flow.choosingEdit && (
                        <div className="mt-2 flex gap-2">
                          <button type="button" onClick={sendContact} className={FLOW_BTN_CLASS} style={flowBtn(true)}><RefreshCw size={12} aria-hidden="true" /> Try Again</button>
                          <button type="button" onClick={requestEdit} className={FLOW_BTN_CLASS} style={flowBtn(false)}><Pencil size={12} aria-hidden="true" /> Edit Details</button>
                        </div>
                      )}
                    </>
                  );
                }
                return (
                  <Bubble key={msg.id} msg={msg} isStreaming={msg.id === streamingId} onStreamDone={handleStreamDone}>
                    {extra}
                  </Bubble>
                );
              })}

              {/* Typing indicator */}
              {loading && (
                <div className="flex items-end gap-2">
                  <div className="w-6 h-6 rounded-md flex items-center justify-center"
                    style={{ background: "rgba(255,107,53,0.15)", border: "1px solid rgba(255,107,53,0.25)" }}>
                    <Bot size={12} style={{ color: "var(--primary-accent)" }} />
                  </div>
                  <div className="px-3 py-2 rounded-lg chatbot-bot-bubble rounded-bl-sm">
                    <div className="flex items-center gap-1.5">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          className="w-1 h-1 rounded-full"
                          style={{ background: "var(--primary-accent)" }}
                          animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
                          transition={{ duration: 1.2, delay: i * 0.2, repeat: Infinity }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Error */}
              {error && !flowActive && (
                <div className="px-3 py-2 rounded-lg text-[11px]"
                  style={{ background: "rgba(255,59,48,0.1)", border: "1px solid rgba(255,59,48,0.2)", color: "#FF3B30" }}>
                  {error}
                </div>
              )}

              <div ref={bottomRef} />
            </div>

            {/* Contact-flow toolbar: explicit cancel (with confirmation if details were entered) */}
            {flowActive && (
              <div className="flex items-center justify-between gap-2 px-3 py-2 border-t flex-shrink-0 text-[10px] font-mono"
                style={{ borderColor: "var(--divider)", background: "var(--bg-surface)" }}>
                {flow.confirmCancel ? (
                  <>
                    <span role="alert" style={{ color: "var(--text-secondary)" }}>Discard this message?</span>
                    <span className="flex gap-1.5">
                      <button type="button" onClick={confirmDiscard} className={`${FLOW_BTN_CLASS} !py-1 !min-h-[30px]`}
                        style={{ background: "rgba(255,59,48,0.12)", border: "1px solid rgba(255,59,48,0.35)", color: "#FF6B5F" }}>Discard</button>
                      <button type="button" onClick={() => dispatchFlow({ type: "CANCEL_KEEP" })} className={`${FLOW_BTN_CLASS} !py-1 !min-h-[30px]`} style={flowBtn(false)}>Keep writing</button>
                    </span>
                  </>
                ) : (
                  <>
                    <span style={{ color: "var(--text-faint)" }}>
                      {collecting ? `Message to Monish · step ${STEP_NUMBER[flow.step]}/4`
                        : flow.step === "review" ? "Message to Monish · review"
                        : flow.step === "sending" ? "Sending..." : "Message to Monish · not sent yet"}
                    </span>
                    <button type="button" onClick={requestCancel} disabled={flow.step === "sending"}
                      className={`${FLOW_BTN_CLASS} !py-1 !min-h-[30px]`} style={flowBtn(false)}>
                      <X size={11} aria-hidden="true" /> Cancel
                    </button>
                  </>
                )}
              </div>
            )}

            {/* Input bar */}
            <div className="flex-shrink-0 border-t chatbot-input-bar" style={{ borderColor: "var(--divider)" }}>
              {/* Persistent shortcut once the AI chat is under way */}
              {!flowActive && messages.length > 0 && (
                <button type="button" onClick={startContact}
                  className="mx-3 mt-3 flex items-center justify-between w-[calc(100%-1.5rem)] px-3 py-2 rounded-md text-[11px] font-mono font-semibold
                    transition-all hover:brightness-125 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary-accent)]"
                  style={{ background: "rgba(255,107,53,0.1)", border: "1px solid rgba(255,107,53,0.35)", color: "var(--primary-accent)" }}>
                  <span>Message Monish directly</span><ArrowRight size={13} aria-hidden="true" />
                </button>
              )}

              {composerMode === "input" && (
                <div className="flex items-start justify-between gap-2 px-3 pt-2 text-[10px] font-mono min-h-[18px]">
                  {flow.error ? (
                    <p id="cb-err" role="alert" className="flex items-center gap-1" style={{ color: "#FF3B30" }}>
                      <AlertCircle size={11} aria-hidden="true" /> {flow.error}
                    </p>
                  ) : <span />}
                  {isMessageStep && <span style={{ color: "var(--text-ultra-faint)" }}>{draft.length}/{MAX_MESSAGE_LENGTH}</span>}
                </div>
              )}

              <div className="flex items-end gap-2 p-3">
                <button onClick={resetChat} aria-label="Clear chat" disabled={flow.step === "sending"}
                  className="w-8 h-8 flex items-center justify-center rounded-md flex-shrink-0 transition-all disabled:opacity-40"
                  style={{ background: "var(--badge-bg)", border: "1px solid var(--badge-border)", color: "var(--text-faint)" }}>
                  <RefreshCw size={12} />
                </button>
                <div className="flex-1 min-w-0 flex items-start gap-2 px-3 py-2 rounded-md"
                  style={{ background: "var(--input-bg)", border: `1px solid ${flow.error ? "rgba(255,59,48,0.5)" : "var(--input-border)"}` }}>
                  <span className="text-xs font-mono flex-shrink-0 leading-[18px]" style={{ color: "var(--primary-accent)" }}>{">"}</span>
                  {isMessageStep ? (
                    <textarea
                      ref={inputRef}
                      rows={1}
                      value={draft}
                      onChange={(e) => { setDraft(e.target.value); if (flow.error) dispatchFlow({ type: "CLEAR_ERROR" }); }}
                      onKeyDown={handleKey}
                      placeholder={cfg.placeholder}
                      maxLength={cfg.maxLength}
                      aria-label="Your message"
                      aria-invalid={!!flow.error}
                      aria-describedby={flow.error ? "cb-err" : undefined}
                      className="flex-1 min-w-0 bg-transparent text-[12px] leading-[18px] font-mono outline-none resize-none max-h-[110px]"
                      style={{ color: "var(--input-text)" }}
                    />
                  ) : (
                    <input
                      ref={inputRef}
                      type={composerMode === "input" ? cfg.type : "text"}
                      inputMode={composerMode === "input" && cfg.field === "email" ? "email" : undefined}
                      autoComplete={composerMode === "input" ? cfg.autoComplete : "off"}
                      maxLength={composerMode === "input" ? cfg.maxLength : undefined}
                      value={composerMode === "input" ? draft : composerMode === "locked" ? "" : input}
                      onChange={(e) => {
                        if (composerMode === "input") { setDraft(e.target.value); if (flow.error) dispatchFlow({ type: "CLEAR_ERROR" }); }
                        else setInput(e.target.value);
                      }}
                      onKeyDown={handleKey}
                      placeholder={
                        composerMode === "input" ? cfg.placeholder
                        : composerMode === "locked" ? "Use the buttons above to continue..."
                        : apiReady ? "Type a message..." : "API key missing..."
                      }
                      aria-label={composerMode === "input" ? `Your ${cfg.label}` : "Message"}
                      aria-invalid={composerMode === "input" ? !!flow.error : undefined}
                      aria-describedby={composerMode === "input" && flow.error ? "cb-err" : undefined}
                      disabled={composerMode === "locked" || (composerMode === "ai" && (loading || !apiReady))}
                      className="flex-1 min-w-0 bg-transparent text-[12px] leading-[18px] font-mono outline-none disabled:opacity-50"
                      style={{ color: "var(--input-text)" }}
                    />
                  )}
                </div>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => (composerMode === "input" ? submitDraft() : sendMessage())}
                  disabled={
                    composerMode === "input" ? !draft.trim()
                    : composerMode === "locked" ? true
                    : loading || !input.trim() || !apiReady
                  }
                  aria-label={composerMode === "input" ? `Submit ${cfg.label}` : "Send message"}
                  className="w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0
                    disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  style={{
                    background: "var(--primary-accent)",
                    color: "#FFFFFF",
                    boxShadow: "0 2px 8px rgba(255,107,53,0.3)",
                  }}
                >
                  <Send size={13} />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
    </MotionConfig>
  );
}