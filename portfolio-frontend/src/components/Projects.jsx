import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Github, ExternalLink, ChevronDown, ChevronUp } from "lucide-react";

// ── Animation helpers ─────────────────────────────────────────────
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.7, delay, ease: "easeOut" },
});

// ── Data ─────────────────────────────────────────────────────────
const PROJECTS = [
  {
    id: 1,
    num: "01",
    icon: "💰",
    iconBg: "bg-violet-500/15 border-violet-500/30",
    cat: ["fullstack", "ml"],
    catLabel: "Full Stack · PERN + ML Integration",
    catColor: "text-violet-300",
    title: "SpareChange",
    featured: true,
    github: "https://github.com/Monishkumar-14/SpareChange",
    live: null,
    desc: "A full-stack micro-savings platform that rounds transactions and allocates spare change across savings, investments, or donations — powered by an ML recommendation engine.",
    highlights: [
      { color: "bg-violet-400", text: "Sub-200ms API response time with optimised PostgreSQL queries" },
      { color: "bg-cyan-400",   text: "JWT auth + 3-tier RBAC securing all financial endpoints" },
      { color: "bg-pink-400",   text: "ML engine (scikit-learn) improves allocation accuracy ~40% over baseline" },
    ],
    tech: ["ReactJS", "Node.js", "Express", "PostgreSQL", "JWT + RBAC", "Python", "scikit-learn", "REST API"],
    stats: [
      { num: "<200ms", label: "API Response",    color: "text-violet-400" },
      { num: "~40%",   label: "ML Accuracy Gain",color: "text-cyan-400"   },
      { num: "6+",     label: "DB Tables",        color: "text-pink-400"   },
      { num: "3-Tier", label: "RBAC System",      color: "text-amber-400"  },
    ],
    caseStudy: {
      problem:   "Users lack simple tools to automate micro-savings without behavioural change.",
      approach:  "PERN stack with normalised DB schema + content-based ML trained on spending patterns.",
      challenge: "Building a reliable round-up system with sub-200ms latency across 6 normalised tables.",
      outcome:   "Automated allocation with personalised fund suggestions, ~40% better than random baseline.",
    },
  },
  {
    id: 2,
    num: "02",
    icon: "🍳",
    iconBg: "bg-pink-500/15 border-pink-500/30",
    cat: ["ml"],
    catLabel: "Machine Learning · Python · NLP",
    catColor: "text-pink-300",
    title: "Ingre2Recipe",
    featured: false,
    github: "https://github.com/Monishkumar-14/Ingre2Recipe",
    live: null,
    desc: "NLP-based ingredient parser that tokenizes user-input ingredients and matches them against 1,000+ recipes using TF-IDF similarity scoring with a collaborative filtering recommendation layer.",
    highlights: [
      { color: "bg-pink-400",   text: "85%+ ingredient-match accuracy with TF-IDF scoring" },
      { color: "bg-violet-400", text: "Collaborative filtering for personalised recipe suggestions" },
      { color: "bg-cyan-400",   text: "Modular architecture — parse, match, recommend layers fully decoupled" },
    ],
    tech: ["Python", "TF-IDF", "NLP", "scikit-learn", "pandas", "NumPy", "Collaborative Filtering"],
    caseStudy: {
      problem:   "Users struggle to find recipes using only what's in their kitchen.",
      approach:  "TF-IDF tokenises ingredients; collaborative filtering surfaces personalised recipes.",
      challenge: "Partial matches and misspellings required fuzzy matching logic.",
      outcome:   "85%+ accuracy on 1,000+ recipe dataset. Modular layers allow easy expansion.",
    },
  },
  {
    id: 3,
    num: "03",
    icon: "⚙️",
    iconBg: "bg-amber-500/15 border-amber-500/30",
    cat: ["dbms"],
    catLabel: "DBMS · PostgreSQL · Backend",
    catColor: "text-amber-300",
    title: "SpareParts Management System",
    featured: false,
    github: "https://github.com/Monishkumar-14/SpareParts_Management_System",
    live: null,
    desc: "Database-driven inventory and order management system supporting 3 user roles with granular RBAC across 8+ relational tables and optimised JOIN queries for fast data retrieval.",
    highlights: [
      { color: "bg-amber-400",  text: "~35% faster data retrieval vs unindexed baseline" },
      { color: "bg-violet-400", text: "Granular RBAC across 8+ relational tables with referential integrity" },
      { color: "bg-cyan-400",   text: "Full CRUD for inventory, supplier records, and purchase orders" },
    ],
    tech: ["PostgreSQL", "RBAC", "SQL", "DBMS", "Node.js", "Express.js", "REST API"],
    caseStudy: {
      problem:   "Manual spare parts tracking leads to inventory errors and procurement delays.",
      approach:  "Normalised PostgreSQL schema with 8+ tables and 3-role access control.",
      challenge: "Complex multi-table JOINs were slow — solved with strategic indexing.",
      outcome:   "~35% faster queries. 3-role system enforcing data integrity across all operations.",
    },
  },
  {
    id: 4,
    num: "04",
    icon: "🌿",
    iconBg: "bg-cyan-500/15 border-cyan-500/30",
    cat: ["systems"],
    catLabel: "Systems · C++ · Advanced DSA",
    catColor: "text-cyan-300",
    title: "Git Graph Simulator",
    featured: false,
    github: "https://github.com/Monishkumar-14/git-simulator",
    live: "#",
    desc: "Real-time Git graph visualiser in C++ using the Crow web framework, implementing a Directed Acyclic Graph (DAG) to accurately model commit trees, branches, and merges as a live web tool.",
    highlights: [
      { color: "bg-cyan-400",   text: "DAG data structure models commit trees, branches and merges accurately" },
      { color: "bg-violet-400", text: "Live deployed interactive web tool with real-time graph updates" },
      { color: "bg-pink-400",   text: "Positive peer feedback from 20+ users improving Git intuition" },
    ],
    tech: ["C++", "Crow Framework", "DAG", "Data Structures", "Algorithms", "Web Deployment"],
    caseStudy: {
      problem:   "Developers struggle to visualise Git graph operations like branching and merging.",
      approach:  "C++ DAG implementation served via Crow HTTP framework as a real-time web app.",
      challenge: "Rendering DAG topology correctly for complex merge/branch scenarios in real-time.",
      outcome:   "Live deployable tool used by 20+ peers to improve Git understanding interactively.",
    },
  },
];

const FILTERS = [
  { key: "all",       label: "All Projects" },
  { key: "fullstack", label: "Full Stack"   },
  { key: "ml",        label: "ML / AI"      },
  { key: "dbms",      label: "DBMS"         },
  { key: "systems",   label: "Systems"      },
];

// ── Case Study Panel ──────────────────────────────────────────────
const CaseStudy = ({ cs }) => (
  <motion.div
    initial={{ opacity: 0, height: 0 }}
    animate={{ opacity: 1, height: "auto" }}
    exit={{ opacity: 0, height: 0 }}
    transition={{ duration: 0.3 }}
    className="mt-5 pt-5 border-t border-white/8 overflow-hidden"
  >
    <p className="text-[10px] font-semibold uppercase tracking-[2px]
      text-white/30 mb-4">
      Case Study
    </p>
    <div className="grid grid-cols-2 gap-3">
      {[
        { label: "Problem",   color: "text-violet-300", text: cs.problem   },
        { label: "Approach",  color: "text-cyan-300",   text: cs.approach  },
        { label: "Challenge", color: "text-pink-300",   text: cs.challenge },
        { label: "Outcome",   color: "text-green-400",  text: cs.outcome   },
      ].map(({ label, color, text }) => (
        <div key={label}
          className="p-3 rounded-[14px] bg-white/4 border border-white/7">
          <p className={`text-[10px] font-semibold uppercase tracking-[1.5px]
            mb-1.5 ${color}`}>
            {label}
          </p>
          <p className="text-[11px] text-white/40 leading-relaxed">{text}</p>
        </div>
      ))}
    </div>
  </motion.div>
);

// ── Featured Card ─────────────────────────────────────────────────
const FeaturedCard = ({ p }) => {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="col-span-1 md:col-span-2 glass-card p-8 group"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">

        {/* Left — text */}
        <div>
          <div className="flex items-start justify-between mb-5">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center
              text-2xl border ${p.iconBg}`}>
              {p.icon}
            </div>
            <span className="text-[11px] font-mono text-white/20">{p.num} / 04</span>
          </div>
          <p className={`text-[11px] font-semibold uppercase tracking-[1.5px]
            mb-2 ${p.catColor}`}>
            {p.catLabel}
          </p>
          <h3 className="text-2xl font-extrabold text-white mb-3 tracking-tight">
            {p.title}
          </h3>
          <p className="text-sm text-white/50 leading-relaxed mb-5">{p.desc}</p>

          <div className="flex flex-col gap-2.5 mb-5">
            {p.highlights.map((h) => (
              <div key={h.text} className="flex items-start gap-2.5">
                <div className={`w-1.5 h-1.5 rounded-full ${h.color}
                  flex-shrink-0 mt-1.5`} />
                <span className="text-xs text-white/45 leading-relaxed">{h.text}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-1.5 mb-5">
            {p.tech.map((t) => (
              <span key={t}
                className="px-3 py-1 rounded-full text-[11px] font-mono
                  bg-white/6 border border-white/10 text-white/50">
                {t}
              </span>
            ))}
          </div>

          <div className="flex gap-2 items-center">
            <motion.a
              href={p.github} target="_blank"
              whileHover={{ scale: 1.04, y: -2 }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs
                font-semibold bg-white/7 border border-white/12 text-white/70
                hover:bg-white/14 hover:text-white transition-all"
            >
              <Github size={13}/> GitHub
            </motion.a>
            <motion.button
              onClick={() => setOpen((o) => !o)}
              whileHover={{ scale: 1.04 }}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-full
                text-xs font-semibold bg-violet-500/15 border border-violet-500/30
                text-violet-300 hover:bg-violet-500/25 transition-all"
            >
              Case Study {open ? <ChevronUp size={12}/> : <ChevronDown size={12}/>}
            </motion.button>
          </div>

          <AnimatePresence>
            {open && <CaseStudy cs={p.caseStudy} />}
          </AnimatePresence>
        </div>

        {/* Right — stats */}
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            {p.stats.map(({ num, label, color }) => (
              <div key={label}
                className="p-5 rounded-2xl bg-white/5 border border-white/8 text-center">
                <div className={`text-2xl font-extrabold ${color}`}>{num}</div>
                <div className="text-[10px] text-white/35 mt-1 uppercase tracking-widest">
                  {label}
                </div>
              </div>
            ))}
          </div>

          {/* Case study preview box */}
          <div className="p-5 rounded-2xl bg-violet-500/7 border border-violet-500/15">
            <p className="text-[10px] font-semibold uppercase tracking-[2px]
              text-violet-400/60 mb-3">
              Quick Overview
            </p>
            <div className="flex flex-col gap-2.5">
              {[
                { label: "Problem",  color: "text-violet-300", text: p.caseStudy.problem  },
                { label: "Approach", color: "text-cyan-300",   text: p.caseStudy.approach },
                { label: "Outcome",  color: "text-green-400",  text: p.caseStudy.outcome  },
              ].map(({ label, color, text }) => (
                <p key={label} className="text-xs text-white/40 leading-relaxed">
                  <span className={`font-semibold ${color}`}>{label}: </span>
                  {text}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// ── Regular Card ──────────────────────────────────────────────────
const ProjectCard = ({ p, delay }) => {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ y: -6 }}
      className="glass-card p-8 flex flex-col"
    >
      <div className="flex items-start justify-between mb-5">
        <div className={`w-13 h-13 rounded-2xl flex items-center justify-center
          text-2xl border ${p.iconBg}`}>
          {p.icon}
        </div>
        <span className="text-[11px] font-mono text-white/20">{p.num} / 04</span>
      </div>

      <p className={`text-[11px] font-semibold uppercase tracking-[1.5px]
        mb-2 ${p.catColor}`}>
        {p.catLabel}
      </p>
      <h3 className="text-xl font-extrabold text-white mb-3 tracking-tight">
        {p.title}
      </h3>
      <p className="text-sm text-white/50 leading-relaxed mb-5 flex-1">{p.desc}</p>

      <div className="flex flex-col gap-2 mb-5">
        {p.highlights.map((h) => (
          <div key={h.text} className="flex items-start gap-2">
            <div className={`w-1.5 h-1.5 rounded-full ${h.color}
              flex-shrink-0 mt-1.5`} />
            <span className="text-xs text-white/40 leading-relaxed">{h.text}</span>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-1.5 mb-5">
        {p.tech.map((t) => (
          <span key={t}
            className="px-3 py-1 rounded-full text-[11px] font-mono
              bg-white/6 border border-white/10 text-white/50">
            {t}
          </span>
        ))}
      </div>

      <div className="flex gap-2 flex-wrap">
        <motion.a
          href={p.github} target="_blank"
          whileHover={{ scale: 1.04, y: -2 }}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs
            font-semibold bg-white/7 border border-white/12 text-white/70
            hover:bg-white/14 hover:text-white transition-all"
        >
          <Github size={12}/> GitHub
        </motion.a>
        {p.live && (
          <motion.a
            href={p.live} target="_blank"
            whileHover={{ scale: 1.04, y: -2 }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs
              font-semibold bg-cyan-500/15 border border-cyan-500/30
              text-cyan-300 hover:bg-cyan-500/25 transition-all"
          >
            <ExternalLink size={12}/> Live Demo
          </motion.a>
        )}
        <motion.button
          onClick={() => setOpen((o) => !o)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs
            font-semibold bg-white/5 border border-white/10 text-white/50
            hover:bg-white/10 hover:text-white/80 transition-all ml-auto"
        >
          {open ? <ChevronUp size={12}/> : <ChevronDown size={12}/>}
          Case Study
        </motion.button>
      </div>

      <AnimatePresence>
        {open && <CaseStudy cs={p.caseStudy} />}
      </AnimatePresence>
    </motion.div>
  );
};

// ── Main Component ────────────────────────────────────────────────
const Projects = () => {
  const [activeFilter, setActiveFilter] = useState("all");

  const filtered = PROJECTS.filter((p) =>
    activeFilter === "all" || p.cat.includes(activeFilter)
  );

  return (
    <div className="min-h-screen py-24 px-6">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <motion.div {...fadeUp(0)} className="mb-6">
          <p className="text-[11px] font-semibold uppercase tracking-[3px]
            text-violet-400 mb-3">
            02 — Projects
          </p>
          <h2 className="text-5xl md:text-6xl font-extrabold tracking-tight leading-tight mb-4">
            Things I've{" "}
            <span className="bg-gradient-to-r from-violet-400 via-cyan-400 to-pink-400
              bg-clip-text text-transparent">
              Built
            </span>
          </h2>
          <p className="text-sm text-white/40 leading-relaxed max-w-lg">
            End-to-end production applications spanning full-stack web,
            ML integration, database systems, and systems programming.
          </p>
        </motion.div>

        {/* Summary pills */}
        <motion.div {...fadeUp(0.1)}
          className="flex flex-wrap gap-3 mb-10">
          {[
            { dot: "bg-violet-500 shadow-[0_0_6px_#7c3aed]", label: "4 Projects"          },
            { dot: "bg-cyan-400   shadow-[0_0_6px_#06b6d4]", label: "PERN · ML · C++"     },
            { dot: "bg-pink-400   shadow-[0_0_6px_#ec4899]", label: "All on GitHub"        },
            { dot: "bg-green-400  shadow-[0_0_6px_#4ade80]", label: "1 Live Deployment"    },
          ].map(({ dot, label }) => (
            <span key={label}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs
                font-medium bg-white/5 border border-white/9 text-white/50">
              <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dot}`}/>
              {label}
            </span>
          ))}
        </motion.div>

        {/* Filter bar */}
        <motion.div {...fadeUp(0.15)}
          className="flex flex-wrap gap-2 mb-10">
          {FILTERS.map(({ key, label }) => (
            <motion.button
              key={key}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveFilter(key)}
              className={`px-5 py-2 rounded-full text-xs font-semibold
                transition-all duration-200
                ${activeFilter === key
                  ? "bg-violet-500/20 border border-violet-500/40 text-violet-300"
                  : "bg-white/6 border border-white/10 text-white/45 hover:bg-white/11 hover:text-white"
                }`}
            >
              {label}
            </motion.button>
          ))}
        </motion.div>

        {/* Grid */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <AnimatePresence mode="popLayout">
            {filtered.map((p, i) =>
              p.featured ? (
                <FeaturedCard key={p.id} p={p} />
              ) : (
                <ProjectCard key={p.id} p={p} delay={i * 0.1} />
              )
            )}
          </AnimatePresence>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div {...fadeUp(0.3)}
          className="mt-12 text-center">
          <p className="text-sm text-white/35 mb-4">
            Want to see more? All projects are on GitHub.
          </p>
          <motion.a
            href="https://github.com/Monishkumar-14"
            target="_blank"
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.96 }}
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full
              text-sm font-semibold bg-white/7 border border-white/12
              text-white/70 hover:bg-white/14 hover:text-white transition-all"
          >
            <Github size={15}/> View All Repos on GitHub
          </motion.a>
        </motion.div>

      </div>
    </div>
  );
};

export default Projects;