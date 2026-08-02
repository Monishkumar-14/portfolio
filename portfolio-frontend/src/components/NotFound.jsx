// src/components/NotFound.jsx
// Custom 404 page with fun animation and "Go Home" button
import { motion } from "framer-motion";
import { Home, ArrowLeft, Compass } from "lucide-react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #020014 0%, #0a0a2e 50%, #050012 100%)",
      }}
    >
      {/* Ambient glow orbs */}
      <div className="absolute w-[400px] h-[400px] rounded-full bg-violet-500/8 blur-[120px] -top-20 -left-20" />
      <div className="absolute w-[300px] h-[300px] rounded-full bg-cyan-500/6 blur-[100px] bottom-10 right-10" />
      <div className="absolute w-[250px] h-[250px] rounded-full bg-pink-500/5 blur-[80px] top-1/2 left-1/2 -translate-x-1/2" />

      <div className="text-center relative z-10 max-w-lg">
        {/* 404 Number */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-6"
        >
          <h1 className="text-[120px] md:text-[160px] font-extrabold leading-none tracking-tighter
            bg-gradient-to-r from-violet-400 via-cyan-400 to-pink-400 bg-clip-text text-transparent
            select-none"
            style={{ letterSpacing: "-8px" }}
          >
            404
          </h1>
        </motion.div>

        {/* Compass icon */}
        <motion.div
          initial={{ opacity: 0, rotate: -90 }}
          animate={{ opacity: 1, rotate: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="flex justify-center mb-6"
        >
          <div className="w-14 h-14 rounded-2xl bg-violet-500/15 border border-violet-500/30 flex items-center justify-center
            shadow-[0_0_40px_rgba(124,58,237,0.2)]"
          >
            <motion.div
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <Compass size={24} className="text-violet-400" />
            </motion.div>
          </div>
        </motion.div>

        {/* Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <h2 className="text-xl md:text-2xl font-bold text-white/90 mb-3">
            Lost in the void
          </h2>
          <p className="text-sm text-white/50 leading-relaxed mb-8 max-w-sm mx-auto">
            The page you're looking for doesn't exist or has been moved.
            Let's get you back to familiar territory.
          </p>
        </motion.div>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.4 }}
          className="flex gap-3 justify-center flex-wrap"
        >
          <Link to="/">
            <motion.div
              whileHover={{ scale: 1.04, boxShadow: "0 0 22px rgba(124,58,237,0.55)" }}
              whileTap={{ scale: 0.96 }}
              className="flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-semibold
                bg-gradient-to-r from-violet-600 to-violet-500 text-white
                shadow-[0_4px_20px_rgba(124,58,237,0.4)]"
            >
              <Home size={16} /> Go Home
            </motion.div>
          </Link>

          <motion.button
            onClick={() => window.history.back()}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-semibold
              bg-white/6 border border-white/12 text-white/60
              hover:bg-white/10 hover:text-white/80 transition-all"
          >
            <ArrowLeft size={16} /> Go Back
          </motion.button>
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="mt-12 text-[10px] text-white/25 uppercase tracking-[2px]"
        >
          monishdev.online
        </motion.p>
      </div>
    </div>
  );
};

export default NotFound;
