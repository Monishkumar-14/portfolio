// src/components/MobileTabBar.jsx
// Fixed bottom tab navigation — mobile only, glassmorphic pill style
import { useCallback, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Home, User, Briefcase, Code2, Award, MessageCircle, Mail, Sun, Moon } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useActiveSection } from "../context/ActiveSectionContext";

const tabs = [
  { id: "home",         icon: Home,          label: "Home" },
  { id: "about",        icon: User,          label: "About" },
  { id: "experience",   icon: Briefcase,     label: "Work" },
  { id: "projects",     icon: Code2,         label: "Projects" },
  { id: "certificates", icon: Award,         label: "Certs" },
  { id: "chatbot",      icon: MessageCircle, label: "Chat" },
  { id: "contact",      icon: Mail,          label: "Contact" },
];

const MobileTabBar = () => {
  const { isDark, toggleTheme } = useTheme();
  const activeSection = useActiveSection();

  // ── Horizontal swipe for scrollable tabs ──────────────────────
  const scrollRef = useRef(null);
  const touchStartX = useRef(0);
  const scrollStartX = useRef(0);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    scrollStartX.current = scrollRef.current?.scrollLeft || 0;
  };

  const handleTouchMove = (e) => {
    if (!scrollRef.current) return;
    const dx = touchStartX.current - e.touches[0].clientX;
    scrollRef.current.scrollLeft = scrollStartX.current + dx;
  };

  const handleTap = useCallback((id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <div className="md:hidden fixed bottom-3 left-3 right-3 z-50">
      {/* ── Floating glassmorphic pill ── */}
      <div className="glass-nav rounded-full px-2 py-1.5 flex items-center gap-1">

        {/* Scrollable tab area */}
        <div
          ref={scrollRef}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          className="flex items-center gap-0.5 overflow-x-auto flex-1 scrollbar-hide"
          style={{ scrollBehavior: "smooth", WebkitOverflowScrolling: "touch" }}
        >
          {tabs.map(({ id, icon: Icon, label }) => {
            const isActive = activeSection === id;
            return (
              <button
                key={id}
                onClick={() => handleTap(id)}
                className={`relative flex flex-col items-center justify-center gap-[2px] 
                  min-w-[46px] py-1.5 px-1 rounded-full transition-all duration-200
                  ${isActive
                    ? "bg-violet-500/20 border border-violet-500/30 shadow-[0_0_10px_rgba(124,58,237,0.15)]"
                    : "border border-transparent"
                  }`}
                aria-label={label}
              >
                <Icon
                  size={16}
                  strokeWidth={isActive ? 2.5 : 1.8}
                  className={`transition-colors duration-200 ${
                    isActive
                      ? "text-violet-400"
                      : isDark ? "text-white/50" : "text-gray-500"
                  }`}
                />
                <span
                  className={`text-[8px] font-bold uppercase tracking-wider transition-colors duration-200 leading-none ${
                    isActive
                      ? "text-violet-300"
                      : isDark ? "text-white/35" : "text-gray-400"
                  }`}
                >
                  {label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Theme toggle — right side */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full
            border transition-all"
          style={{
            background: "var(--badge-bg)",
            borderColor: "var(--border-card)",
            color: "var(--nav-text)",
          }}
        >
          <AnimatePresence mode="wait" initial={false}>
            {isDark ? (
              <motion.span key="sun"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.15 }}>
                <Sun size={13} />
              </motion.span>
            ) : (
              <motion.span key="moon"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.15 }}>
                <Moon size={13} />
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </div>
  );
};

export default MobileTabBar;
