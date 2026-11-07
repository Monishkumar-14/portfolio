import { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowUp } from "lucide-react";
import "./BackToTop.css";

/* Appears once the Hero has scrolled out of view. Sits to the LEFT of the chatbot launcher
   (same centre line) so it never hides under it or collides with the right-hand nav rail. */
const BackToTop = () => {
  const reduce = useReducedMotion();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Watch the Hero; if the page has no #home, watch a top-of-page sentinel instead.
    let target = document.getElementById("home");
    let sentinel = null;
    if (!target) {
      sentinel = document.createElement("div");
      sentinel.setAttribute("aria-hidden", "true");
      sentinel.style.cssText = "position:absolute;top:0;left:0;width:1px;height:60vh;pointer-events:none;visibility:hidden";
      document.body.appendChild(sentinel);
      target = sentinel;
    }
    const observer = new IntersectionObserver(([entry]) => setVisible(!entry.isIntersecting), { threshold: 0 });
    observer.observe(target);
    return () => { observer.disconnect(); sentinel?.remove(); };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          className="btt"
          initial={{ opacity: 0, scale: reduce ? 1 : 0.6, y: reduce ? 0 : 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: reduce ? 1 : 0.6, y: reduce ? 0 : 20 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          onClick={scrollToTop}
          aria-label="Back to top"
        >
          <ArrowUp size={18} strokeWidth={2.5} aria-hidden="true" />
          <span className="btt__label" aria-hidden="true">{">"} Top</span>
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default BackToTop;