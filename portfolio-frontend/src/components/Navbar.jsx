import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { Code2, Terminal, Cpu, GitBranch, FolderOpen, BookOpen, Mail } from "lucide-react";
import { useMediaQuery } from "../utils/useMediaQuery";
import "./Navbar.css";

/* Single source of truth for navigation: a fixed vertical rail on the right.
   Only the active section shows its full icon; every other section is a small dot on the line.
   Order = page order. `id` must match the section element's id. */
const SECTIONS = [
  { id: "home",         label: "Home",         Icon: Code2 },
  { id: "about",        label: "About",        Icon: Terminal },
  { id: "skills",       label: "Skills",       Icon: Cpu },
  { id: "experience",   label: "Experience",   Icon: GitBranch },
  { id: "projects",     label: "Projects",     Icon: FolderOpen },
  { id: "certificates", label: "Certificates", Icon: BookOpen },
  { id: "contact",      label: "Contact",      Icon: Mail },
];

// A section becomes "active" when it crosses a thin band through the middle of the viewport.
const IO_OPTIONS = { rootMargin: "-45% 0px -50% 0px", threshold: 0 };
const UNLOCK_FALLBACK_MS = 1200;

const prefersReducedMotion = () => window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

const Navbar = () => {
  const isMobile = useMediaQuery("(max-width: 767px)"); // phones use MobileTabBar instead; never both
  const [active, setActive] = useState("home");
  const [present, setPresent] = useState(() => new Set(["home"])); // ids whose target exists in the page

  const visibleRef = useRef(new Set());   // sections currently crossing the band
  const lockRef = useRef(false);          // true while a click-initiated smooth scroll is running
  const lockTimer = useRef(null);
  const observedRef = useRef(new Map());  // id -> element being observed

  /* Pick the active section from what is currently crossing the band (latest in page order wins). */
  const recompute = useCallback(() => {
    let next = "home";
    for (const { id } of SECTIONS) if (visibleRef.current.has(id)) next = id;
    setActive((prev) => (prev === next ? prev : next));
  }, []);

  const unlock = useCallback(() => {
    clearTimeout(lockTimer.current);
    if (!lockRef.current) return;
    lockRef.current = false;
    recompute();
  }, [recompute]);

  /* Observe every section that exists. Sections that mount later (lazy loading) are picked up by a
     short-lived MutationObserver; no scroll listeners are used. */
  useEffect(() => {
    if (isMobile) return undefined;          // no observer on phones: MobileTabBar uses the app's ActiveSectionContext
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) visibleRef.current.add(e.target.id);
        else visibleRef.current.delete(e.target.id);
      }
      if (!lockRef.current) recompute(); // ignore intermediate sections while auto-scrolling
    }, IO_OPTIONS);

    const scan = () => {
      const found = new Set(["home"]);
      for (const { id } of SECTIONS) {
        const el = document.getElementById(id);
        if (!el) continue;
        found.add(id);
        if (observedRef.current.get(id) !== el) {
          observedRef.current.get(id) && io.unobserve(observedRef.current.get(id));
          observedRef.current.set(id, el);
          io.observe(el);
        }
      }
      setPresent((prev) => (prev.size === found.size && [...found].every((i) => prev.has(i)) ? prev : found));
      return found.size === SECTIONS.length;
    };

    let mo = null, stopTimer = null;
    if (!scan()) {
      let raf = 0;
      mo = new MutationObserver(() => {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => { if (scan()) { mo.disconnect(); clearTimeout(stopTimer); } });
      });
      mo.observe(document.body, { childList: true, subtree: true });
      stopTimer = setTimeout(() => mo?.disconnect(), 10000);
    }

    const warnTimer = setTimeout(() => {
      if (import.meta.env?.DEV) {
        const missing = SECTIONS.filter(({ id }) => id !== "home" && !document.getElementById(id)).map((s) => `#${s.id}`);
        if (missing.length) console.warn("[Navbar] No section found for:", missing.join(", "), "— those links are hidden.");
      }
    }, 3000);

    return () => {
      io.disconnect(); mo?.disconnect();
      clearTimeout(stopTimer); clearTimeout(warnTimer); clearTimeout(lockTimer.current);
      observedRef.current.clear(); visibleRef.current.clear();
      window.removeEventListener("scrollend", unlock);
    };
  }, [recompute, unlock, isMobile]);

  const handleNavClick = useCallback((e, id) => {
    e.preventDefault();
    const el = document.getElementById(id);
    const behavior = prefersReducedMotion() ? "auto" : "smooth";
    if (el) el.scrollIntoView({ behavior, block: "start" });
    else if (id === "home") window.scrollTo({ top: 0, behavior });
    else return;
    setActive(id);                       // immediate feedback
    lockRef.current = true;              // hold the highlight until the scroll finishes
    clearTimeout(lockTimer.current);
    lockTimer.current = setTimeout(unlock, UNLOCK_FALLBACK_MS);
    window.addEventListener("scrollend", unlock, { once: true });
    window.history.pushState(null, "", `#${id}`);
  }, [unlock]);

  const items = useMemo(() => SECTIONS.filter(({ id }) => present.has(id)), [present]);

  if (isMobile) return null;

  return (
    <nav className="vnav" aria-label="Section navigation">
      <ul className="vnav__list">
        <li className="vnav__line" aria-hidden="true" />
        {items.map(({ id, label, Icon }) => {
          const isActive = active === id;
          return (
            <li key={id} className={`vnav__item${isActive ? " is-active" : ""}`}>
              <a
                href={`#${id}`}
                className="vnav__btn"
                aria-label={label}
                aria-current={isActive ? "location" : undefined}
                onClick={(e) => handleNavClick(e, id)}
              >
                {/* One element per section: a small dot when inactive, the full icon when active */}
                <span className="vnav__dot" aria-hidden="true">
                  <Icon size={20} strokeWidth={1.6} />
                </span>
                <span className="vnav__label" aria-hidden="true">{">"} {label}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default Navbar;
