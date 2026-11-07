// src/components/AppDownload.jsx
// Terminal-OS styled /app download page for the portfolio Android app
import { motion } from "framer-motion";
import { Download, Smartphone, Shield, Zap, Globe, Star, ArrowLeft, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: "easeOut" },
});

const features = [
  { icon: Zap,    label: "Fast & Lightweight",  desc: "Optimized for smooth performance on all Android devices" },
  { icon: Globe,  label: "Offline Access",       desc: "Browse projects and experience without internet connection" },
  { icon: Shield, label: "Safe & Secure",        desc: "No ads, no tracking, no unnecessary permissions" },
  { icon: Star,   label: "Native Experience",    desc: "Smooth animations and native Android UI elements" },
];

const AppDownload = () => {
  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        background: "var(--bg-main, #191919)",
        color: "var(--text-primary, #F0F2F4)",
      }}
    >
      {/* Subtle ambient glows */}
      <div className="absolute w-[500px] h-[500px] rounded-full blur-[150px] -top-32 -right-32"
        style={{ background: "rgba(255, 107, 53, 0.04)" }} />
      <div className="absolute w-[400px] h-[400px] rounded-full blur-[120px] bottom-0 -left-20"
        style={{ background: "rgba(77, 141, 255, 0.03)" }} />
      <div className="absolute w-[300px] h-[300px] rounded-full blur-[100px] top-1/2 left-1/3"
        style={{ background: "rgba(24, 201, 139, 0.03)" }} />

      {/* Back button */}
      <div className="relative z-10 px-6 pt-6">
        <Link to="/">
          <motion.div
            whileHover={{ x: -4 }}
            className="inline-flex items-center gap-2 text-sm transition-colors"
            style={{
              color: "var(--text-faint, #9299A4)",
              fontFamily: "var(--font-mono)",
            }}
          >
            <ArrowLeft size={16} /> cd ~/portfolio
          </motion.div>
        </Link>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-16 md:py-24">

        {/* ── Hero Section ── */}
        <div className="text-center mb-16">
          {/* App icon */}
          <motion.div {...fadeUp(0)} className="flex justify-center mb-8">
            <div
              className="w-24 h-24 md:w-28 md:h-28 rounded-[28px] flex items-center justify-center"
              style={{
                background: "rgba(255, 107, 53, 0.1)",
                border: "1px solid rgba(255, 107, 53, 0.25)",
                boxShadow: "0 0 80px rgba(255, 107, 53, 0.15), 0 0 30px rgba(255, 107, 53, 0.1)",
              }}
            >
              <span
                className="text-4xl md:text-5xl font-extrabold"
                style={{
                  color: "var(--primary-accent, #FF6B35)",
                  fontFamily: "var(--font-mono)",
                }}
              >
                M
              </span>
            </div>
          </motion.div>

          <motion.div {...fadeUp(0.1)}>
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-6"
              style={{
                background: "rgba(24, 201, 139, 0.08)",
                border: "1px solid rgba(24, 201, 139, 0.2)",
                color: "var(--success-accent, #18C98B)",
                fontFamily: "var(--font-mono)",
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full animate-pulse"
                style={{ background: "var(--success-accent, #18C98B)" }} />
              Android App Available
            </div>
          </motion.div>

          <motion.h1 {...fadeUp(0.15)}
            className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight mb-4"
          >
            Monish's Portfolio{" "}
            <span style={{ color: "var(--primary-accent, #FF6B35)" }}>
              App
            </span>
          </motion.h1>

          <motion.p {...fadeUp(0.2)}
            className="text-base md:text-lg leading-relaxed max-w-xl mx-auto mb-10"
            style={{ color: "var(--text-faint, #9299A4)" }}
          >
            Get my full portfolio as a native Android app. Browse projects,
            experience, and certifications — all in one place.
          </motion.p>

          {/* Download CTA */}
          <motion.div {...fadeUp(0.3)} className="flex flex-col items-center gap-4">
            <motion.a
              href="https://github.com/Monishkumar-14/portfolio/releases/download/v1.0/MonishPortfolio.apk"
              download="MonishPortfolio.apk"
              whileHover={{ scale: 1.04, boxShadow: "0 0 30px rgba(255, 107, 53, 0.4)" }}
              whileTap={{ scale: 0.96 }}
              className="inline-flex items-center gap-3 px-10 py-4 rounded-2xl text-base font-bold text-white transition-shadow"
              style={{
                background: "var(--primary-accent, #FF6B35)",
                boxShadow: "0 8px 32px rgba(255, 107, 53, 0.3)",
              }}
            >
              <Download size={20} />
              Download APK
            </motion.a>

            <p className="text-xs" style={{ color: "var(--text-ultra-faint, rgba(255,255,255,0.2))", fontFamily: "var(--font-mono)" }}>
              Android only · ~104 MB · v1.0
            </p>
          </motion.div>
        </div>

        {/* ── Features Grid ── */}
        <motion.div {...fadeUp(0.4)} className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-16">
          {features.map(({ icon: Icon, label, desc }, i) => (
            <motion.div
              key={label}
              whileHover={{ y: -4, borderColor: "rgba(255, 107, 53, 0.25)" }}
              className="p-5 rounded-2xl transition-all duration-200"
              style={{
                border: "1px solid var(--divider, rgba(255,255,255,0.08))",
                background: "var(--bg-card, rgba(255,255,255,0.02))",
              }}
            >
              <div className="flex items-start gap-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{
                    background: "rgba(255, 107, 53, 0.08)",
                    border: "1px solid rgba(255, 107, 53, 0.18)",
                  }}
                >
                  <Icon size={18} style={{ color: "var(--primary-accent, #FF6B35)" }} />
                </div>
                <div>
                  <h3 className="text-sm font-bold mb-1" style={{ color: "var(--text-primary, #F0F2F4)" }}>{label}</h3>
                  <p className="text-xs leading-relaxed" style={{ color: "var(--text-faint, #9299A4)" }}>{desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* ── Installation Steps ── */}
        <motion.div {...fadeUp(0.5)} className="mb-16">
          <h2 className="text-xl font-bold text-center mb-8" style={{ color: "var(--text-secondary, #B9BEC7)" }}>
            <span style={{ color: "var(--primary-accent, #FF6B35)", fontFamily: "var(--font-mono)" }}>$ </span>
            How to Install
          </h2>
          <div className="flex flex-col md:flex-row gap-4 md:gap-6 justify-center">
            {[
              { step: "1", title: "Download", desc: "Tap the download button above" },
              { step: "2", title: "Allow Install", desc: "Enable 'Install from unknown sources' if prompted" },
              { step: "3", title: "Open APK", desc: "Tap the downloaded file to install" },
            ].map(({ step, title, desc }) => (
              <div key={step} className="flex items-center gap-4 md:flex-col md:items-center md:text-center">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                  style={{
                    background: "rgba(255, 107, 53, 0.1)",
                    border: "1px solid rgba(255, 107, 53, 0.2)",
                    color: "var(--primary-accent, #FF6B35)",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  {step}
                </div>
                <div>
                  <p className="text-sm font-bold" style={{ color: "var(--text-primary, #F0F2F4)" }}>{title}</p>
                  <p className="text-xs" style={{ color: "var(--text-faint, #9299A4)" }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── App Details Card ── */}
        <motion.div {...fadeUp(0.6)}
          className="p-6 rounded-2xl"
          style={{
            border: "1px solid var(--divider, rgba(255,255,255,0.08))",
            background: "var(--bg-card, rgba(255,255,255,0.02))",
          }}
        >
          <h3
            className="text-sm font-bold uppercase tracking-widest mb-4"
            style={{ color: "var(--text-faint, #9299A4)", fontFamily: "var(--font-mono)" }}
          >
            App Details
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Platform", value: "Android" },
              { label: "Size", value: "~104 MB" },
              { label: "Version", value: "1.0.0" },
              { label: "Developer", value: "Monishkumar E M" },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-[10px] uppercase tracking-wider mb-0.5"
                  style={{ color: "var(--text-ultra-faint, rgba(255,255,255,0.2))", fontFamily: "var(--font-mono)" }}>
                  {label}
                </p>
                <p className="text-sm font-semibold" style={{ color: "var(--text-secondary, #B9BEC7)" }}>{value}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div {...fadeUp(0.7)} className="text-center mt-12">
          <p className="text-[10px] uppercase tracking-[2px]"
            style={{ color: "rgba(255,255,255,0.12)", fontFamily: "var(--font-mono)" }}>
            monish.dev
          </p>
        </motion.div>

      </div>
    </div>
  );
};

export default AppDownload;
