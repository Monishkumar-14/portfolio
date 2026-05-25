import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ExternalLink, CheckCircle, Shield, Cloud, Code2, Database,
  Cpu, X, ZoomIn, BadgeCheck, Calendar, Clock, Award
} from "lucide-react";

// ── Animation helpers ─────────────────────────────────────────────
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.7, delay, ease: "easeOut" },
});

// ── Google SVG Icon ───────────────────────────────────────────────
const GoogleIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

// ── NPTEL Icon ────────────────────────────────────────────────────
const NptelIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <rect width="24" height="24" rx="6" fill="#1a56db"/>
    <text x="12" y="16" textAnchor="middle" fontSize="9" fontWeight="bold" fill="white" fontFamily="monospace">IIT</text>
  </svg>
);

// ── Data ─────────────────────────────────────────────────────────
const FEATURED = {
  Icon: Shield,
  iconBg: "bg-pink-500/15 border-pink-500/30",
  glowBg: "bg-pink-500/6",
  cat: "security",
  issuer: "Google · Coursera",
  year: "2026",
  duration: "6 months",
  credentialId: "GOOG-CYBER-2024-MN14",
  title: "Google Cybersecurity Professional Certificate",
  badges: [
    { label: "Cybersecurity",  cls: "bg-pink-500/12 border-pink-500/28 text-pink-300"    },
    { label: "Professional",   cls: "bg-green-500/10 border-green-500/25 text-green-400" },
  ],
  desc: "Comprehensive cybersecurity programme covering network security, threat analysis, SIEM tools, IDS/IPS systems, and Python-based automation for security operations.",
  topics: ["Network Security","Threat Analysis","SIEM Tools","IDS / IPS","Python Automation","Security Operations"],
  link: "https://www.credly.com/badges/6e919e6f-6a0b-4592-9395-5d3f100c6750/public_url",
  IssuerIcon: GoogleIcon,
};

const CERTS = [
  {
    id: 1,
    Icon: Cloud,
    iconColor: "text-cyan-400",
    iconBg: "bg-cyan-500/12 border-cyan-500/28",
    glowColor: "rgba(6,182,212,0.15)",
    cat: "cloud",
    catLabel: "Cloud",
    catCls: "bg-cyan-500/12 border-cyan-500/28 text-cyan-300",
    ribbonCls: "bg-cyan-500/12 border-cyan-500/28 text-cyan-300",
    ribbon: "Google",
    issuer: "Google · Coursera",
    IssuerIcon: GoogleIcon,
    title: "Google Cloud Engineering Certificate",
    year: "2026",
    duration: "3 months",
    score: null,
    desc: "Covers GCP core services, compute, storage, IAM, and cloud deployment pipelines with hands-on labs.",
    topics: ["GCP Core Services","Compute Engine","Cloud Storage","IAM","Deployment Pipelines"],
    link: "https://www.credly.com/badges/27ee8a96-1ff6-4f4d-ae01-c549bf779bc6/public_url",
    verified: true,
    credentialId: "GOOG-CLOUD-2026",
  },
  {
    id: 2,
    Icon: Database,
    iconColor: "text-violet-400",
    iconBg: "bg-violet-500/12 border-violet-500/30",
    glowColor: "rgba(139,92,246,0.15)",
    cat: "ml",
    catLabel: "ML / Data",
    catCls: "bg-violet-500/15 border-violet-500/30 text-violet-300",
    ribbonCls: "bg-violet-500/15 border-violet-500/30 text-violet-300",
    ribbon: "NPTEL",
    issuer: "NPTEL · IIT",
    IssuerIcon: NptelIcon,
    title: "Python for Data Science",
    year: "Jan – Feb 2025",
    duration: "4 weeks",
    score: "85%",
    desc: "In-depth course on NumPy, pandas, data wrangling, and exploratory data analysis. Proctored exam — 85% score.",
    topics: ["NumPy","pandas","Data Wrangling","EDA"],
    link: "https://drive.google.com/file/d/1wVxKTwnPxdrnNtCPcHhTrmmD_yFcVbpU/view",
    verified: true,
    credentialId: "NPTEL-PDS-2025",
  },
  {
    id: 3,
    Icon: Code2,
    iconColor: "text-amber-400",
    iconBg: "bg-amber-500/10 border-amber-500/25",
    glowColor: "rgba(245,158,11,0.12)",
    cat: "prog",
    catLabel: "Programming",
    catCls: "bg-amber-500/12 border-amber-500/28 text-amber-300",
    ribbonCls: "bg-amber-500/12 border-amber-500/28 text-amber-300",
    ribbon: "LearnTube",
    issuer: "LearnTube",
    IssuerIcon: null,
    title: "C Programming",
    year: "19 Sep 2024",
    duration: "14 hrs · 92 lessons",
    score: null,
    desc: "Fundamentals of C programming — memory management, pointers, file I/O, and systems-level programming.",
    topics: ["Pointers","Memory Management","File I/O","Structs"],
    link: "https://drive.google.com/file/d/1pOmnnIQ8ACuKf54ty-HLzTM8okzE3qR4/view",
    verified: false,
    credentialId: null,
  },
  {
    id: 4,
    Icon: Cpu,
    iconColor: "text-green-400",
    iconBg: "bg-green-500/8 border-green-500/22",
    glowColor: "rgba(74,222,128,0.10)",
    cat: "prog",
    catLabel: "Programming",
    catCls: "bg-green-500/10 border-green-500/25 text-green-400",
    ribbonCls: "bg-green-500/10 border-green-500/25 text-green-400",
    ribbon: "LearnTube",
    issuer: "LearnTube",
    IssuerIcon: null,
    title: "C++ Programming",
    year: "9 Oct 2024",
    duration: "14 hrs · 44 lessons",
    score: null,
    desc: "Object-oriented programming in C++ — classes, inheritance, templates, STL containers, and modern C++ features.",
    topics: ["OOP","Templates","STL","Inheritance"],
    link: "https://drive.google.com/file/d/1daO30aJMh5N9UymBAPAEpps_ZrOP1GBj/view",
    verified: false,
    credentialId: null,
  },
  {
    id: 5,
    Icon: Database,
    iconColor: "text-amber-400",
    iconBg: "bg-amber-500/10 border-amber-500/25",
    glowColor: "rgba(245,158,11,0.12)",
    cat: "dsa",
    catLabel: "DSA",
    catCls: "bg-amber-500/12 border-amber-500/28 text-amber-300",
    ribbonCls: "bg-amber-500/12 border-amber-500/28 text-amber-300",
    ribbon: "LearnTube",
    issuer: "LearnTube",
    IssuerIcon: null,
    title: "Data Structures & Algorithms",
    year: "30 Oct 2024",
    duration: "14 hrs · 87 lessons",
    score: null,
    desc: "Comprehensive DSA course covering arrays, linked lists, trees, graphs, sorting algorithms, and dynamic programming.",
    topics: ["Arrays & Trees","Graphs","Dynamic Programming","Sorting"],
    link: "https://drive.google.com/file/d/11Xbe_RsxWUyrEDMovmKWcqNd2yAv_54z/view",
    verified: false,
    credentialId: null,
  },
];

const FILTERS = [
  { key: "all",      label: "All"          },
  { key: "cloud",    label: "Cloud"        },
  { key: "security", label: "Security"     },
  { key: "ml",       label: "ML / Data"   },
  { key: "dsa",      label: "DSA"         },
  { key: "prog",     label: "Programming" },
];

// ── Modal ─────────────────────────────────────────────────────────
const Modal = ({ cert, onClose }) => {
  if (!cert) return null;
  const { Icon, iconColor, title, issuer, year, credentialId, desc, topics, score, duration, verified } = cert;
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-6"
        style={{ backdropFilter: "blur(16px)", background: "rgba(0,0,0,0.7)" }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.88, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", stiffness: 320, damping: 28 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-lg glass-card overflow-hidden"
        >
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-1.5 rounded-full
              bg-white/8 border border-white/12 text-white/50
              hover:bg-white/15 hover:text-white transition-all"
          >
            <X size={14} />
          </button>

          {/* Header band */}
          <div className="relative bg-gradient-to-br from-white/5 to-white/0
            border-b border-white/8 p-8 pb-6 overflow-hidden">
            <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full
              opacity-[0.04] blur-2xl bg-violet-400" />
            <div className="flex items-start gap-4">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center
                border flex-shrink-0 ${cert.iconBg}`}>
                <Icon size={26} className={iconColor} />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[2px] text-white/30 mb-1">
                  Certificate Details
                </p>
                <h3 className="text-lg font-extrabold text-white leading-snug tracking-tight">
                  {title}
                </h3>
                <p className="text-xs text-white/40 mt-1">{issuer}</p>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="p-8 space-y-5">
            {/* Meta row */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { Icon: Calendar, label: "Issued", value: year },
                { Icon: Clock,    label: "Duration", value: duration || "—" },
                { Icon: Award,    label: "Score", value: score || "Completed" },
              ].map(({ Icon: MI, label, value }) => (
                <div key={label}
                  className="flex flex-col items-center p-3 rounded-xl
                    bg-white/4 border border-white/8 text-center gap-1">
                  <MI size={13} className="text-white/30" />
                  <p className="text-[9px] uppercase tracking-widest text-white/25">{label}</p>
                  <p className="text-xs font-bold text-white/70">{value}</p>
                </div>
              ))}
            </div>

            {/* Score highlight */}
            {score && (
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl
                bg-green-500/10 border border-green-500/25">
                <Award size={15} className="text-green-400" />
                <span className="text-sm font-bold text-green-400">
                  Proctored Exam Score: {score}
                </span>
              </div>
            )}

            {/* Credential ID */}
            {credentialId && (
              <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl
                bg-white/4 border border-white/8">
                <BadgeCheck size={14} className="text-violet-400 flex-shrink-0" />
                <div>
                  <p className="text-[9px] uppercase tracking-widest text-white/25">Credential ID</p>
                  <p className="text-xs font-mono text-white/60 mt-0.5">{credentialId}</p>
                </div>
              </div>
            )}

            {/* Description */}
            <p className="text-sm text-white/45 leading-relaxed">{desc}</p>

            {/* Topics */}
            <div className="flex flex-wrap gap-1.5">
              {topics.map((t) => (
                <span key={t}
                  className="px-2.5 py-1 rounded-full text-[10px]
                    bg-white/5 border border-white/9 text-white/40">
                  {t}
                </span>
              ))}
            </div>

            {/* Verified status */}
            <div className={`flex items-center gap-2 px-4 py-2.5 rounded-xl
              border text-xs font-semibold
              ${verified
                ? "bg-green-500/10 border-green-500/25 text-green-400"
                : "bg-white/5 border-white/10 text-white/35"
              }`}>
              {verified
                ? <><CheckCircle size={13}/> Verified Credential — Issued by {issuer}</>
                : <><ExternalLink size={13}/> Certificate available on platform</>
              }
            </div>

            {/* CTA */}
            <motion.a
              href={cert.link} target="_blank"
              whileHover={{ scale: 1.03 }}
              className="flex items-center justify-center gap-2 w-full py-3
                rounded-xl text-xs font-bold border transition-all
                bg-violet-500/15 border-violet-500/30 text-violet-300
                hover:bg-violet-500/25"
            >
              <ExternalLink size={13}/> View Certificate on Platform
            </motion.a>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// ── Certificate Card ──────────────────────────────────────────────
const CertCard = ({ c, delay, onClick }) => {
  const { Icon, iconColor, iconBg, glowColor } = c;

  return (
    <motion.div
      layout
      key={c.id}
      initial={{ opacity: 0, y: 30, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -8, boxShadow: `0 24px 60px ${glowColor || "rgba(139,92,246,0.1)"}` }}
      onClick={() => onClick(c)}
      className="relative glass-card p-7 flex flex-col overflow-hidden cursor-pointer
        transition-all duration-300 group hover:border-white/15"
    >
      {/* Corner ribbon */}
      <span className={`absolute top-4 right-4 px-3 py-1 rounded-full text-[10px]
        font-bold border ${c.ribbonCls}`}>
        {c.ribbon}
      </span>

      {/* Hover glow bg */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-[inherit]"
        style={{ background: `radial-gradient(circle at 30% 30%, ${glowColor || "rgba(139,92,246,0.08)"}, transparent 70%)` }}
      />

      {/* Icon */}
      <div className={`w-12 h-12 rounded-[16px] flex items-center justify-center
        mb-4 border transition-all duration-300 group-hover:scale-110 ${iconBg}`}>
        <Icon size={22} className={iconColor} />
      </div>

      {/* Issuer */}
      <div className="flex items-center gap-1.5 mb-2">
        {c.IssuerIcon
          ? <c.IssuerIcon size={13} />
          : <span className="w-3 h-3 rounded-full bg-white/20 inline-block" />
        }
        <span className="text-[11px] text-white/40 font-medium">{c.issuer}</span>
      </div>

      {/* Title */}
      <h3 className="text-[16px] font-extrabold text-white mb-1 leading-snug tracking-tight">
        {c.title}
      </h3>

      {/* Year + Duration */}
      <div className="flex items-center gap-3 mb-3">
        <span className="text-[11px] font-mono text-white/25">{c.year}</span>
        {c.duration && (
          <span className="flex items-center gap-1 text-[10px] text-white/25">
            <Clock size={9} /> {c.duration}
          </span>
        )}
      </div>

      {/* Score pill */}
      {c.score && (
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl
          text-sm font-extrabold bg-green-500/15 border border-green-500/30
          text-green-400 mb-3 w-fit">
          <Award size={13} /> Score: {c.score}
        </div>
      )}

      {/* Category badge */}
      <div className="flex flex-wrap gap-2 mb-3">
        <span className={`px-3 py-1 rounded-full text-[10px] font-semibold border ${c.catCls}`}>
          {c.catLabel}
        </span>
      </div>

      {/* Desc */}
      <p className="text-xs text-white/40 leading-relaxed mb-4 flex-1">{c.desc}</p>

      {/* Topics */}
      <div className="flex flex-wrap gap-1.5 mb-5">
        {c.topics.map((t) => (
          <span key={t}
            className="px-2.5 py-1 rounded-full text-[10px] bg-white/5
              border border-white/9 text-white/35">
            {t}
          </span>
        ))}
      </div>

      {/* Verify button */}
      <motion.button
        whileHover={{ scale: 1.04, y: -2 }}
        onClick={(e) => { e.stopPropagation(); window.open(c.link, "_blank"); }}
        className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full
          text-xs font-semibold border transition-all w-fit
          ${c.verified
            ? "bg-green-500/10 border-green-500/25 text-green-400 hover:bg-green-500/20"
            : "bg-white/6 border-white/12 text-white/50 hover:bg-white/12 hover:text-white"
          }`}
      >
        {c.verified
          ? <><BadgeCheck size={11}/> Verify Certificate</>
          : <><ExternalLink size={11}/> Verify Certificate</>
        }
      </motion.button>

      {/* Zoom hint on hover */}
      <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-40
        transition-opacity duration-300">
        <ZoomIn size={12} className="text-white/60" />
      </div>
    </motion.div>
  );
};

// ── Main Component ────────────────────────────────────────────────
const Certificates = () => {
  const [active, setActive] = useState("all");
  const [modal, setModal]   = useState(null);

  const showFeatured = active === "all" || active === FEATURED.cat;
  const filtered     = CERTS.filter((c) => active === "all" || c.cat === active);
  const resultCount  = filtered.length + (showFeatured ? 1 : 0);

  return (
    <>
      <div className="min-h-screen py-24 px-6">
        <div className="max-w-6xl mx-auto">

          {/* ── Header ── */}
          <motion.div {...fadeUp(0)} className="mb-5">
            <p className="text-[11px] font-semibold uppercase tracking-[3px]
              text-violet-400 mb-3">
              04 — Certifications
            </p>
            <h2 className="text-5xl md:text-6xl font-extrabold tracking-tight
              leading-tight mb-4">
              What I've{" "}
              <span className="bg-gradient-to-r from-violet-400 via-cyan-400
                to-pink-400 bg-clip-text text-transparent">
                Earned
              </span>
            </h2>
            <p className="text-sm text-white/40 leading-relaxed max-w-lg">
              Industry-recognised certifications from Google, NPTEL and LearnTube
              covering Cloud, Cybersecurity, ML, and Programming.
            </p>
          </motion.div>

          {/* ── Stats Strip ── */}
          <motion.div {...fadeUp(0.08)} className="flex flex-wrap gap-3 mb-8">
            {[
              { dot: "bg-violet-500 shadow-[0_0_6px_#7c3aed]", label: "6 Certifications"            },
              { dot: "bg-cyan-400   shadow-[0_0_6px_#06b6d4]", label: "Google · NPTEL · LearnTube"  },
              { dot: "bg-pink-400   shadow-[0_0_6px_#ec4899]", label: "Cloud · Security · ML · DSA" },
              { dot: "bg-green-400  shadow-[0_0_6px_#4ade80]", label: "All Verifiable · 2024–2026"  },
            ].map(({ dot, label }) => (
              <span key={label}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full
                  text-xs font-medium bg-white/5 border border-white/9 text-white/50">
                <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dot}`}/>
                {label}
              </span>
            ))}
          </motion.div>

          {/* ── Filter bar + Result count ── */}
          <motion.div {...fadeUp(0.12)} className="flex flex-wrap items-center
            justify-between gap-3 mb-10">
            <div className="flex flex-wrap gap-2">
              {FILTERS.map(({ key, label }) => (
                <motion.button
                  key={key}
                  whileTap={{ scale: 0.94 }}
                  onClick={() => setActive(key)}
                  className={`px-5 py-2 rounded-full text-xs font-semibold
                    transition-all duration-200 border
                    ${active === key
                      ? "bg-violet-500/20 border-violet-500/40 text-violet-300"
                      : "bg-white/6 border-white/10 text-white/45 hover:bg-white/11 hover:text-white"
                    }`}
                >
                  {label}
                </motion.button>
              ))}
            </div>

            {/* Live result count */}
            <AnimatePresence mode="wait">
              <motion.span
                key={resultCount}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.2 }}
                className="text-[11px] text-white/30 font-mono px-3 py-1.5
                  rounded-full bg-white/4 border border-white/8"
              >
                Showing {resultCount} result{resultCount !== 1 ? "s" : ""}
              </motion.span>
            </AnimatePresence>
          </motion.div>

          {/* ── Featured Card ── */}
          <AnimatePresence>
            {showFeatured && (() => {
              const FI = FEATURED.Icon;
              const FIssuerIcon = FEATURED.IssuerIcon;
              return (
                <motion.div
                  key="featured"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  whileHover={{ y: -4 }}
                  className="glass-card mb-5 overflow-hidden cursor-pointer
                    hover:border-white/15 transition-colors duration-300"
                  onClick={() => setModal({
                    Icon: FEATURED.Icon,
                    iconColor: "text-pink-400",
                    iconBg: FEATURED.iconBg,
                    glowColor: "rgba(236,72,153,0.15)",
                    title: FEATURED.title,
                    issuer: FEATURED.issuer,
                    year: "20 Mar 2026",
                    duration: FEATURED.duration,
                    credentialId: FEATURED.credentialId,
                    desc: FEATURED.desc,
                    topics: FEATURED.topics,
                    score: null,
                    verified: true,
                    link: FEATURED.link,
                  })}
                >
                  <div className="grid grid-cols-1 md:grid-cols-[1fr_300px]">

                    {/* Left */}
                    <div className="p-9">
                      <div className="flex items-center gap-3 mb-6">
                        <div className={`w-11 h-11 rounded-[14px] flex items-center
                          justify-center border ${FEATURED.iconBg}`}>
                          <FI size={22} className="text-pink-400" />
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-[2px]
                            text-white/30 font-semibold">
                            Featured Certificate
                          </p>
                          <p className="text-xs text-white/40 mt-0.5">
                            {FEATURED.issuer} · 20 Mar 2026
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {FEATURED.badges.map(({ label, cls }) => (
                          <span key={label}
                            className={`px-3 py-1 rounded-full text-[10px]
                              font-semibold border ${cls}`}>
                            {label}
                          </span>
                        ))}
                      </div>

                      <h3 className="text-2xl font-extrabold text-white mb-3
                        tracking-tight leading-tight">
                        {FEATURED.title}
                      </h3>
                      <p className="text-sm text-white/45 leading-relaxed mb-4">
                        {FEATURED.desc}
                      </p>

                      {/* Meta info */}
                      <div className="flex flex-wrap gap-4 mb-5 text-xs text-white/35">
                        <span className="flex items-center gap-1.5">
                          <Clock size={11}/> Duration: {FEATURED.duration}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <BadgeCheck size={11} className="text-violet-400"/>
                          <span className="font-mono text-white/30">{FEATURED.credentialId}</span>
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-1.5 mb-6">
                        {FEATURED.topics.map((t) => (
                          <span key={t}
                            className="px-3 py-1 rounded-full text-[10px]
                              bg-white/5 border border-white/9 text-white/38">
                            {t}
                          </span>
                        ))}
                      </div>

                      <motion.a
                        href={FEATURED.link} target="_blank"
                        whileHover={{ scale: 1.04, y: -2 }}
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-2 px-6 py-2.5
                          rounded-full text-xs font-semibold
                          bg-green-500/10 border border-green-500/25
                          text-green-400 hover:bg-green-500/20 transition-all"
                      >
                        <BadgeCheck size={13}/> Verify Certificate
                      </motion.a>
                    </div>

                    {/* Right — seal panel */}
                    <div className={`flex items-center justify-center relative
                      border-t md:border-t-0 md:border-l border-white/7 p-10
                      ${FEATURED.glowBg}`}>
                      {/* Background glow */}
                      <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2
                          -translate-y-1/2 w-40 h-40 rounded-full
                          bg-pink-500/10 blur-3xl" />
                      </div>
                      {/* Large bg icon */}
                      <div className="absolute text-pink-500/5 pointer-events-none select-none">
                        <FI size={120} />
                      </div>

                      <div className="relative z-10 flex flex-col items-center gap-4">
                        {/* Google issuer icon */}
                        <div className="flex items-center gap-2 mb-1">
                          <FIssuerIcon size={20} />
                          <span className="text-base font-extrabold text-white/80">Google</span>
                        </div>

                        {/* Seal */}
                        <div className="w-24 h-24 rounded-full flex items-center
                          justify-center border-2 border-pink-500/35
                          bg-pink-500/15 shadow-[0_0_40px_rgba(236,72,153,0.25)]">
                          <FI size={40} className="text-pink-400" />
                        </div>

                        {/* Issued label */}
                        <div className="text-center">
                          <p className="text-[10px] text-white/30 uppercase tracking-widest">
                            Issued by
                          </p>
                          <p className="text-sm font-bold text-pink-400 mt-0.5">Google · Coursera</p>
                          <p className="text-[11px] text-white/30 mt-0.5">
                            20 March 2026
                          </p>
                        </div>

                        {/* Credential ID */}
                        <div className="flex flex-col items-center gap-1 px-4 py-2
                          rounded-xl bg-white/5 border border-white/8 text-center">
                          <p className="text-[9px] uppercase tracking-widest text-white/25">
                            Credential ID
                          </p>
                          <p className="text-[10px] font-mono text-white/40">
                            {FEATURED.credentialId}
                          </p>
                        </div>

                        {/* Verified badge */}
                        <div className="flex items-center gap-1.5 px-4 py-1.5
                          rounded-full bg-green-500/12 border border-green-500/25
                          text-green-400 text-xs font-bold">
                          <CheckCircle size={12}/> Verified Credential
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })()}
          </AnimatePresence>

          {/* ── Certs Grid ── */}
          <motion.div layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence>
              {filtered.map((c, i) => (
                <CertCard key={c.id} c={c} delay={i * 0.07} onClick={setModal} />
              ))}
            </AnimatePresence>
          </motion.div>

          {/* ── Footer Note ── */}
          <motion.div {...fadeUp(0.3)} className="mt-12 text-center">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full
              bg-white/4 border border-white/8">
              <BadgeCheck size={13} className="text-violet-400" />
              <p className="text-xs text-white/35">
                All certifications are verifiable via official platforms
                <span className="text-white/20 mx-1.5">·</span>
                <span className="text-violet-400/70">Credly</span>
                <span className="text-white/20 mx-1.5">·</span>
                <span className="text-violet-400/70">NPTEL</span>
                <span className="text-white/20 mx-1.5">·</span>
                NPTEL scores are proctored exam results
              </p>
            </div>
          </motion.div>

        </div>
      </div>

      {/* ── Modal ── */}
      <AnimatePresence>
        {modal && <Modal cert={modal} onClose={() => setModal(null)} />}
      </AnimatePresence>
    </>
  );
};

export default Certificates;