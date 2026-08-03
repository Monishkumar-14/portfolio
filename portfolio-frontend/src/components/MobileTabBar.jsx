// src/components/MobileTabBar.jsx
// Fixed bottom tab navigation — mobile only, always visible
import { useCallback } from "react";
import { motion } from "framer-motion";
import { Home, User, Briefcase, Code2, Award, MessageCircle, Mail } from "lucide-react";
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
  const { isDark } = useTheme();
  const activeSection = useActiveSection();

  const handleTap = useCallback((id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <div
      className="md:hidden fixed bottom-0 left-0 right-0 z-50"
    >
      {/* Gradient fade above the bar */}
      <div
        className="h-6 pointer-events-none"
        style={{
          background: isDark
            ? "linear-gradient(to bottom, transparent, rgba(5,0,18,0.9))"
            : "linear-gradient(to bottom, transparent, rgba(240,240,255,0.9))",
        }}
      />

      <div
        className="flex items-center justify-around px-1 pb-[env(safe-area-inset-bottom,8px)] pt-2"
        style={{
          background: isDark ? "rgba(5,0,18,0.95)" : "rgba(245,243,255,0.95)",
          backdropFilter: "blur(20px) saturate(180%)",
          WebkitBackdropFilter: "blur(20px) saturate(180%)",
          borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(124,58,237,0.12)"}`,
        }}
      >
        {tabs.map(({ id, icon: Icon, label }) => {
          const isActive = activeSection === id;
          return (
            <button
              key={id}
              onClick={() => handleTap(id)}
              className="flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl transition-all duration-200 relative min-w-[44px]"
              aria-label={label}
            >
              {/* Active indicator dot */}
              {isActive && (
                <motion.div
                  layoutId="tab-indicator"
                  className="absolute -top-1 w-5 h-[3px] rounded-full bg-gradient-to-r from-violet-400 to-cyan-400"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <Icon
                size={18}
                strokeWidth={isActive ? 2.5 : 1.8}
                className={`transition-colors duration-200 ${
                  isActive
                    ? "text-violet-400"
                    : isDark ? "text-white/35" : "text-gray-400"
                }`}
              />
              <span
                className={`text-[9px] font-semibold tracking-wide transition-colors duration-200 ${
                  isActive
                    ? "text-violet-400"
                    : isDark ? "text-white/30" : "text-gray-400"
                }`}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MobileTabBar;
