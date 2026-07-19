import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Github, ExternalLink, ChevronDown, ChevronUp, ChevronLeft, ChevronRight,
  X, Users, Layers, Zap, Code2, Database, GitBranch, Brain, Package, Cpu, Wifi
} from "lucide-react";

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
    icon: <Zap size={20} />,
    iconBg: "bg-violet-500/15 border-violet-500/30",
    cat: ["fullstack", "ml"],
    catLabel: "Full Stack · PERN + ML Integration",
    catColor: "text-violet-300",
    accentColor: "violet",
    title: "SpareChange",
    featured: true,
    github: "https://github.com/GUNASEKHAR5/SPARE_CHANGE",
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
    modal: {
      overview: "A full-stack micro-savings platform that automatically rounds up transactions and allocates spare change across savings, investments, or donations. Powered by a scikit-learn ML recommendation engine that learns from spending patterns to improve allocation accuracy.",
      sections: [
        {
          icon: Users,
          title: "Roles & Features",
          color: "text-violet-300",
          borderColor: "border-violet-500/20",
          bgColor: "bg-violet-500/8",
          items: [
            { label: "Investors", desc: "Set saving goals, view allocations, and track portfolio growth" },
            { label: "Admins", desc: "Manage users, configure round-up rules, and monitor platform analytics" },
            { label: "ML Engine", desc: "Content-based filtering trained on spending patterns for personalised allocation" },
          ],
        },
        {
          icon: Layers,
          title: "Tech Stack",
          color: "text-cyan-300",
          borderColor: "border-cyan-500/20",
          bgColor: "bg-cyan-500/8",
          items: [
            { label: "Frontend", desc: "ReactJS with responsive dashboard components" },
            { label: "Backend", desc: "Node.js + Express REST API with JWT authentication" },
            { label: "Database", desc: "PostgreSQL with 6+ normalised tables and optimised indexing" },
            { label: "ML Layer", desc: "Python + scikit-learn content-based recommendation model" },
          ],
        },
        {
          icon: Zap,
          title: "Highlights",
          color: "text-pink-300",
          borderColor: "border-pink-500/20",
          bgColor: "bg-pink-500/8",
          items: [
            { label: "Performance", desc: "Sub-200ms API response time with optimised PostgreSQL queries" },
            { label: "Security", desc: "JWT auth + 3-tier RBAC securing all financial endpoints" },
            { label: "Accuracy", desc: "ML engine improves allocation accuracy ~40% over random baseline" },
            { label: "Scalability", desc: "Normalised schema supports complex financial transaction trees" },
          ],
        },
      ],
    },
  },
  {
    id: 2,
    num: "02",
    icon: <Brain size={20} />,
    iconBg: "bg-pink-500/15 border-pink-500/30",
    cat: ["ml"],
    catLabel: "Machine Learning · Python · NLP",
    catColor: "text-pink-300",
    accentColor: "pink",
    title: "Ingre2Recipe",
    featured: false,
    github: "https://github.com/SankaraKrishnan12/ingre-to-recipe",
    live: null,
    desc: "NLP-based ingredient parser that tokenizes user-input ingredients and matches them against 1,000+ recipes using TF-IDF similarity scoring with a collaborative filtering recommendation layer.",
    highlights: [
      { color: "bg-pink-400",   text: "85%+ ingredient-match accuracy with TF-IDF scoring" },
      { color: "bg-violet-400", text: "Collaborative filtering for personalised recipe suggestions" },
      { color: "bg-cyan-400",   text: "Modular architecture — parse, match, recommend layers fully decoupled" },
    ],
    tech: ["Python", "TF-IDF", "NLP", "scikit-learn", "pandas", "NumPy", "Collaborative Filtering", "Flask", "React.js", "SQLite", "gensim"],
    caseStudy: {
      problem:   "Users struggle to find recipes using only what's in their kitchen.",
      approach:  "TF-IDF tokenises ingredients; collaborative filtering surfaces personalised recipes.",
      challenge: "Partial matches and misspellings required fuzzy matching logic.",
      outcome:   "85%+ accuracy on 1,000+ recipe dataset. Modular layers allow easy expansion.",
    },
    modal: {
      overview: "A machine learning-powered web application that recommends Indian recipes based on available ingredients. Supports dual ML engines (TF-IDF and Word2Vec), regional filters (North, South, East, West, Central), and diet-type filters (Veg/Non-Veg) for personalised suggestions across 1,000+ recipes.",
      sections: [
        {
          icon: Brain,
          title: "ML Engines",
          color: "text-pink-300",
          borderColor: "border-pink-500/20",
          bgColor: "bg-pink-500/8",
          items: [
            { label: "TF-IDF Vectoriser", desc: "Tokenises and scores ingredient similarity against recipe corpus" },
            { label: "Word2Vec", desc: "Semantic similarity model for ingredient relationship understanding" },
            { label: "Collaborative Filtering", desc: "Personalised suggestions based on user preference patterns" },
            { label: "Fuzzy Matching", desc: "Handles misspellings and partial ingredient names gracefully" },
          ],
        },
        {
          icon: Layers,
          title: "Tech Stack",
          color: "text-violet-300",
          borderColor: "border-violet-500/20",
          bgColor: "bg-violet-500/8",
          items: [
            { label: "Frontend", desc: "React.js with Tailwind CSS — responsive, mobile-friendly UI" },
            { label: "Backend", desc: "Flask (Python) REST API with /recommend and /recipes endpoints" },
            { label: "ML Libraries", desc: "scikit-learn, gensim, pandas, numpy" },
            { label: "Database", desc: "SQLite for recipe storage and retrieval" },
          ],
        },
        {
          icon: Zap,
          title: "Highlights",
          color: "text-cyan-300",
          borderColor: "border-cyan-500/20",
          bgColor: "bg-cyan-500/8",
          items: [
            { label: "Accuracy", desc: "85%+ ingredient-match accuracy on 1,000+ Indian recipe dataset" },
            { label: "Filters", desc: "Regional (North/South/East/West/Central) and diet (Veg/Non-Veg) filters" },
            { label: "Architecture", desc: "Fully decoupled parse → match → recommend pipeline layers" },
            { label: "Dual Engines", desc: "TF-IDF and Word2Vec used together for higher recommendation quality" },
          ],
        },
      ],
    },
  },
  {
    id: 3,
    num: "03",
    icon: <Database size={20} />,
    iconBg: "bg-amber-500/15 border-amber-500/30",
    cat: ["dbms"],
    catLabel: "DBMS · PostgreSQL · Backend",
    catColor: "text-amber-300",
    accentColor: "amber",
    title: "SpareParts Management System",
    featured: false,
    github: "https://github.com/Gogul11/SpareParts_Management_System",
    live: null,
    desc: "Database-driven inventory and order management system supporting 3 user roles with granular RBAC across 8+ relational tables and optimised JOIN queries for fast data retrieval.",
    highlights: [
      { color: "bg-amber-400",  text: "~35% faster data retrieval vs unindexed baseline" },
      { color: "bg-violet-400", text: "Granular RBAC across 8+ relational tables with referential integrity" },
      { color: "bg-cyan-400",   text: "Full CRUD for inventory, supplier records, and purchase orders" },
    ],
    tech: ["PostgreSQL", "RBAC", "SQL", "DBMS", "Node.js", "Express.js", "React", "REST API"],
    caseStudy: {
      problem:   "Manual spare parts tracking leads to inventory errors and procurement delays.",
      approach:  "Normalised PostgreSQL schema with 8+ tables and 3-role access control.",
      challenge: "Complex multi-table JOINs were slow — solved with strategic indexing.",
      outcome:   "~35% faster queries. 3-role system enforcing data integrity across all operations.",
    },
    modal: {
      overview: "A full-stack web application designed to manage spare parts inventory with role-based access for Users, Admins, and Suppliers. Users can browse and order spare parts, Admins manage inventory, users, suppliers, and categories, while Suppliers update and maintain part listings. The application ensures smooth workflow and inventory tracking through a centralised system.",
      sections: [
        {
          icon: Users,
          title: "Roles & Features",
          color: "text-amber-300",
          borderColor: "border-amber-500/20",
          bgColor: "bg-amber-500/8",
          items: [
            { label: "Users", desc: "Browse catalogue and place orders for spare parts" },
            { label: "Admins", desc: "Manage inventory, users, suppliers, and categories end-to-end" },
            { label: "Suppliers", desc: "Update and maintain part listings and pricing" },
          ],
        },
        {
          icon: Database,
          title: "Tech Stack",
          color: "text-violet-300",
          borderColor: "border-violet-500/20",
          bgColor: "bg-violet-500/8",
          items: [
            { label: "Frontend", desc: "React — dynamic UI for all 3 role dashboards" },
            { label: "Backend", desc: "Node.js + Express.js REST API layer" },
            { label: "Database", desc: "PostgreSQL with 8+ normalised relational tables" },
          ],
        },
        {
          icon: Zap,
          title: "Highlights",
          color: "text-cyan-300",
          borderColor: "border-cyan-500/20",
          bgColor: "bg-cyan-500/8",
          items: [
            { label: "Performance", desc: "~35% faster data retrieval vs unindexed baseline via strategic indexing" },
            { label: "Access Control", desc: "Granular RBAC across 8+ tables with full referential integrity" },
            { label: "CRUD Coverage", desc: "Full CRUD for inventory, supplier records, and purchase orders" },
            { label: "Real-World", desc: "Practical implementation of database systems in production scenarios" },
          ],
        },
      ],
    },
  },
  {
    id: 4,
    num: "04",
    icon: <GitBranch size={20} />,
    iconBg: "bg-cyan-500/15 border-cyan-500/30",
    cat: ["systems"],
    catLabel: "Systems · C++ · Advanced DSA",
    catColor: "text-cyan-300",
    accentColor: "cyan",
    title: "Git Graph Simulator",
    featured: false,
    github: "https://github.com/Gogul11/GIT-Simulator",
    live: "https://git-simulator-eight.vercel.app/",
    desc: "Real-time Git graph visualiser in C++ using the Crow web framework, implementing a Directed Acyclic Graph (DAG) to accurately model commit trees, branches, and merges as a live web tool.",
    highlights: [
      { color: "bg-cyan-400",   text: "DAG data structure models commit trees, branches and merges accurately" },
      { color: "bg-violet-400", text: "Live deployed interactive web tool with real-time graph updates" },
      { color: "bg-pink-400",   text: "Positive peer feedback from 20+ users improving Git intuition" },
    ],
    tech: ["C++", "Crow Framework", "DAG", "React", "Cytoscape.js", "REST API", "Vercel"],
    caseStudy: {
      problem:   "Developers struggle to visualise Git graph operations like branching and merging.",
      approach:  "C++ DAG implementation served via Crow HTTP framework as a real-time web app.",
      challenge: "Rendering DAG topology correctly for complex merge/branch scenarios in real-time.",
      outcome:   "Live deployable tool used by 20+ peers to improve Git understanding interactively.",
    },
    modal: {
      overview: "A full-stack Git branching and commit visualisation simulator aimed at helping learners understand internal Git operations interactively. The frontend, built with React and Cytoscape.js, offers a dynamic visualisation of the Git DAG (Directed Acyclic Graph), where users can create commits, form branches, switch between them, and perform merges — with colour-coded nodes in real time.",
      sections: [
        {
          icon: Code2,
          title: "Backend (C++)",
          color: "text-cyan-300",
          borderColor: "border-cyan-500/20",
          bgColor: "bg-cyan-500/8",
          items: [
            { label: "Crow Framework", desc: "C++ HTTP server handling REST API endpoints for all Git operations" },
            { label: "DAG Engine", desc: "Core Git-like logic: commit creation, parent tracking, diff storage" },
            { label: "Merge Resolution", desc: "Conflict-free merge resolution with accurate parent tracking" },
            { label: "Session Management", desc: "Unique session IDs for isolated multi-user repository environments" },
          ],
        },
        {
          icon: GitBranch,
          title: "Frontend (React)",
          color: "text-violet-300",
          borderColor: "border-violet-500/20",
          bgColor: "bg-violet-500/8",
          items: [
            { label: "Cytoscape.js", desc: "Interactive DAG visualisation with real-time graph updates" },
            { label: "Branch Operations", desc: "Dynamic branch creation, switching, and merging UI" },
            { label: "Colour-coded Nodes", desc: "Normal commits, branch heads, and merge commits visually distinct" },
            { label: "Live Deployment", desc: "Deployed on Vercel — accessible as a live interactive web tool" },
          ],
        },
        {
          icon: Package,
          title: "Highlights",
          color: "text-pink-300",
          borderColor: "border-pink-500/20",
          bgColor: "bg-pink-500/8",
          items: [
            { label: "Educational Tool", desc: "Ideal for Git beginners, CS educators, and workshop demonstrations" },
            { label: "Real-time Updates", desc: "Every commit, branch, and merge reflected instantly on the DAG" },
            { label: "Multi-user", desc: "Isolated sessions enable multiple concurrent users safely" },
            { label: "Peer Validated", desc: "Positive feedback from 20+ users improving Git intuition" },
          ],
        },
      ],
    },
  },
  {
    id: 5,
    num: "05",
    icon: <Cpu size={20} />,
    iconBg: "bg-green-500/15 border-green-500/30",
    cat: ["systems"],
    catLabel: "Systems · xv6 · OS Internals",
    catColor: "text-green-300",
    accentColor: "green",
    title: "Synchronization in xv6",
    featured: false,
    github: "https://github.com/Sithishwar/Schedulingalgo_xv6",
    live: null,
    desc: "Implemented a thread-like concurrency system in xv6 using fork() and pipe() to simulate student-teacher interaction, with custom spinlock synchronization and deep exploration of process scheduling.",
    highlights: [
      { color: "bg-green-400",  text: "Custom spinlock synchronization without pthreads — fits xv6 model" },
      { color: "bg-cyan-400",   text: "fork() + pipe() based thread simulation for IPC" },
      { color: "bg-violet-400", text: "Deep exploration of process communication and scheduling internals" },
    ],
    tech: ["C", "xv6", "fork()", "pipe()", "Spinlocks", "OS Internals", "Process Scheduling"],
    caseStudy: {
      problem:   "xv6 lacks native threading — need concurrency primitives for student-teacher simulation.",
      approach:  "Used fork() and pipe() to create thread-like behaviour; custom spinlocks for synchronization.",
      challenge: "Avoiding pthreads while building reliable synchronization within xv6's minimal kernel.",
      outcome:   "Functional concurrent simulation with custom sync primitives; deep OS scheduling insights.",
    },
    modal: {
      overview: "A systems programming project that implements thread-like concurrency within the xv6 operating system. Uses fork() and pipe() to simulate student-teacher interaction patterns, with custom spinlock synchronization built from scratch to fit xv6's minimal kernel model.",
      sections: [
        {
          icon: Cpu,
          title: "OS Internals",
          color: "text-green-300",
          borderColor: "border-green-500/20",
          bgColor: "bg-green-500/8",
          items: [
            { label: "Thread Simulation", desc: "fork() + pipe() based thread-like system for concurrent execution" },
            { label: "Custom Spinlocks", desc: "Built synchronization primitives from scratch without pthreads" },
            { label: "IPC via Pipes", desc: "Inter-process communication for student-teacher interaction model" },
          ],
        },
        {
          icon: Layers,
          title: "Tech Stack",
          color: "text-cyan-300",
          borderColor: "border-cyan-500/20",
          bgColor: "bg-cyan-500/8",
          items: [
            { label: "Language", desc: "C — low-level systems programming" },
            { label: "OS", desc: "xv6 — MIT's educational UNIX-like operating system" },
            { label: "Concurrency", desc: "Custom spinlocks, fork/pipe based process management" },
          ],
        },
        {
          icon: Zap,
          title: "Highlights",
          color: "text-violet-300",
          borderColor: "border-violet-500/20",
          bgColor: "bg-violet-500/8",
          items: [
            { label: "No pthreads", desc: "Pure xv6-compatible synchronization without external libraries" },
            { label: "Scheduling", desc: "Deep exploration of process scheduling and context switching" },
            { label: "Educational", desc: "Demonstrates OS-level concurrency concepts in a minimal kernel" },
          ],
        },
      ],
    },
  },
  {
    id: 6,
    num: "06",
    icon: <Wifi size={20} />,
    iconBg: "bg-emerald-500/15 border-emerald-500/30",
    cat: ["iot"],
    catLabel: "IoT · ESP32 · RFID",
    catColor: "text-emerald-300",
    accentColor: "green",
    title: "IoT Smart Attendance System",
    featured: false,
    github: null,
    live: null,
    desc: "IoT-based attendance system using ESP32 and MFRC522 RFID reader with real-time cloud sync to Google Sheets and Blynk mobile monitoring. Supports lecturer-controlled sessions with instant LCD and buzzer feedback.",
    highlights: [
      { color: "bg-emerald-400", text: "Real-time cloud sync via Google Sheets + Blynk IoT platform" },
      { color: "bg-cyan-400",    text: "RFID-based secure authentication with unique UID verification" },
      { color: "bg-amber-400",   text: "LCD display + buzzer feedback for instant scan confirmation" },
    ],
    tech: ["ESP32", "RFID", "MFRC522", "Google Sheets", "Blynk IoT", "C++", "Wi-Fi", "LCD Display"],
    caseStudy: {
      problem:   "Manual attendance is time-consuming, error-prone, and vulnerable to proxy attendance.",
      approach:  "ESP32 + RFID reader with cloud-connected Google Sheets and Blynk mobile dashboard.",
      challenge: "Reliable Wi-Fi connectivity and session management for concurrent RFID scans.",
      outcome:   "Automated, secure attendance with real-time cloud sync and remote mobile monitoring.",
    },
    modal: {
      overview: "An IoT-based smart attendance management system using ESP32 microcontroller and MFRC522 RFID reader. Automates attendance recording with lecturer-controlled sessions, real-time cloud sync to Google Sheets via Apps Script, and remote monitoring through the Blynk IoT mobile platform.",
      sections: [
        {
          icon: Wifi,
          title: "IoT Architecture",
          color: "text-emerald-300",
          borderColor: "border-emerald-500/20",
          bgColor: "bg-emerald-500/8",
          items: [
            { label: "ESP32", desc: "Wi-Fi enabled microcontroller handling RFID reads and cloud communication" },
            { label: "MFRC522 RFID", desc: "Reads unique UIDs from student and lecturer RFID cards" },
            { label: "LCD + Buzzer", desc: "16×2 LCD and buzzer provide instant scan feedback" },
          ],
        },
        {
          icon: Database,
          title: "Cloud Integration",
          color: "text-cyan-300",
          borderColor: "border-cyan-500/20",
          bgColor: "bg-cyan-500/8",
          items: [
            { label: "Google Sheets", desc: "Cloud-based attendance storage via Google Apps Script" },
            { label: "Blynk IoT", desc: "Remote mobile dashboard for live attendance monitoring" },
            { label: "Real-time Sync", desc: "Attendance records uploaded instantly over Wi-Fi" },
          ],
        },
        {
          icon: Zap,
          title: "Highlights",
          color: "text-amber-300",
          borderColor: "border-amber-500/20",
          bgColor: "bg-amber-500/8",
          items: [
            { label: "Session Control", desc: "Lecturer RFID card starts and ends attendance sessions" },
            { label: "Anti-Proxy", desc: "Unique UID verification prevents proxy attendance" },
            { label: "Scalable", desc: "Suitable for schools, colleges, offices, and institutions" },
          ],
        },
      ],
    },
  },
];

const FILTERS = [
  { key: "all",       label: "All Projects" },
  { key: "fullstack", label: "Full Stack"   },
  { key: "ml",        label: "ML / AI"      },
  { key: "dbms",      label: "DBMS"         },
  { key: "systems",   label: "Systems"      },
  { key: "iot",       label: "IoT"          },
];

// ── Accent colour map ─────────────────────────────────────────────
const ACCENT = {
  violet: {
    glow: "rgba(139,92,246,0.18)",
    ring: "border-violet-500/35",
    bg: "bg-violet-500/15",
    text: "text-violet-300",
    badge: "bg-violet-500/15 border-violet-500/30 text-violet-300",
    btnBg: "bg-violet-500/15 border-violet-500/30 text-violet-300 hover:bg-violet-500/25",
    blurBg: "bg-violet-500/10",
    icon: "text-violet-400",
  },
  pink: {
    glow: "rgba(236,72,153,0.18)",
    ring: "border-pink-500/35",
    bg: "bg-pink-500/15",
    text: "text-pink-300",
    badge: "bg-pink-500/15 border-pink-500/30 text-pink-300",
    btnBg: "bg-pink-500/15 border-pink-500/30 text-pink-300 hover:bg-pink-500/25",
    blurBg: "bg-pink-500/10",
    icon: "text-pink-400",
  },
  amber: {
    glow: "rgba(245,158,11,0.15)",
    ring: "border-amber-500/35",
    bg: "bg-amber-500/15",
    text: "text-amber-300",
    badge: "bg-amber-500/15 border-amber-500/30 text-amber-300",
    btnBg: "bg-amber-500/15 border-amber-500/30 text-amber-300 hover:bg-amber-500/25",
    blurBg: "bg-amber-500/10",
    icon: "text-amber-400",
  },
  cyan: {
    glow: "rgba(6,182,212,0.18)",
    ring: "border-cyan-500/35",
    bg: "bg-cyan-500/15",
    text: "text-cyan-300",
    badge: "bg-cyan-500/15 border-cyan-500/30 text-cyan-300",
    btnBg: "bg-cyan-500/15 border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/25",
    blurBg: "bg-cyan-500/10",
    icon: "text-cyan-400",
  },
  green: {
    glow: "rgba(34,197,94,0.18)",
    ring: "border-green-500/35",
    bg: "bg-green-500/15",
    text: "text-green-300",
    badge: "bg-green-500/15 border-green-500/30 text-green-300",
    btnBg: "bg-green-500/15 border-green-500/30 text-green-300 hover:bg-green-500/25",
    blurBg: "bg-green-500/10",
    icon: "text-green-400",
  },
};

// ── Project Detail Modal ──────────────────────────────────────────
const ProjectModal = ({ project, onClose }) => {
  if (!project) return null;
  const ac = ACCENT[project.accentColor] || ACCENT.violet;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6"
        style={{ backdropFilter: "blur(20px)", background: "rgba(0,0,0,0.75)" }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.88, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 30 }}
          transition={{ type: "spring", stiffness: 300, damping: 28 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto glass-card"
          style={{ scrollbarWidth: "none" }}
        >
          {/* Close */}
          <button
            onClick={onClose}
            className="sticky top-4 ml-auto mr-4 z-20 flex w-8 h-8 items-center justify-center rounded-full
              bg-white/8 border border-white/12 text-white/50
              hover:bg-white/15 hover:text-white transition-all"
            style={{ float: "right" }}
          >
            <X size={14} />
          </button>

          {/* Header */}
          <div className="relative p-8 pb-6 border-b border-white/8 overflow-hidden">
            {/* Glow orb */}
            <div
              className="absolute -top-12 -right-12 w-56 h-56 rounded-full blur-3xl pointer-events-none opacity-30"
              style={{ background: ac.glow }}
            />
            <div className="flex items-start gap-4 relative z-10">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center
                text-3xl border flex-shrink-0 ${project.iconBg}`}>
                {project.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] uppercase tracking-[2px] text-white/30 mb-1">
                  {project.num} / 04 — {project.catLabel}
                </p>
                <h2 className="text-2xl font-extrabold text-white tracking-tight leading-tight">
                  {project.title}
                </h2>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="p-8 space-y-6">

            {/* Overview */}
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[2px] text-white/25 mb-2">
                Overview
              </p>
              <p className="text-sm text-white/55 leading-relaxed">
                {project.modal.overview}
              </p>
            </div>

            {/* Stats (featured only) */}
            {project.stats && (
              <div className="grid grid-cols-4 gap-3">
                {project.stats.map(({ num, label, color }) => (
                  <div key={label}
                    className="p-4 rounded-2xl bg-white/5 border border-white/8 text-center">
                    <div className={`text-xl font-extrabold ${color}`}>{num}</div>
                    <div className="text-[9px] text-white/30 mt-1 uppercase tracking-widest leading-tight">
                      {label}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Detail sections */}
            {project.modal.sections.map((section) => {
              const SectionIcon = section.icon;
              return (
                <div key={section.title}
                  className={`p-5 rounded-2xl border ${section.bgColor} ${section.borderColor}`}>
                  <div className="flex items-center gap-2 mb-4">
                    <SectionIcon size={14} className={section.color} />
                    <p className={`text-[11px] font-bold uppercase tracking-[1.5px] ${section.color}`}>
                      {section.title}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2.5">
                    {section.items.map((item) => (
                      <div key={item.label} className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-white/20 flex-shrink-0 mt-[5px]" />
                        <p className="text-xs text-white/45 leading-relaxed">
                          <span className="text-white/65 font-semibold">{item.label}: </span>
                          {item.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}

            {/* Tech stack chips */}
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[2px] text-white/25 mb-3">
                Technology
              </p>
              <div className="flex flex-wrap gap-1.5">
                {project.tech.map((t) => (
                  <span key={t}
                    className="px-3 py-1 rounded-full text-[11px] font-mono
                      bg-white/6 border border-white/10 text-white/50">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Case study strip */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Problem",   color: "text-violet-300", text: project.caseStudy.problem   },
                { label: "Approach",  color: "text-cyan-300",   text: project.caseStudy.approach  },
                { label: "Challenge", color: "text-pink-300",   text: project.caseStudy.challenge },
                { label: "Outcome",   color: "text-green-400",  text: project.caseStudy.outcome   },
              ].map(({ label, color, text }) => (
                <div key={label}
                  className="p-3 rounded-[14px] bg-white/4 border border-white/7">
                  <p className={`text-[10px] font-semibold uppercase tracking-[1.5px] mb-1.5 ${color}`}>
                    {label}
                  </p>
                  <p className="text-[11px] text-white/40 leading-relaxed">{text}</p>
                </div>
              ))}
            </div>

            {/* Action buttons */}
            <div className="flex gap-3 pt-1">
              <motion.a
                href={project.github} target="_blank"
                whileHover={{ scale: 1.04, y: -2 }}
                className="flex items-center gap-2 px-6 py-3 rounded-full text-xs
                  font-semibold bg-white/7 border border-white/12 text-white/70
                  hover:bg-white/14 hover:text-white transition-all flex-1 justify-center"
              >
                <Github size={13}/> View on GitHub
              </motion.a>
              {project.live && (
                <motion.a
                  href={project.live} target="_blank"
                  whileHover={{ scale: 1.04, y: -2 }}
                  className={`flex items-center gap-2 px-6 py-3 rounded-full text-xs
                    font-semibold border transition-all flex-1 justify-center ${ac.btnBg}`}
                >
                  <ExternalLink size={13}/> Live Demo
                </motion.a>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

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
const FeaturedCard = ({ p, onOpenModal }) => {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="col-span-1 md:col-span-2 glass-card p-8 group cursor-pointer hover:border-white/15 transition-colors duration-300"
      onClick={() => onOpenModal(p)}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">

        {/* Left — text */}
        <div>
          <div className="flex items-start justify-between mb-5">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center
              text-2xl border ${p.iconBg}`}>
              {p.icon}
            </div>
            <span className="text-[11px] font-mono text-white/20">{p.num} / 06</span>
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

          <div className="flex gap-2 items-center" onClick={(e) => e.stopPropagation()}>
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
              onClick={(e) => { e.stopPropagation(); setOpen((o) => !o); }}
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

          {/* Click hint */}
          <div className="flex items-center justify-center gap-2 py-2 text-white/20 text-[11px]">
            <span>Click card for full details</span>
            <ExternalLink size={10}/>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// ── Regular Card ──────────────────────────────────────────────────
const ProjectCard = React.forwardRef(({ p, delay, onOpenModal }, ref) => {
  const [open, setOpen] = useState(false);
  const ac = ACCENT[p.accentColor] || ACCENT.violet;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ y: -6, boxShadow: `0 24px 60px ${ac.glow}` }}
      className="glass-card p-8 flex flex-col h-full cursor-pointer hover:border-white/15 transition-colors duration-300"
      onClick={() => onOpenModal(p)}
    >
      <div className="flex items-start justify-between mb-5">
        <div className={`w-13 h-13 rounded-2xl flex items-center justify-center
          text-2xl border ${p.iconBg}`}>
          {p.icon}
        </div>
        <span className="text-[11px] font-mono text-white/20">{p.num} / 06</span>
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

      <div className="flex gap-2 flex-wrap" onClick={(e) => e.stopPropagation()}>
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
          onClick={(e) => { e.stopPropagation(); setOpen((o) => !o); }}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs
            font-semibold bg-white/5 border border-white/10 text-white/50
            hover:bg-white/10 hover:text-white/80 transition-all ml-auto"
        >
          {open ? <ChevronUp size={12}/> : <ChevronDown size={12}/>}
          Case Study
        </motion.button>
      </div>

      {/* Click hint */}
      <p className="text-[10px] text-white/18 mt-3 text-center">Click card for full details →</p>

      <AnimatePresence>
        {open && <CaseStudy cs={p.caseStudy} />}
      </AnimatePresence>
    </motion.div>
  );
});

// ── Main Component ────────────────────────────────────────────────
const Projects = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [modal, setModal] = useState(null);
  const scrollRef = useRef(null);

  const filtered = PROJECTS.filter((p) =>
    activeFilter === "all" || p.cat.includes(activeFilter)
  );

  return (
    <>
      <div className="min-h-screen py-24 px-6">
        <div className="max-w-6xl mx-auto">

          {/* Header */}
          <motion.div {...fadeUp(0)} className="mb-6">
            <p className="text-[11px] font-semibold uppercase tracking-[3px]
              text-violet-400 mb-3">
              03 — Projects
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
              { dot: "bg-violet-500 shadow-[0_0_6px_#7c3aed]", label: "6 Projects"          },
              { dot: "bg-cyan-400   shadow-[0_0_6px_#06b6d4]", label: "Full Stack · ML · Systems · IoT" },
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

          {/* Grid — desktop / Carousel — mobile */}
          {/* Desktop grid */}
          <motion.div layout className="hidden md:grid md:grid-cols-2 gap-5">
            <AnimatePresence mode="popLayout">
              {filtered.map((p, i) =>
                p.featured ? (
                  <FeaturedCard key={p.id} p={p} onOpenModal={setModal} />
                ) : (
                  <ProjectCard key={p.id} p={p} delay={i * 0.1} onOpenModal={setModal} />
                )
              )}
            </AnimatePresence>
          </motion.div>

          {/* Mobile carousel */}
          <div className="md:hidden relative">
            <div
              ref={scrollRef}
              className="flex items-stretch gap-4 overflow-x-auto snap-x snap-mandatory pb-4 scrollbar-hide"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
            >
              {filtered.map((p, i) => (
                <div key={p.id} className="snap-center flex-shrink-0 w-[85vw] max-w-[340px]">
                  <ProjectCard p={p} delay={0} onOpenModal={setModal} />
                </div>
              ))}
            </div>
            {/* Scroll indicators */}
            <div className="flex items-center justify-center gap-3 mt-4">
              <button
                onClick={() => scrollRef.current?.scrollBy({ left: -300, behavior: 'smooth' })}
                className="w-8 h-8 rounded-full bg-white/8 border border-white/12 flex items-center justify-center text-white/50 hover:bg-white/14 hover:text-white transition-all"
                aria-label="Previous project"
              >
                <ChevronLeft size={14} />
              </button>
              <div className="flex gap-1.5">
                {filtered.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      const container = scrollRef.current;
                      if (container) {
                        const card = container.children[i];
                        card?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
                      }
                    }}
                    className="w-1.5 h-1.5 rounded-full bg-white/20 hover:bg-violet-400 transition-all"
                    aria-label={`Go to project ${i + 1}`}
                  />
                ))}
              </div>
              <button
                onClick={() => scrollRef.current?.scrollBy({ left: 300, behavior: 'smooth' })}
                className="w-8 h-8 rounded-full bg-white/8 border border-white/12 flex items-center justify-center text-white/50 hover:bg-white/14 hover:text-white transition-all"
                aria-label="Next project"
              >
                <ChevronRight size={14} />
              </button>
            </div>
            <p className="text-center text-[10px] text-white/25 mt-2">Swipe or use arrows to browse</p>
          </div>

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

      {/* Modal */}
      <AnimatePresence>
        {modal && <ProjectModal project={modal} onClose={() => setModal(null)} />}
      </AnimatePresence>
    </>
  );
};

export default Projects;