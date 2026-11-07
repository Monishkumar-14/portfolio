import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  MapPin, Calendar, Clock, ChevronDown, ExternalLink, Download, FileText, Database,
  BrainCircuit, GitCommit, GitBranch, ArrowRight, GraduationCap, Code2, Rocket,
  Briefcase, Hourglass, BookOpen,
} from "lucide-react";
import "./Sections.css";
import "./Experience.css";

const AZLogo = ({ size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 95.4 115.5" fill="none">
    <path
      fill="#f9b000"
      d="M48.1,81.3c-1,.7-2,1.3-3,2-11.7-6.5-37-19.1-39.2-20.2-2.3-1.2-6.4-2.8-5.9-6.7.7-5.5,10.2-17.4,14.2-22.3C36,7.4,45.7-.8,52.2,0c6.9.9,10.7,8,11.2,41.4-3.8-1.2-8.1-2.4-12.6-3.5-.4-4.8-1.3-12.2-1.6-14.7-.4-2.9-.9-3.9-2.1-4.1-1.3-.2-4.5,2.9-7.3,5.8-1.3,1.3-5,5.1-9.1,9.2-3.4-.2-5.7.5-7,2.2-1,1.3-1.2,3.2-.6,5.5l-5.3,5.3c-4.5,4.5-9.3,8.3-9.6,10.1-.2,1.5,2.1,3,5.4,5,8,4.8,27.6,15.4,34.6,19.1M78.7,48c-7.7-2.7-26.7-9.7-46.7-12.4-6.9-.9-9.7,1.5-6.8,8.1s10,17.3,17.6,25.5,15.8,10.3,18.4-2.2c0-.4.2-.9.3-1.3.6-3,1.1-6,1.3-9.1-3.4-1.5-7.1-3.2-10.9-4.8.2,2.9.5,7.8.7,11.7,0,.5,0,1,0,1.4.2,6.2-1.9,6.2-5.4,3.6-4.1-2.9-16.7-19.5-18.1-26.8,0-.5.2-.5.4-.4h.3c2.8,1.2,12.3,5,21.9,9,3.8,1.6,7.7,3.3,11.1,4.8s6.4,3,8.7,4.2c4.1,2.2,5.8,3.7,4,5.5-8.6,8.8-38.8,21.2-49.2,36.6v.2c-.2.2-.4.3-.5.5,0,0,0,.1,0,.2-.8,1.4-1.3,3-1.5,4.6-.4,3.4,1.3,6.4,6.1,7.8,1.3.4,2.7.6,4.1.8.3,0,.6,0,.8,0,9.3.4,33.4-4.8,40.7-8.1,7.6-3.4,5.3-6.7,3.1-8.5-1.6-1.3-10.1-6-14.2-8.3l-3,1.9c3.9,2.3,7.7,4.9,11.4,7.6.6.5.3,1.1-.7,1.1h-.7c-6.6.5-19.2,1.4-25,1.7-.9,0-1.8,0-2.4.1,1.2-1.1,2.5-2.2,3.9-3.2,12.6-8.8,33.6-21.3,39.7-26.6,4.6-3.9,17-16-9.8-25.3"
    />
  </svg>
);


/* ─────────────────────────────────────────────────────────────
   Timeline data. Order = top → bottom (chronological).
   Cards alternate left/right automatically.
   Only facts from your source files / brief; no invented stats.
   ───────────────────────────────────────────────────────────── */
const KINDS = {
  education: { label: "Education", Icon: GraduationCap },
  learning: { label: "Technical development", Icon: Code2 },
  projects: { label: "Projects", Icon: Rocket },
  industry: { label: "Professional internship", Icon: Briefcase },
  upcoming: { label: "Upcoming milestone", Icon: Hourglass },
};

const LETTER = "/Internship Completion letter- Monishkumar E M.pdf";

const MILESTONES = [
  {
    id: "init_2023", kind: "education", branch: "education",
    date: "Aug 2023 – Present", dateTime: "2023-08",
    title: "B.Tech Information Technology",
    org: "College of Engineering, Guindy — Anna University", orgShort: "CEG · Anna University",
    description:
      "Started my undergraduate journey in Information Technology, building a foundation in programming, computer science, problem-solving and software development.",
    chips: ["Programming", "Computer Science", "Problem Solving", "Software Development"],
    footer: [
      { icon: GraduationCap, text: "4-year B.Tech programme" },
      { icon: BookOpen, text: "CGPA 8.2 / 10", tone: "ok" },
    ],
  },
  {
    id: "foundations_2024", kind: "learning", branch: "learning",
    date: "2024", dateTime: "2024",
    title: "Building Technical Foundations",
    orgShort: "CEG · Anna University",
    description:
      "Developed core programming and computer science knowledge through coursework, practical assignments and technical exploration.",
    chips: ["Python", "Java", "C++", "SQL"],
    footer: [{ icon: BookOpen, text: "Coursework · assignments · exploration" }],
  },
  {
    id: "projects_2025", kind: "projects", branch: "projects",
    date: "2025", dateTime: "2025",
    title: "Software Development & AI/ML Projects",
    orgShort: "Portfolio projects",
    description:
      "Applied my technical knowledge to practical projects involving full-stack development, databases, backend systems and machine learning.",
    chips: ["React", "Node.js", "FastAPI", "PostgreSQL", "Machine Learning"],
    footer: [{ icon: Rocket, text: "See the Projects section", href: "#projects" }],
  },
  {
    id: "astrazeneca_2026", kind: "industry", branch: "industry", featured: true,
    date: "18 May 2026 – 17 Jul 2026", dateTime: "2026-05-18",
    title: "AstraZeneca India Pvt. Ltd.",
    orgShort: "AstraZeneca · Chennai",
    department: "GITC · Enterprise Technology Solutions (ETS)",
    role: "Junior Data Analyst Intern",
    meta: [
      { icon: MapPin, text: "Chennai, India" },
      { icon: Calendar, text: "18 May – 17 Jul 2026" },
      { icon: Clock, text: "2 months" },
    ],
    description:
      "Worked with the Enterprise Technology Solutions team on enterprise AI and data intelligence solutions, including an internal document assistant using Retrieval-Augmented Generation and an enterprise data analytics platform for ServiceNow data.",
    blocks: [
      {
        icon: BrainCircuit, title: "Enterprise RAG Assistant",
        points: [
          "Developed an AI-powered assistant for querying internal enterprise documents.",
          "Worked with document ingestion, retrieval and LLM-based response generation.",
        ],
      },
      {
        icon: Database, title: "Enterprise Data Intelligence Platform",
        points: [
          "Processed ServiceNow CSV exports.",
          "Used data processing and database workflows.",
          "Implemented natural-language-to-SQL queries.",
          "Presented analytical insights as text and visual outputs.",
        ],
      },
    ],
    breakdown: [
      { title: "Document ingestion", detail: "Parsed internal documents — extracted clean text and split it into semantically meaningful chunks." },
      { title: "Vector embedding & indexing", detail: "Generated dense embeddings and stored them in a vector database for fast similarity search." },
      { title: "Retrieval pipeline", detail: "Top-k most relevant chunks retrieved using cosine similarity." },
      { title: "LLM-powered generation", detail: "Retrieved context injected into prompts sent to an LLM for grounded responses." },
      { title: "Chatbot interface", detail: "Conversational UI for ETS department employees to query the knowledge base." },
    ],
    chips: ["RAG", "LangChain", "Qdrant", "Python", "Ollama", "FastAPI", "PostgreSQL", "NLP", "NL2SQL"],
    actions: [
      { label: "Download Letter", icon: Download, href: LETTER, download: true },
      { label: "View PDF", icon: ExternalLink, href: LETTER, external: true, ghost: true },
    ],
  },
  {
    id: "graduation_2027", kind: "upcoming", branch: "next", upcoming: true,
    date: "Expected May 2027", dateTime: "2027-05",
    title: "B.Tech Graduation — Expected",
    org: "College of Engineering, Guindy — Anna University", orgShort: "CEG · Anna University",
    description:
      "Expected completion of my undergraduate degree in Information Technology at College of Engineering, Guindy, Anna University.",
    footer: [{ icon: Hourglass, text: "Upcoming — not yet completed", tone: "warn" }],
  },
];

const scrollToHash = (e, href) => {
  if (!href?.startsWith("#")) return;
  const el = document.querySelector(href);
  if (el) { e.preventDefault(); el.scrollIntoView({ behavior: "smooth" }); }
};

const Breakdown = ({ steps }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="tl-break">
      <button type="button" className="tl-break__btn" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
        <span><FileText size={13} aria-hidden="true" /> RAG technical breakdown</span>
        <ChevronDown size={15} aria-hidden="true" style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform .25s" }} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.ol
            className="tl-break__list"
            initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }} style={{ overflow: "hidden" }}
          >
            {steps.map((s, i) => (
              <li key={s.title}>
                <span className="tl-break__n">{String(i + 1).padStart(2, "0")}</span>
                <div><p className="tl-break__t">{s.title}</p><p className="tl-break__d">{s.detail}</p></div>
              </li>
            ))}
          </motion.ol>
        )}
      </AnimatePresence>
    </div>
  );
};

const TimelineCard = ({ m }) => {
  const { label: kindLabel, Icon: KindIcon } = KINDS[m.kind];
  return (
    <article className="tl-card" aria-label={`${m.title} — ${kindLabel}`}>
      <header className="tl-card__head">
        <span className="tl-card__hash">{m.id}</span>
        <span className="tl-card__branch">HEAD <ArrowRight size={12} aria-hidden="true" /> {m.branch}</span>
        <span className="tl-card__org">{m.orgShort}</span>
      </header>

      <div className="tl-card__body">
        <span className={`tl-kind${m.upcoming ? " tl-kind--upcoming" : ""}`}><KindIcon size={13} aria-hidden="true" />{kindLabel}</span>

        {m.featured ? (
          <>
            <div className="tl-az">
              <div className="tl-az__logo"><AZLogo size={34} /></div>
              <div>
                <h3 className="tl-az__org">{m.title}</h3>
                <p className="tl-az__dept">{m.department}</p>
              </div>
            </div>
            <ul className="tl-meta">
              {m.meta.map(({ icon: I, text }) => <li key={text}><I size={11} aria-hidden="true" />{text}</li>)}
            </ul>
            <p className="tl-role">Role</p>
            <p className="tl-role-name"><span>{m.role}</span></p>
          </>
        ) : (
          <h3 className="tl-card__title">
            {m.title}
            {m.org && <span className="tl-card__at"> @ {m.org}</span>}
          </h3>
        )}

        <p className="tl-card__desc">{m.description}</p>

        {m.blocks && (
          <div className="tl-blocks">
            {m.blocks.map(({ icon: I, title, points }) => (
              <section key={title} className="tl-block">
                <h4 className="tl-block__head"><span className="tl-block__icon"><I size={15} aria-hidden="true" /></span>{title}</h4>
                <ul>{points.map((p) => <li key={p}>{p}</li>)}</ul>
              </section>
            ))}
          </div>
        )}

        {m.breakdown && <Breakdown steps={m.breakdown} />}

        {m.chips && (
          <ul className="tl-chips" aria-label="Technologies and topics">
            {m.chips.map((c) => <li key={c} className="tl-chip">{c}</li>)}
          </ul>
        )}
      </div>

      {(m.footer || m.actions) && (
        <footer className="tl-card__foot">
          {m.featured && <span className="tl-foot"><GitCommit size={13} aria-hidden="true" /> AstraZeneca · ETS · Chennai</span>}
          {m.footer?.map(({ icon: I, text, tone, href }) =>
            href ? (
              <a key={text} href={href} className="tl-foot" onClick={(e) => scrollToHash(e, href)}><I size={13} aria-hidden="true" />{text}</a>
            ) : (
              <span key={text} className={`tl-foot${tone ? ` tl-foot--${tone}` : ""}`}><I size={13} aria-hidden="true" />{text}</span>
            )
          )}
          {m.actions && (
            <span className="tl-btns">
              {m.actions.map(({ label, icon: I, href, download, external, ghost }) => (
                <a key={label} href={encodeURI(href)} className={`tl-btn${ghost ? " tl-btn--ghost" : ""}`}
                  {...(download ? { download: true } : {})} {...(external ? { target: "_blank", rel: "noreferrer" } : {})}>
                  <I size={12} aria-hidden="true" /> {label}
                </a>
              ))}
            </span>
          )}
        </footer>
      )}
    </article>
  );
};

const Experience = () => {
  const reduce = useReducedMotion();
  return (
    <section id="experience" className="sect exp" aria-labelledby="exp-title">
      <div className="sect__bg" aria-hidden="true" />
      <div className="sect__inner">
        <motion.h2
          id="exp-title" className="sect__title"
          initial={{ opacity: 0, y: reduce ? 0 : 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
        >
          <span className="sect__icon"><GitBranch size={34} aria-hidden="true" /></span>$ git log --stat --oneline
        </motion.h2>
        <p className="exp__sub">Engineering Journey — from starting B.Tech IT at CEG in 2023 to an AstraZeneca internship in 2026 and expected graduation in 2027.</p>

        <div className="exp__start" aria-hidden="true">
          <span className="exp__pill"><GitCommit size={15} /> Initial Commit (Hello World)</span>
        </div>

        <div className="exp__track">
          <div className="exp__line" aria-hidden="true" />
          <ol className="exp__list">
            {MILESTONES.map((m, i) => (
              <motion.li
                key={m.id}
                className={`tl ${i % 2 === 0 ? "is-left" : "is-right"}${m.upcoming ? " tl--upcoming" : ""}`}
                initial={{ opacity: 0, y: reduce ? 0 : 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.55, ease: "easeOut" }}
              >
                <span className="tl-marker" aria-hidden="true" />
                <time className="tl-date" dateTime={m.dateTime}><Calendar size={15} aria-hidden="true" />{m.date}</time>
                <TimelineCard m={m} />
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
};

export default Experience;