// src/components/SplashScreen.jsx
// Branded "M" loading animation — shows for ~1.8s on first load
import { motion } from "framer-motion";

const SplashScreen = ({ onComplete }) => {
  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{
        background: "linear-gradient(135deg, #020014 0%, #0a0a2e 50%, #050012 100%)",
      }}
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 0.5, delay: 1.6, ease: "easeInOut" }}
      onAnimationComplete={onComplete}
    >
      {/* Ambient glow */}
      <div className="absolute w-[300px] h-[300px] rounded-full bg-violet-500/10 blur-[100px]" />
      <div className="absolute w-[200px] h-[200px] rounded-full bg-cyan-500/8 blur-[80px] translate-x-20 -translate-y-10" />

      <div className="flex flex-col items-center gap-6">
        {/* Animated "M" */}
        <motion.div
          initial={{ scale: 0, rotate: -180, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{
            duration: 0.8,
            ease: [0.16, 1, 0.3, 1], // custom spring-like ease
          }}
          className="relative"
        >
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500/20 to-cyan-500/10
            border border-violet-500/30 flex items-center justify-center
            shadow-[0_0_60px_rgba(124,58,237,0.3)]"
          >
            <motion.span
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-3xl font-extrabold bg-gradient-to-r from-violet-400 via-cyan-400 to-pink-400
                bg-clip-text text-transparent"
            >
              M
            </motion.span>
          </div>

          {/* Orbiting dot */}
          <motion.div
            className="absolute w-2 h-2 rounded-full bg-violet-400 shadow-[0_0_12px_rgba(124,58,237,0.6)]"
            style={{ top: -4, left: "50%", marginLeft: -4 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, ease: "linear", repeat: 1 }}
          />
        </motion.div>

        {/* Text */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="text-center"
        >
          <p className="text-sm font-semibold text-white/70 tracking-wide">
            Monish<span className="text-violet-400">.</span>
          </p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.4 }}
            className="text-[10px] text-white/30 uppercase tracking-[3px] mt-1"
          >
            Loading portfolio
          </motion.p>
        </motion.div>

        {/* Progress bar */}
        <motion.div className="w-32 h-[2px] rounded-full bg-white/8 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-violet-400 via-cyan-400 to-pink-400 rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 1.4, delay: 0.2, ease: "easeInOut" }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default SplashScreen;
