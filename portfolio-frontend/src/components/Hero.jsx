import { motion } from "framer-motion";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.7, delay, ease: "easeOut" },
});

const stats = [
  { num: "10+", label: "Projects"       },
  { num: "6+",   label: "Certifications" },
  { num: "3+",  label: "Years Experience"},
  { num: "15+", label: "GitHub Repos"   },
];

const trust = [
  "Built real-world projects",
  "Experienced in Full-Stack + AI",
  "Open to internships & roles",
];

const Hero = () => (
  <div className="min-h-screen flex items-center justify-center px-6 pt-24 pb-16">
    <div className="max-w-3xl w-full text-center">

      {/* ── Status badge ── */}
      <motion.div {...fadeUp(0)} className="inline-flex items-center gap-2 px-5 py-2 rounded-full
        bg-violet-500/15 border border-violet-500/30 text-violet-300 text-sm font-medium mb-9"
      >
        <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse shadow-[0_0_8px_#7c3aed]" />
        Open to Full-Time Roles · Chennai / Remote
      </motion.div>

      {/* ── Primary headline ── */}
      <motion.h2 {...fadeUp(0.1)}
        className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight mb-3"
      >
        Building{" "}
        <span className="grad-text animate-[gradShift_4s_linear_infinite]">
          Scalable Full-Stack Systems
        </span>
        {" "}& AI Solutions
      </motion.h2>

      {/* ── Name (secondary) ── */}
      <motion.h1 {...fadeUp(0.2)}
        className="text-7xl md:text-8xl font-extrabold tracking-tighter leading-none mb-5"
        style={{ letterSpacing: "-3px" }}
      >
        Hi, I'm <span className="grad-text">Monish</span>
      </motion.h1>

      {/* ── Subtitle ── */}
      <motion.p {...fadeUp(0.3)} className="text-[15px] text-white/70 mb-5 leading-relaxed max-w-xl mx-auto">
        <span className="text-white font-semibold">Full-Stack Engineer</span> specializing in
        scalable APIs, system design &amp; AI integration
      </motion.p>

      {/* ── Description ── */}
      <motion.p {...fadeUp(0.4)}
        className="text-sm text-white/55 leading-relaxed max-w-lg mx-auto mb-10"
      >
        I build high-performance web applications with clean architecture,
        scalable backend systems, and intelligent AI-powered features.
      </motion.p>

      {/* ── CTA buttons ── */}
      <motion.div {...fadeUp(0.5)} className="flex gap-3 justify-center flex-wrap mb-7">
        <motion.button
          whileHover={{ scale: 1.04, boxShadow: "0 0 22px rgba(124,58,237,0.55)" }}
          whileTap={{ scale: 0.96 }}
          onClick={() => document.querySelector("#projects")?.scrollIntoView({ behavior: "smooth" })}
          className="btn-primary-glass px-8 py-3.5 text-sm font-semibold"
        >
          Explore My Work ↓
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.04, boxShadow: "0 0 16px rgba(255,255,255,0.08)" }}
          whileTap={{ scale: 0.96 }}
          onClick={() => window.open("/Monishkumar_Resume.pdf", "_blank")}
          className="btn-sec-glass px-8 py-3.5 text-sm font-semibold"
        >
          View Resume
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.04, boxShadow: "0 0 16px rgba(167,139,250,0.25)" }}
          whileTap={{ scale: 0.96 }}
          onClick={() => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })}
          className="px-8 py-3.5 text-sm font-semibold rounded-xl border border-violet-400/35
            text-violet-300 hover:bg-violet-400/10 transition-colors"
        >
          Contact Me
        </motion.button>
      </motion.div>

      {/* ── Trust signals ── */}
      <motion.div {...fadeUp(0.6)}
        className="flex gap-5 justify-center flex-wrap mb-14"
      >
        {trust.map((t) => (
          <span key={t} className="flex items-center gap-1.5 text-xs text-white/60 font-medium">
            <span className="text-emerald-400">✔</span> {t}
          </span>
        ))}
      </motion.div>

      {/* ── Stats row ── */}
      <motion.div {...fadeUp(0.7)} className="flex flex-wrap justify-center gap-3">
        {stats.map(({ num, label }) => (
          <motion.div
            key={label}
            whileHover={{ scale: 1.06, y: -4, borderColor: "rgba(167,139,250,0.4)" }}
            className="glass px-7 py-4 rounded-2xl text-center min-w-[115px]
              border border-white/[0.07] hover:shadow-[0_8px_32px_rgba(124,58,237,0.15)]
              transition-shadow"
          >
            <div className="text-2xl font-bold grad-text">{num}</div>
            <div className="text-[10px] text-white/40 mt-1 uppercase tracking-widest">{label}</div>
          </motion.div>
        ))}
      </motion.div>

    </div>
  </div>
);

export default Hero;