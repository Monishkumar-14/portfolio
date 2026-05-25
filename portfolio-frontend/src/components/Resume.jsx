import { useState } from "react";
import { motion } from "framer-motion";
import { Download, Eye, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.7, delay, ease: "easeOut" },
});

// ── Update this to your actual PDF path ──────────────────────────
const RESUME_URL = "/Monishkumar_Resume.pdf";

const Resume = () => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError]   = useState(false);

  return (
    <div className="min-h-screen py-24 px-6">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <motion.div {...fadeUp(0)} className="mb-14">
          <p className="text-[11px] font-semibold uppercase tracking-[3px] text-violet-400 mb-3">
            05 — Resume
          </p>
          <h2 className="text-5xl md:text-6xl font-extrabold tracking-tight leading-tight mb-4">
            My{" "}
            <span className="bg-gradient-to-r from-violet-400 via-cyan-400 to-pink-400 bg-clip-text text-transparent">
              Resume
            </span>
          </h2>
          <p className="text-sm text-white/40 leading-relaxed max-w-lg">
            A snapshot of my experience, skills, and projects.
          </p>
        </motion.div>

        {/* PDF Viewer Card */}
        <motion.div {...fadeUp(0.1)} className="glass-card overflow-hidden">

          {/* Toolbar */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/8 bg-white/3">
            {/* File info */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-[10px] bg-violet-500/20 border border-violet-500/30 flex items-center justify-center text-sm">
                📄
              </div>
              <div>
                <p className="text-sm font-bold text-white/85">Monishkumar_Resume.pdf</p>
                <p className="text-[10px] text-white/35 mt-0.5">Full-Stack Developer · 2026</p>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2">
              <motion.a
                href={RESUME_URL}
                target="_blank"
                rel="noreferrer"
                whileHover={{ scale: 1.05, y: -1 }}
                whileTap={{ scale: 0.96 }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold bg-white/6 border border-white/12 text-white/60 hover:bg-white/12 hover:text-white transition-all"
              >
                <Eye size={13} /> Preview
              </motion.a>
              <motion.a
                href={RESUME_URL}
                download="Monishkumar_Resume.pdf"
                whileHover={{ scale: 1.05, y: -1 }}
                whileTap={{ scale: 0.96 }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold btn-primary-glass"
              >
                <Download size={13} /> Download
              </motion.a>
              <motion.a
                href="https://linkedin.com/in/monish-kumar-b55774291"
                target="_blank"
                rel="noreferrer"
                whileHover={{ scale: 1.05, y: -1 }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold bg-blue-500/12 border border-blue-500/25 text-blue-300 hover:bg-blue-500/20 transition-all"
              >
                <ExternalLink size={13} /> LinkedIn
              </motion.a>
            </div>
          </div>

          {/* PDF Embed Area */}
          <div className="relative bg-[#1a1a2e] pdf-viewer-bg flex items-center justify-center"
               style={{ minHeight: "780px" }}>

            {/* Loading shimmer */}
            {!loaded && !error && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 z-10 pointer-events-none">
                <div className="w-12 h-12 rounded-2xl bg-violet-500/20 border border-violet-500/30 flex items-center justify-center">
                  <motion.div
                    className="w-5 h-5 border-2 border-violet-400/40 border-t-violet-400 rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
                  />
                </div>
                <p className="text-xs text-white/30">Loading resume…</p>
              </div>
            )}

            {/* Fallback if PDF can't embed */}
            {error && (
              <div className="flex flex-col items-center justify-center gap-5 py-24 px-8 text-center">
                <div className="w-16 h-16 rounded-2xl bg-amber-500/12 border border-amber-500/25 flex items-center justify-center text-3xl">
                  📄
                </div>
                <div>
                  <p className="text-base font-bold text-white/70 mb-1">PDF Preview Unavailable</p>
                  <p className="text-xs text-white/35 max-w-xs">
                    Your browser blocked the inline preview. Use the buttons above to open or download the resume.
                  </p>
                </div>
                <div className="flex gap-3">
                  <motion.a
                    href={RESUME_URL}
                    target="_blank"
                    rel="noreferrer"
                    whileHover={{ scale: 1.04 }}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold btn-primary-glass"
                  >
                    <Eye size={14} /> Open PDF
                  </motion.a>
                  <motion.a
                    href={RESUME_URL}
                    download="Monishkumar_Resume.pdf"
                    whileHover={{ scale: 1.04 }}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold btn-sec-glass"
                  >
                    <Download size={14} /> Download
                  </motion.a>
                </div>
              </div>
            )}

            {/* The actual PDF embed */}
            {!error && (
              <iframe
                src={`${RESUME_URL}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
                title="Monishkumar Resume"
                className="w-full transition-opacity duration-500"
                style={{
                  height: "780px",
                  border: "none",
                  opacity: loaded ? 1 : 0,
                  background: "transparent",
                }}
                onLoad={() => setLoaded(true)}
                onError={() => setError(true)}
              />
            )}
          </div>

          {/* Bottom hint */}
          <div className="px-6 py-3 border-t border-white/6 bg-white/2 flex items-center justify-between">
            <p className="text-[10px] text-white/20">
              Scroll inside the viewer to see the full resume
            </p>
            <p className="text-[10px] text-white/20">PDF · 1 page · A4</p>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default Resume;