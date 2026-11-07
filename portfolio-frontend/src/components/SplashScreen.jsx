// src/components/SplashScreen.jsx
// Terminal boot splash (max 1.5s): same charcoal base, top-left glow and square grid as the rest of the portfolio
import { useEffect, useRef } from "react";
import { motion, MotionConfig } from "framer-motion";
import Background from "./Background";
import "./SplashScreen.css";

const SplashScreen = ({ onComplete }) => {
  // Always call the latest handler, but only ONCE (the timer and the fade-out can both fire)
  const handler = useRef(onComplete);
  const done = useRef(false);
  handler.current = onComplete;
  const finish = () => {
    if (done.current) return;
    done.current = true;
    handler.current?.();
  };

  useEffect(() => {
    const timer = setTimeout(finish, 1500);
    return () => clearTimeout(timer);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <MotionConfig reducedMotion="user">
      <motion.div
        className="splash"
        role="status"
        aria-label="Loading monish.dev"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.35, delay: 1.0, ease: "easeInOut" }}
        onAnimationComplete={finish}
      >
        <Background />

        <div className="splash__inner">
          {/* "M" tile with the dotted ring used by the navigation rail */}
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="splash__logo"
          >
            <span aria-hidden="true">M</span>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25, duration: 0.3 }} className="splash__text">
            <p className="splash__name"><i aria-hidden="true" />monish<b>.</b>dev</p>
            <p className="splash__boot">{">"} Initializing system...</p>
          </motion.div>

          <div className="splash__bar" aria-hidden="true">
            <motion.i initial={{ width: "0%" }} animate={{ width: "100%" }} transition={{ duration: 0.9, ease: "easeInOut" }} />
          </div>
        </div>
      </motion.div>
    </MotionConfig>
  );
};

export default SplashScreen;