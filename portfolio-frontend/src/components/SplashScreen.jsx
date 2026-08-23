// src/components/SplashScreen.jsx
// Branded "M" loading animation — max 1.5s, optimized for iOS
import { useEffect } from "react";
import { motion } from "framer-motion";

const SplashScreen = ({ onComplete }) => {
  // Hard timeout — ensure splash never blocks for more than 1.5s
  useEffect(() => {
    const timer = setTimeout(() => onComplete(), 1500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{
        background: "linear-gradient(135deg, #020014 0%, #0a0a2e 50%, #050012 100%)",
      }}
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 0.4, delay: 1.1, ease: "easeInOut" }}
      onAnimationComplete={onComplete}
    >
      {/* Ambient glow — reduced blur for iOS */}
      <div className="absolute w-[250px] h-[250px] rounded-full bg-violet-500/10 blur-[60px]" />

      <div className="flex flex-col items-center gap-5">
        {/* Animated "M" */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
        >
          <div className="w-18 h-18 rounded-2xl bg-gradient-to-br from-violet-500/20 to-cyan-500/10
            border border-violet-500/30 flex items-center justify-center
            shadow-[0_0_40px_rgba(124,58,237,0.25)]"
          >
            <span className="text-3xl font-extrabold bg-gradient-to-r from-violet-400 via-cyan-400 to-pink-400
              bg-clip-text text-transparent">
              M
            </span>
          </div>
        </motion.div>

        {/* Text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.3 }}
          className="text-sm font-semibold text-white/70 tracking-wide"
        >
          Monish<span className="text-violet-400">.</span>
        </motion.p>

        {/* Progress bar */}
        <motion.div className="w-28 h-[2px] rounded-full bg-white/8 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-violet-400 via-cyan-400 to-pink-400 rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 1.0, delay: 0.1, ease: "easeInOut" }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default SplashScreen;
