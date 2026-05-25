import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin, Calendar, Clock, ChevronDown, ExternalLink,
  Building2, Cpu, FileText, Database, Layers, Zap,
  BadgeCheck, BrainCircuit, Code2
} from "lucide-react";

// ── Animation helpers ─────────────────────────────────────────────
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.7, delay, ease: "easeOut" },
});

// ── AZ Logo SVG (official icon) ───────────────────────────────────
const AZLogo = ({ size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 95.4 115.5" fill="none">
    <path
      fill="#f9b000"
      d="M48.1,81.3c-1,.7-2,1.3-3,2-11.7-6.5-37-19.1-39.2-20.2-2.3-1.2-6.4-2.8-5.9-6.7.7-5.5,10.2-17.4,14.2-22.3C36,7.4,45.7-.8,52.2,0c6.9.9,10.7,8,11.2,41.4-3.8-1.2-8.1-2.4-12.6-3.5-.4-4.8-1.3-12.2-1.6-14.7-.4-2.9-.9-3.9-2.1-4.1-1.3-.2-4.5,2.9-7.3,5.8-1.3,1.3-5,5.1-9.1,9.2-3.4-.2-5.7.5-7,2.2-1,1.3-1.2,3.2-.6,5.5l-5.3,5.3c-4.5,4.5-9.3,8.3-9.6,10.1-.2,1.5,2.1,3,5.4,5,8,4.8,27.6,15.4,34.6,19.1M78.7,48c-7.7-2.7-26.7-9.7-46.7-12.4-6.9-.9-9.7,1.5-6.8,8.1s10,17.3,17.6,25.5,15.8,10.3,18.4-2.2c0-.4.2-.9.3-1.3.6-3,1.1-6,1.3-9.1-3.4-1.5-7.1-3.2-10.9-4.8.2,2.9.5,7.8.7,11.7,0,.5,0,1,0,1.4.2,6.2-1.9,6.2-5.4,3.6-4.1-2.9-16.7-19.5-18.1-26.8,0-.5.2-.5.4-.4h.3c2.8,1.2,12.3,5,21.9,9,3.8,1.6,7.7,3.3,11.1,4.8s6.4,3,8.7,4.2c4.1,2.2,5.8,3.7,4,5.5-8.6,8.8-38.8,21.2-49.2,36.6v.2c-.2.2-.4.3-.5.5,0,0,0,.1,0,.2-.8,1.4-1.3,3-1.5,4.6-.4,3.4,1.3,6.4,6.1,7.8,1.3.4,2.7.6,4.1.8.3,0,.6,0,.8,0,9.3.4,33.4-4.8,40.7-8.1,7.6-3.4,5.3-6.7,3.1-8.5-1.6-1.3-10.1-6-14.2-8.3l-3,1.9c3.9,2.3,7.7,4.9,11.4,7.6.6.5.3,1.1-.7,1.1h-.7c-6.6.5-19.2,1.4-25,1.7-.9,0-1.8,0-2.4.1,1.2-1.1,2.5-2.2,3.9-3.2,12.6-8.8,33.6-21.3,39.7-26.6,4.6-3.9,17-16-9.8-25.3"
    />
  </svg>
);

// ── Tech stack pills ──────────────────────────────────────────────
const TECH = [
  { label: "RAG Pipeline",     cls: "bg-violet-500/15 border-violet-500/30 text-violet-300" },
  { label: "LangChain",        cls: "bg-blue-500/12  border-blue-500/28  text-blue-300"    },
  { label: "Vector DB",        cls: "bg-cyan-500/12  border-cyan-500/28  text-cyan-300"    },
  { label: "Python",           cls: "bg-amber-500/12 border-amber-500/28 text-amber-300"   },
  { label: "OpenAI API",       cls: "bg-green-500/10 border-green-500/25 text-green-400"   },
  { label: "Document Parsing", cls: "bg-pink-500/12  border-pink-500/28  text-pink-300"    },
  { label: "Embeddings",       cls: "bg-violet-500/12 border-violet-500/28 text-violet-300"},
  { label: "NLP",              cls: "bg-cyan-500/10  border-cyan-500/25  text-cyan-300"    },
];

// ── Highlights ────────────────────────────────────────────────────
const HIGHLIGHTS = [
  {
    Icon: FileText,
    iconCls: "text-violet-400",
    bgCls: "bg-violet-500/12 border-violet-500/28",
    title: "100+ Documents Processed",
    desc: "Ingested and indexed a large corpus of internal company documents for intelligent retrieval.",
  },
  {
    Icon: BrainCircuit,
    iconCls: "text-cyan-400",
    bgCls: "bg-cyan-500/12 border-cyan-500/28",
    title: "RAG Architecture",
    desc: "Built a Retrieval-Augmented Generation pipeline combining vector search with LLM generation for accurate, grounded answers.",
  },
  {
    Icon: Layers,
    iconCls: "text-pink-400",
    bgCls: "bg-pink-500/12 border-pink-500/28",
    title: "ETS Department",
    desc: "Worked within the Enterprise Technology Solutions team, delivering an internal AI tool for knowledge management.",
  },
  {
    Icon: Zap,
    iconCls: "text-amber-400",
    bgCls: "bg-amber-500/10 border-amber-500/25",
    title: "Context-Aware Chatbot",
    desc: "The chatbot retrieves relevant document chunks and generates responses grounded in AstraZeneca's own knowledge base.",
  },
];

// ── Main Component ────────────────────────────────────────────────
const Experience = () => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="min-h-screen py-24 px-6">
      <div className="max-w-6xl mx-auto">

        {/* ── Header ── */}
        <motion.div {...fadeUp(0)} className="mb-5">
          <p className="text-[11px] font-semibold uppercase tracking-[3px]
            text-violet-400 mb-3">
            02 — Experience
          </p>
          <h2 className="text-5xl md:text-6xl font-extrabold tracking-tight
            leading-tight mb-4">
            Where I've{" "}
            <span className="bg-gradient-to-r from-violet-400 via-cyan-400
              to-pink-400 bg-clip-text text-transparent">
              Worked
            </span>
          </h2>
          <p className="text-sm text-white/40 leading-relaxed max-w-lg">
            Real-world experience building AI-powered systems at a global
            pharmaceutical company.
          </p>
        </motion.div>

        {/* ── Stats Strip ── */}
        <motion.div {...fadeUp(0.08)} className="flex flex-wrap gap-3 mb-12">
          {[
            { dot: "bg-violet-500 shadow-[0_0_6px_#7c3aed]", label: "1 Internship"            },
            { dot: "bg-cyan-400   shadow-[0_0_6px_#06b6d4]", label: "AstraZeneca · Chennai"    },
            { dot: "bg-pink-400   shadow-[0_0_6px_#ec4899]", label: "AI / ML · Chatbot · RAG"  },
            { dot: "bg-green-400  shadow-[0_0_6px_#4ade80]", label: "May 2026 – Jul 2026"       },
          ].map(({ dot, label }) => (
            <span key={label}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full
                text-xs font-medium bg-white/5 border border-white/9 text-white/50">
              <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dot}`}/>
              {label}
            </span>
          ))}
        </motion.div>

        {/* ── Experience Card ── */}
        <motion.div {...fadeUp(0.12)}>
          <div className="glass-card overflow-hidden">

            {/* ── Top Band ── */}
            <div className="relative border-b border-white/8 overflow-hidden">
              {/* Ambient glow */}
              <div className="absolute -top-10 -right-10 w-64 h-64 rounded-full
                bg-violet-500/6 blur-3xl pointer-events-none" />
              <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full
                bg-cyan-500/5 blur-3xl pointer-events-none" />

              <div className="relative p-8 md:p-10">
                <div className="flex flex-col md:flex-row md:items-start gap-6">

                  {/* Logo + company */}
                  <div className="flex items-center gap-4 flex-shrink-0">
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center
                      bg-black/40 border border-amber-500/20
                      shadow-[0_0_32px_rgba(249,176,0,0.2)]">
                      <AZLogo size={42} />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-[2.5px]
                        text-white/30 font-semibold mb-0.5">
                        Internship
                      </p>
                      <h3 className="text-xl font-extrabold text-white tracking-tight">
                        AstraZeneca
                      </h3>
                      <p className="text-xs text-white/40 mt-0.5 font-medium">
                        Enterprise Technology Solutions (ETS)
                      </p>
                    </div>
                  </div>

                  {/* Meta badges */}
                  <div className="flex flex-wrap gap-2 md:ml-auto items-start">
                    <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full
                      text-[11px] font-semibold bg-white/5 border border-white/10 text-white/45">
                      <MapPin size={10} /> Chennai, India
                    </span>
                    <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full
                      text-[11px] font-semibold bg-white/5 border border-white/10 text-white/45">
                      <Calendar size={10} /> 18 May – 17 Jul 2026
                    </span>
                    <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full
                      text-[11px] font-semibold bg-white/5 border border-white/10 text-white/45">
                      <Clock size={10} /> 2 months
                    </span>
                    <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full
                      text-[11px] font-semibold
                      bg-green-500/10 border border-green-500/25 text-green-400">
                      <BadgeCheck size={10} /> Current
                    </span>
                  </div>
                </div>

                {/* Role title */}
                <div className="mt-6">
                  <div className="flex items-center gap-2 mb-1">
                    <Code2 size={14} className="text-violet-400" />
                    <p className="text-[10px] uppercase tracking-[2px]
                      text-white/30 font-semibold">
                      Role
                    </p>
                  </div>
                  <h4 className="text-2xl font-extrabold text-white tracking-tight leading-snug">
                    AI / ML Intern —{" "}
                    <span className="bg-gradient-to-r from-violet-400 to-cyan-400
                      bg-clip-text text-transparent">
                      RAG Chatbot Developer
                    </span>
                  </h4>
                </div>
              </div>
            </div>

            {/* ── Body ── */}
            <div className="p-8 md:p-10 space-y-8">

              {/* Summary */}
              <div>
                <p className="text-sm text-white/50 leading-relaxed max-w-3xl">
                  Designed and developed an intelligent document chatbot for AstraZeneca's
                  internal knowledge base using a Retrieval-Augmented Generation (RAG)
                  architecture. Processed hundreds of internal documents — converting them
                  into vector embeddings — enabling employees to query institutional
                  knowledge conversationally and receive precise, source-grounded answers.
                </p>
              </div>

              {/* Highlights grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {HIGHLIGHTS.map(({ Icon, iconCls, bgCls, title, desc }) => (
                  <motion.div
                    key={title}
                    whileHover={{ y: -4 }}
                    className="flex gap-4 p-5 rounded-2xl bg-white/[0.03]
                      border border-white/8 hover:border-white/14
                      transition-all duration-300"
                  >
                    <div className={`w-10 h-10 rounded-[12px] flex items-center
                      justify-center border flex-shrink-0 ${bgCls}`}>
                      <Icon size={18} className={iconCls} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white mb-1">{title}</p>
                      <p className="text-xs text-white/40 leading-relaxed">{desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Expandable detail */}
              <div className="rounded-2xl border border-white/8 overflow-hidden">
                <button
                  onClick={() => setExpanded(!expanded)}
                  className="w-full flex items-center justify-between px-6 py-4
                    text-xs font-semibold text-white/50 hover:text-white/70
                    hover:bg-white/4 transition-all duration-200"
                >
                  <span className="flex items-center gap-2">
                    <Database size={13} className="text-violet-400" />
                    What I built — technical breakdown
                  </span>
                  <motion.div
                    animate={{ rotate: expanded ? 180 : 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <ChevronDown size={14} />
                  </motion.div>
                </button>

                <AnimatePresence>
                  {expanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 border-t border-white/6 pt-5 space-y-4">
                        {[
                          {
                            step: "01",
                            title: "Document ingestion",
                            detail: "Parsed 100+ internal company documents (PDFs, Word files) — extracted clean text and split them into semantically meaningful chunks.",
                          },
                          {
                            step: "02",
                            title: "Vector embedding & indexing",
                            detail: "Generated dense embeddings for each chunk using an embedding model and stored them in a vector database for fast similarity search.",
                          },
                          {
                            step: "03",
                            title: "Retrieval pipeline",
                            detail: "On each user query, the top-k most relevant document chunks are retrieved from the vector store using cosine similarity.",
                          },
                          {
                            step: "04",
                            title: "LLM-powered generation",
                            detail: "Retrieved context is injected into a prompt sent to an LLM, which generates a grounded, accurate response citing the company's own documents.",
                          },
                          {
                            step: "05",
                            title: "Chatbot interface",
                            detail: "Delivered a conversational UI that employees in the ETS department can use to query internal knowledge without digging through files manually.",
                          },
                        ].map(({ step, title, detail }) => (
                          <div key={step} className="flex gap-4">
                            <span className="text-[10px] font-mono text-violet-500/60
                              pt-0.5 flex-shrink-0 w-5">
                              {step}
                            </span>
                            <div>
                              <p className="text-xs font-bold text-white/70 mb-0.5">{title}</p>
                              <p className="text-xs text-white/35 leading-relaxed">{detail}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Tech stack */}
              <div>
                <p className="text-[10px] uppercase tracking-[2px] text-white/25
                  font-semibold mb-3">
                  Technologies Used
                </p>
                <div className="flex flex-wrap gap-2">
                  {TECH.map(({ label, cls }) => (
                    <span key={label}
                      className={`px-3 py-1.5 rounded-full text-[11px]
                        font-semibold border ${cls}`}>
                      {label}
                    </span>
                  ))}
                </div>
              </div>

            </div>

            {/* ── Footer band ── */}
            <div className="border-t border-white/7 px-8 md:px-10 py-5
              flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <Building2 size={13} className="text-white/25" />
                <p className="text-xs text-white/30">
                  AstraZeneca · ETS Department · Chennai, India
                </p>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400
                  shadow-[0_0_6px_#4ade80] animate-pulse" />
                <span className="text-xs text-green-400/70 font-medium">
                  Internship ongoing
                </span>
              </div>
            </div>

          </div>
        </motion.div>

        {/* ── Footer note ── */}
        <motion.div {...fadeUp(0.3)} className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full
            bg-white/4 border border-white/8">
            <Cpu size={13} className="text-violet-400" />
            <p className="text-xs text-white/35">
              Built with RAG · LangChain · Vector Embeddings
              <span className="text-white/20 mx-1.5">·</span>
              <span className="text-violet-400/70">AstraZeneca ETS</span>
              <span className="text-white/20 mx-1.5">·</span>
              May – Jul 2026
            </p>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default Experience;