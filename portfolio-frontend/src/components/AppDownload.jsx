// src/components/AppDownload.jsx
// Premium /app download page for the portfolio Android app
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
        background: "linear-gradient(135deg, #020014 0%, #0a0a2e 50%, #050012 100%)",
        color: "#f1f5f9",
      }}
    >
      {/* Ambient glow orbs */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-violet-500/8 blur-[150px] -top-32 -right-32" />
      <div className="absolute w-[400px] h-[400px] rounded-full bg-cyan-500/6 blur-[120px] bottom-0 -left-20" />
      <div className="absolute w-[300px] h-[300px] rounded-full bg-pink-500/5 blur-[100px] top-1/2 left-1/3" />

      {/* Back button */}
      <div className="relative z-10 px-6 pt-6">
        <Link to="/">
          <motion.div
            whileHover={{ x: -4 }}
            className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white/80 transition-colors"
          >
            <ArrowLeft size={16} /> Back to Portfolio
          </motion.div>
        </Link>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-16 md:py-24">

        {/* ── Hero Section ── */}
        <div className="text-center mb-16">
          {/* App icon */}
          <motion.div {...fadeUp(0)} className="flex justify-center mb-8">
            <div className="w-24 h-24 md:w-28 md:h-28 rounded-[28px] bg-gradient-to-br from-violet-500/25 to-cyan-500/15
              border border-violet-500/30 flex items-center justify-center
              shadow-[0_0_80px_rgba(124,58,237,0.3),_0_0_30px_rgba(124,58,237,0.2)]"
            >
              <span className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-violet-400 via-cyan-400 to-pink-400
                bg-clip-text text-transparent">
                M
              </span>
            </div>
          </motion.div>

          <motion.div {...fadeUp(0.1)}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full
              bg-emerald-500/12 border border-emerald-500/25 text-emerald-400 text-xs font-semibold mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Android App Available
            </div>
          </motion.div>

          <motion.h1 {...fadeUp(0.15)}
            className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight mb-4"
          >
            Monish's Portfolio{" "}
            <span className="bg-gradient-to-r from-violet-400 via-cyan-400 to-pink-400 bg-clip-text text-transparent">
              App
            </span>
          </motion.h1>

          <motion.p {...fadeUp(0.2)}
            className="text-base md:text-lg text-white/50 leading-relaxed max-w-xl mx-auto mb-10"
          >
            Get my full portfolio as a native Android app. Browse projects,
            experience, and certifications — all in one place.
          </motion.p>

          {/* Download CTA */}
          <motion.div {...fadeUp(0.3)} className="flex flex-col items-center gap-4">
            <motion.a
              href="https://github.com/Monishkumar-14/portfolio/releases/download/v1.0/MonishPortfolio.apk"
              download="MonishPortfolio.apk"
              whileHover={{ scale: 1.04, boxShadow: "0 0 30px rgba(124,58,237,0.5)" }}
              whileTap={{ scale: 0.96 }}
              className="inline-flex items-center gap-3 px-10 py-4 rounded-2xl text-base font-bold
                bg-gradient-to-r from-violet-600 to-violet-500 text-white
                shadow-[0_8px_32px_rgba(124,58,237,0.4)]
                hover:shadow-[0_12px_40px_rgba(124,58,237,0.5)]
                transition-shadow"
            >
              <Download size={20} />
              Download APK
            </motion.a>

            <p className="text-xs text-white/30">
              Android only · ~104 MB · v1.0
            </p>
          </motion.div>
        </div>

        {/* ── Features Grid ── */}
        <motion.div {...fadeUp(0.4)} className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-16">
          {features.map(({ icon: Icon, label, desc }, i) => (
            <motion.div
              key={label}
              whileHover={{ y: -4, borderColor: "rgba(167,139,250,0.3)" }}
              className="p-5 rounded-2xl border border-white/8 bg-white/[0.03]
                backdrop-blur-sm transition-all duration-200"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-violet-500/12 border border-violet-500/25
                  flex items-center justify-center flex-shrink-0">
                  <Icon size={18} className="text-violet-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white/85 mb-1">{label}</h3>
                  <p className="text-xs text-white/40 leading-relaxed">{desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* ── Installation Steps ── */}
        <motion.div {...fadeUp(0.5)} className="mb-16">
          <h2 className="text-xl font-bold text-white/80 text-center mb-8">
            How to Install
          </h2>
          <div className="flex flex-col md:flex-row gap-4 md:gap-6 justify-center">
            {[
              { step: "1", title: "Download", desc: "Tap the download button above" },
              { step: "2", title: "Allow Install", desc: "Enable 'Install from unknown sources' if prompted" },
              { step: "3", title: "Open APK", desc: "Tap the downloaded file to install" },
            ].map(({ step, title, desc }) => (
              <div key={step} className="flex items-center gap-4 md:flex-col md:items-center md:text-center">
                <div className="w-10 h-10 rounded-full bg-violet-500/15 border border-violet-500/30
                  flex items-center justify-center text-sm font-bold text-violet-400 flex-shrink-0">
                  {step}
                </div>
                <div>
                  <p className="text-sm font-bold text-white/75">{title}</p>
                  <p className="text-xs text-white/40">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── App Details Card ── */}
        <motion.div {...fadeUp(0.6)}
          className="p-6 rounded-2xl border border-white/8 bg-white/[0.03] backdrop-blur-sm"
        >
          <h3 className="text-sm font-bold text-white/60 uppercase tracking-widest mb-4">App Details</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Platform", value: "Android" },
              { label: "Size", value: "~104 MB" },
              { label: "Version", value: "1.0.0" },
              { label: "Developer", value: "Monishkumar E M" },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-[10px] text-white/30 uppercase tracking-wider mb-0.5">{label}</p>
                <p className="text-sm font-semibold text-white/70">{value}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div {...fadeUp(0.7)} className="text-center mt-12">
          <p className="text-[10px] text-white/20 uppercase tracking-[2px]">
            monishdev.online
          </p>
        </motion.div>

      </div>
    </div>
  );
};

export default AppDownload;
