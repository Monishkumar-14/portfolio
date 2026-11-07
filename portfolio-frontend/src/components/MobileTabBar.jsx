import { useCallback, useEffect, useRef, useState } from "react";
import { Home, User, Briefcase, Code2, Award, Mail } from "lucide-react";
import { useActiveSection } from "../context/ActiveSectionContext";
import { useMediaQuery } from "../utils/useMediaQuery";
import "./MobileTabBar.css";

/* Mobile-only (< 768px) floating glass tab bar. On wider screens the right-hand rail (Navbar.jsx)
   is shown instead; each component renders null at the other breakpoint, so the two navigation
   systems never exist at the same time. Active-section detection is the app's existing
   ActiveSectionContext (no second observer). */
export const MOBILE_QUERY = "(max-width: 767px)";

const tabs = [
  { id: "home",         icon: Home,      label: "Home" },
  { id: "about",        icon: User,      label: "About" },
  { id: "experience",   icon: Briefcase, label: "Work" },
  { id: "projects",     icon: Code2,     label: "Projects" },
  { id: "certificates", icon: Award,     label: "Certs" },
  { id: "contact",      icon: Mail,      label: "Contact" },
];

const HOLD_MS = 1200; // keep the tapped tab highlighted while the smooth scroll runs

const MobileTabBar = () => {
  const isMobile = useMediaQuery(MOBILE_QUERY);
  const activeSection = useActiveSection();

  const barRef = useRef(null);
  const holdTimer = useRef(null);
  const [pending, setPending] = useState(null); // tab the user just tapped

  const current = pending ?? (activeSection || "home");

  /* Publish the bar's real footprint (its height + its offset from the bottom edge, safe area included)
     as --mnav-offset on <html>. The chatbot launcher, back-to-top button and page padding all position
     themselves from it, so nothing is ever hidden behind the bar. */
  useEffect(() => {
    if (!isMobile) return undefined;
    const root = document.documentElement;
    const el = barRef.current;
    if (!el) return undefined;
    const publish = () => {
      const bottom = parseFloat(getComputedStyle(el).bottom) || 0;
      root.style.setProperty("--mnav-offset", `${Math.round(el.offsetHeight + bottom)}px`);
    };
    publish();
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(publish) : null;
    ro?.observe(el);
    window.addEventListener("resize", publish);
    window.addEventListener("orientationchange", publish);
    return () => {
      ro?.disconnect();
      window.removeEventListener("resize", publish);
      window.removeEventListener("orientationchange", publish);
      root.style.removeProperty("--mnav-offset");
    };
  }, [isMobile]);

  // Release the tap highlight once the observer catches up (or after a fallback delay).
  useEffect(() => {
    if (pending && activeSection === pending) { clearTimeout(holdTimer.current); setPending(null); }
  }, [activeSection, pending]);
  useEffect(() => () => clearTimeout(holdTimer.current), []);

  const handleTap = useCallback((e, id) => {
    e.preventDefault();
    const behavior = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior, block: "start" });
    else if (id === "home") window.scrollTo({ top: 0, behavior });
    else return;
    setPending(id);
    clearTimeout(holdTimer.current);
    holdTimer.current = setTimeout(() => setPending(null), HOLD_MS);
    window.history.pushState(null, "", `#${id}`);
  }, []);

  if (!isMobile) return null;

  return (
    <nav className="mtab" ref={barRef} aria-label="Section navigation">
      <div className="mtab__bar">
        <ul className="mtab__list">
          {tabs.map(({ id, icon: Icon, label }) => {
            const isActive = current === id;
            return (
              <li key={id} className="mtab__cell">
                <a
                  href={`#${id}`}
                  className={`mtab__item${isActive ? " is-active" : ""}`}
                  aria-current={isActive ? "location" : undefined}
                  onClick={(e) => handleTap(e, id)}
                >
                  <Icon size={18} strokeWidth={isActive ? 2.4 : 1.8} aria-hidden="true" />
                  <span className="mtab__label">{label}</span>
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
};

export default MobileTabBar;
