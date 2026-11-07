import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  Github, ChevronDown, Play, Eye, Terminal, ExternalLink,
} from "lucide-react";
import "./Hero.css";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, delay, ease: "easeOut" },
});

const LOADED_MODULES = ["React", "Node.js", "Python", "PostgreSQL", "FastAPI", "AI/ML"];

// Intro copy. Swap in the longer B.Tech / CEG paragraph here if you prefer it.
const INTRO_TEXT =
  "Specializing in scalable full-stack applications, backend systems, and AI-powered solutions.";

const scrollToSection = (selector) =>
  document.querySelector(selector)?.scrollIntoView({ behavior: "smooth" });

/* ═══════════════════════════════════════════════════════════
   Initialize OS — interaction logic unchanged
   ═══════════════════════════════════════════════════════════ */
const InitializeComponent = () => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("Initializing...");
  const [started, setStarted] = useState(false);
  const intervalRef = useRef(null);

  const handleInit = () => {
    if (started && progress >= 100) {
      scrollToSection("#projects");
      return;
    }
    setStarted(true);
    setProgress(0);
    setStatus("Loading...");
    intervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(intervalRef.current);
          setStatus("Complete");
          setTimeout(() => scrollToSection("#about"), 400);
          return 100;
        }
        return prev + 4;
      });
    }, 50);
  };

  useEffect(() => {
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  const done = started && progress >= 100;

  return (
    <button type="button" onClick={handleInit} className="hero-cut hero-init" aria-label="Initialize Portfolio">
      <span className="hero-cut__face">
        <span className="hero-init__icon"><Terminal size={20} /></span>
        <span className="hero-init__body">
          <span className="hero-init__top">
            <span className="hero-init__title">Initialize OS</span>
            <ExternalLink size={13} className="hero-init__ext" aria-hidden="true" />
          </span>
          <span className="hero-init__bar" style={{ display: "block" }}>
            <span className="hero-init__fill" style={{ display: "block", width: `${started ? progress : 0}%` }} />
          </span>
          <span className="hero-init__meta">
            <span className="hero-init__cmd">$ sudo boot_gui</span>
            <span className={`hero-init__status${done ? " is-done" : ""}`}>{started ? status : "Loading ..."}</span>
          </span>
        </span>
      </span>
    </button>
  );
};

/* ═══════════════════════════════════════════════════════════
   GitHub
   ═══════════════════════════════════════════════════════════ */
const GitHubComponent = () => (
  <a href="https://github.com/Monishkumar-14" target="_blank" rel="noopener noreferrer" className="hero-cut hero-gh">
    <span className="hero-cut__face">
      <Github size={26} className="hero-gh__icon" aria-hidden="true" />
      <span>
        <span className="hero-gh__label">Check out</span>
        <span className="hero-gh__name">GitHub</span>
      </span>
    </span>
  </a>
);

/* ═══════════════════════════════════════════════════════════
   Code editor — word-by-word typewriter reveal
   `indent` is the nesting level (1.5em each, as in the reference).
   ═══════════════════════════════════════════════════════════ */
const CODE_LINES = [
  { indent: 0, tokens: [{ text: "// Welcome to Monish's workspace", cls: "syntax-comment" }] },
  { indent: 0, tokens: [
    { text: "import", cls: "syntax-keyword" }, { text: " " },
    { text: "{", cls: "syntax-punctuation" }, { text: " " },
    { text: "Developer", cls: "syntax-variable" }, { text: " " },
    { text: "}", cls: "syntax-punctuation" }, { text: " " },
    { text: "from", cls: "syntax-keyword" }, { text: " " },
    { text: "'@monish/core'", cls: "syntax-string" },
    { text: ";", cls: "syntax-punctuation" },
  ]},
  { indent: 0, tokens: [] },
  { indent: 0, tokens: [
    { text: "const", cls: "syntax-keyword" }, { text: " " },
    { text: "Portfolio", cls: "syntax-function" }, { text: " " },
    { text: "=", cls: "syntax-operator" }, { text: " " },
    { text: "()", cls: "syntax-paren" }, { text: " " },
    { text: "=>", cls: "syntax-operator" }, { text: " " },
    { text: "{", cls: "syntax-punctuation" },
  ]},
  { indent: 1, tokens: [
    { text: "return", cls: "syntax-keyword" }, { text: " " },
    { text: "(", cls: "syntax-punctuation" },
  ]},
  { indent: 2, tokens: [
    { text: "<", cls: "syntax-tag" },
    { text: "Developer", cls: "syntax-jsx" },
  ]},
  { indent: 3, tokens: [
    { text: "name", cls: "syntax-attr" }, { text: "=", cls: "syntax-operator" },
    { text: '"Monishkumar E M"', cls: "syntax-string syntax-strong" },
  ]},
  { indent: 3, tokens: [
    { text: "role", cls: "syntax-attr" }, { text: "=", cls: "syntax-operator" },
    { text: '"Full-Stack Engineer"', cls: "syntax-string" },
  ]},
  { indent: 3, tokens: [
    { text: "passion", cls: "syntax-attr" }, { text: "=", cls: "syntax-operator" },
    { text: '"AI & Systems"', cls: "syntax-string" },
  ]},
  { indent: 2, tokens: [{ text: "/>", cls: "syntax-tag" }] },
  { indent: 1, tokens: [{ text: ")", cls: "syntax-punctuation" }, { text: ";", cls: "syntax-punctuation" }] },
  { indent: 0, tokens: [{ text: "}", cls: "syntax-punctuation" }, { text: ";", cls: "syntax-punctuation" }] },
];

// A "word" = any non-whitespace token; a blank line counts as one step.
const TOTAL_WORDS = CODE_LINES.reduce(
  (n, l) => n + (l.tokens.length === 0 ? 1 : l.tokens.filter((t) => t.text.trim()).length),
  0
);
const WORD_DELAY_MS = 110;
const START_DELAY_MS = 500;

const CodeEditorPanel = () => {
  const reduceMotion =
    typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  const [visible, setVisible] = useState(reduceMotion ? TOTAL_WORDS : 0);

  useEffect(() => {
    if (reduceMotion) return undefined;
    let interval;
    const start = setTimeout(() => {
      interval = setInterval(() => {
        setVisible((v) => {
          if (v >= TOTAL_WORDS) { clearInterval(interval); return v; }
          return v + 1;
        });
      }, WORD_DELAY_MS);
    }, START_DELAY_MS);
    return () => { clearTimeout(start); clearInterval(interval); };
  }, [reduceMotion]);

  const typing = visible < TOTAL_WORDS;

  const renderCode = () => {
    let idx = 0;
    return CODE_LINES.map((line, i) => {
      const style = { "--indent": line.indent };
      if (line.tokens.length === 0) {
        idx++;
        return <div key={i} className="hero-code__line" style={style}>{" "}</div>;
      }
      return (
        <div key={i} className="hero-code__line" style={style}>
          {line.tokens.map((tok, t) => {
            if (!tok.text.trim()) return <span key={t}>{tok.text}</span>;
            idx++;
            const shown = idx <= visible;
            return (
              <React.Fragment key={t}>
                <span className={`hero-code__tok ${tok.cls || ""}${shown ? "" : " is-hidden"}`}>{tok.text}</span>
                {typing && idx === visible && <span className="hero-caret" aria-hidden="true" />}
              </React.Fragment>
            );
          })}
        </div>
      );
    });
  };

  return (
    <div className="hero-editor">
      <div className="hero-editor__bar">
        <div className="hero-editor__dots" aria-hidden="true">
          <i style={{ background: "#FF5F56" }} />
          <i style={{ background: "#FFBD2E" }} />
          <i style={{ background: "#27C93F" }} />
        </div>
        <div className="hero-editor__title"><i aria-hidden="true" />portfolio.tsx</div>
      </div>

      <div className="hero-code">
        <div className="hero-code__nums" aria-hidden="true">
          {CODE_LINES.map((_, n) => <div key={n}>{n + 1}</div>)}
        </div>
        <pre className="hero-code__lines" style={{ margin: 0, font: "inherit" }} aria-label="portfolio.tsx source code">
          {renderCode()}
        </pre>
      </div>

      <div className="hero-editor__actions">
        <button type="button" onClick={() => scrollToSection("#about")} className="hero-btn hero-btn--primary">
          <Play size={16} aria-hidden="true" /> Run Profile
        </button>
        <button type="button" onClick={() => scrollToSection("#projects")} className="hero-btn hero-btn--ghost">
          <Eye size={16} aria-hidden="true" /> View Projects
        </button>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   Hero
   ═══════════════════════════════════════════════════════════ */
const Hero = () => (
  <section className="hero" aria-label="Introduction">
    <div className="hero__label" aria-hidden="true">{"<System.Init />"}</div>

    <div className="hero__inner">
      {/* LEFT COLUMN */}
      <motion.div {...fadeUp(0)} className="hero__left">
        <div className="hero__badge">
          <span className="hero__badge-dot" />
          SYSTEM.KERNEL :: v2.5.0 ONLINE
        </div>

        <h1 className="hero__title">
          Hello, I'm
          <br />
          <span className="hero__name">Monishkumar E M</span>
        </h1>

        <p className="hero__role">
          <span className="hero__tag">{"<Full-Stack Engineer />"}</span>
          <span className="hero__tagline">Engineering Scalable Systems.</span>
        </p>

        <p className="hero__intro">{INTRO_TEXT}</p>

        <div className="hero__ctas">
          <InitializeComponent />
          <GitHubComponent />
        </div>

        <div className="hero__modules">
          <span className="hero__modules-label">LOADED_MODULES:</span>
          {LOADED_MODULES.map((mod) => (
            <span key={mod} className="hero__chip">{mod}</span>
          ))}
        </div>

        <div className="hero__faint" aria-hidden="true">while(alive) {"{ code() }"}</div>
      </motion.div>

      {/* RIGHT COLUMN */}
      <motion.div {...fadeUp(0.15)} className="hero__right">
        <CodeEditorPanel />
      </motion.div>
    </div>

    {/* Scroll cue */}
    <motion.button
      type="button"
      className="hero__scroll"
      aria-label="Scroll to about section"
      onClick={() => scrollToSection("#about")}
      animate={{ y: [0, 6, 0] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
    >
      <ChevronDown size={26} strokeWidth={2.5} />
    </motion.button>
  </section>
);

export default Hero;