// src/components/NotFound.jsx
// Terminal-styled 404 page, matching the portfolio's charcoal/orange system
import { motion, MotionConfig } from "framer-motion";
import { Home, ArrowLeft, Terminal } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Sections.css";
import "./NotFound.css";

const NotFound = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  // Go back when there is history to go back to; otherwise (direct visit) go home.
  const goBack = () => (window.history.length > 1 ? navigate(-1) : navigate("/"));

  return (
    <MotionConfig reducedMotion="user">
      <main className="sect nf" aria-labelledby="nf-title">
        <div className="sect__bg" aria-hidden="true" />

        <div className="nf__inner">
          <motion.h1
            id="nf-title"
            className="nf__code"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            404<span className="nf__sr"> — Page not found</span>
          </motion.h1>

          {/* Terminal window showing the real requested path */}
          <motion.section
            className="nf-win"
            aria-label="Terminal output"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.45 }}
          >
            <header className="nf-win__bar">
              <span className="nf-dots" aria-hidden="true"><i /><i /><i /></span>
              <span className="nf-win__file"><Terminal size={14} aria-hidden="true" /> not_found.log</span>
            </header>
            <pre className="nf-win__body">
              <span className="nf-l"><b className="nf-p">$</b> cd <span className="nf-path">{pathname}</span></span>
              <span className="nf-l nf-err">bash: cd: <span className="nf-path">{pathname}</span>: No such file or directory</span>
              <span className="nf-l"><b className="nf-p">$</b> echo $?</span>
              <span className="nf-l nf-code">404</span>
            </pre>
          </motion.section>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.45 }}
          >
            <h2 className="nf__title"><span aria-hidden="true">$ </span>Path not found</h2>
            <p className="nf__text">
              Error: ENOENT — the page you're looking for doesn't exist or has been moved.
              Let's get you back on track.
            </p>
          </motion.div>

          <motion.div
            className="nf__actions"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.4 }}
          >
            <Link to="/" className="nf-btn nf-btn--primary"><Home size={16} aria-hidden="true" /> Go Home</Link>
            <button type="button" onClick={goBack} className="nf-btn"><ArrowLeft size={16} aria-hidden="true" /> Go Back</button>
          </motion.div>

          <p className="nf__foot">monish.dev</p>
        </div>
      </main>
    </MotionConfig>
  );
};

export default NotFound;