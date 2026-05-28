import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Moon, Sun, Menu, X } from "lucide-react";
import { useTheme } from "../context/ThemeContext";


const navLinks = [
  { label: "Home",         href: "#home"         },
  { label: "About",        href: "#about"        },
  { label: "Experience",   href: "#experience"   },
  { label: "Projects",     href: "#projects"     },
  { label: "Certificates", href: "#certificates" },
  { label: "Resume",       href: "#resume"       },
  { label: "Chatbot",      href: "#chatbot"      },
  { label: "Contact",      href: "#contact"      },
];

// iOS spring — used everywhere for menu open/close
const iosSpring = { type: "spring", stiffness: 420, damping: 32, mass: 0.9 };

const Navbar = () => {
  const { isDark, toggleTheme } = useTheme();

  const [menuOpen,      setMenuOpen]      = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  // ── Touch-swipe state ──────────────────────────────────────────
  const touchStartY = useRef(0);
  const touchStartX = useRef(0);

  // ── FIX: scroll-position based active tracking ─────────────────
  // IntersectionObserver with threshold:0.4 fails on tall sections.
  // Reading offsetTop directly on every scroll is reliable for all heights.
  useEffect(() => {
    const handleScroll = () => {
      const sectionIds = navLinks.map((l) => l.href.replace("#", ""));
      // Trigger zone = 30% from the top of the viewport
      const triggerY = window.scrollY + window.innerHeight * 0.3;

      let current = sectionIds[0];
      sectionIds.forEach((id) => {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= triggerY) current = id;
      });
      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // run once on mount
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (href) => {
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  // ── iOS swipe handlers ─────────────────────────────────────────
  const handleTouchStart = (e) => {
    touchStartY.current = e.touches[0].clientY;
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    const dx = Math.abs(e.changedTouches[0].clientX - touchStartX.current);
    if (Math.abs(dy) > dx) {                     // more vertical than horizontal
      if (dy >  44 && !menuOpen) setMenuOpen(true);   // swipe down → open
      if (dy < -44 &&  menuOpen) setMenuOpen(false);  // swipe up   → close
    }
  };

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0,   opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-48px)] max-w-4xl"
    >
      {/* ── Floating pill ── */}
      <div className="glass-nav flex items-center justify-between px-5 h-14 rounded-full">

        {/* Logo */}
        <button
          onClick={() => scrollTo("#home")}
          className="text-lg font-bold tracking-tight flex-shrink-0"
          style={{ color: "var(--nav-logo)" }}
        >
          Monish<span className="text-violet-400">.</span>
        </button>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-0.5">
          {navLinks.map(({ label, href }) => {
            const isActive = activeSection === href.replace("#", "");
            return (
              <li key={label}>
                <button
                  onClick={() => scrollTo(href)}
                  className={`relative px-3 py-1.5 rounded-full text-[13px] font-medium
                    transition-all duration-200
                    ${isActive
                      ? "bg-violet-500/20 text-violet-300 border border-violet-500/30 shadow-[0_0_12px_rgba(124,58,237,0.2)]"
                      : "hover:bg-violet-500/8"
                    }`}
                  style={{ color: isActive ? undefined : "var(--nav-text)" }}
                >
                  {label}
                </button>
              </li>
            );
          })}
        </ul>

        {/* Right controls */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <motion.button
            whileTap={{ scale: 0.88 }}
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="w-8 h-8 flex items-center justify-center rounded-full
              border transition-all"
            style={{
              background: "var(--badge-bg)",
              borderColor: "var(--border-card)",
              color: "var(--nav-text)",
            }}
          >
            {isDark ? <Sun size={14}/> : <Moon size={14}/>}
          </motion.button>

          {/* Hamburger — animated icon swap */}
          <motion.button
            whileTap={{ scale: 0.88 }}
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            className="md:hidden w-8 h-8 flex items-center justify-center rounded-full
              border"
            style={{
              background: "var(--badge-bg)",
              borderColor: "var(--border-card)",
              color: "var(--text-primary)",
            }}
          >
            <AnimatePresence mode="wait" initial={false}>
              {menuOpen
                ? <motion.span key="x"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.18 }}>
                    <X size={15}/>
                  </motion.span>
                : <motion.span key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.18 }}>
                    <Menu size={15}/>
                  </motion.span>
              }
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      {/* ── Mobile dropdown — iOS spring ── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, scaleY: 0.88, y: -12 }}
            animate={{ opacity: 1, scaleY: 1,    y: 0   }}
            exit={{    opacity: 0, scaleY: 0.88,  y: -12 }}
            transition={iosSpring}
            className="mt-2 rounded-3xl p-3 flex flex-col gap-0.5"
            style={{
              transformOrigin: "top center",
              background: isDark ? "rgba(10,10,26,0.75)" : "rgba(255,255,255,0.90)",
              backdropFilter: "blur(40px) saturate(180%)",
              WebkitBackdropFilter: "blur(40px) saturate(180%)",
              border: `1px solid ${isDark ? "rgba(255,255,255,0.10)" : "rgba(124,58,237,0.15)"}`,
              boxShadow: isDark
                ? "0 20px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)"
                : "0 20px 60px rgba(124,58,237,0.08), inset 0 1px 0 rgba(255,255,255,0.5)",
            }}
          >
            {/* Swipe-to-close hint bar */}
            <div className="w-9 h-1 rounded-full mx-auto mb-2"
              style={{ background: isDark ? "rgba(255,255,255,0.20)" : "rgba(30,27,75,0.15)" }} />

            {navLinks.map(({ label, href }, i) => {
              const isActive = activeSection === href.replace("#", "");
              return (
                <motion.button
                  key={label}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04, ...iosSpring }}
                  onClick={() => scrollTo(href)}
                  className={`text-left px-4 py-3.5 rounded-2xl text-sm font-medium transition-all
                    ${isActive
                      ? "bg-violet-500/20 text-violet-300"
                      : ""
                    }`}
                  style={{
                    color: isActive ? undefined : (isDark ? "rgba(255,255,255,0.60)" : "rgba(30,27,75,0.60)"),
                  }}
                >
                  {label}
                </motion.button>
              );
            })}

          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;