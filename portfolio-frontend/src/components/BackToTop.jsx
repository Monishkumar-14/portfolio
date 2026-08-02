// src/components/BackToTop.jsx
// Floating "↑ Back to Top" button — appears after scrolling past the hero
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";

const BackToTop = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { threshold: 0 }
    );
    const hero = document.getElementById("home");
    if (hero) observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.6, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 20 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          onClick={scrollToTop}
          aria-label="Back to top"
          className="fixed bottom-6 right-6 z-40 w-11 h-11 rounded-full
            flex items-center justify-center
            bg-violet-500/20 border border-violet-500/35
            text-violet-300 backdrop-blur-xl
            shadow-[0_4px_24px_rgba(124,58,237,0.25)]
            hover:bg-violet-500/30 hover:shadow-[0_4px_32px_rgba(124,58,237,0.4)]
            hover:scale-110 active:scale-95
            transition-all duration-200"
        >
          <ArrowUp size={18} strokeWidth={2.5} />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default BackToTop;
