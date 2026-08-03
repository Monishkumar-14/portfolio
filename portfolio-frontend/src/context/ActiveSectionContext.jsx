// src/context/ActiveSectionContext.jsx
// Shared active section state for Navbar + MobileTabBar
import { createContext, useContext, useState, useEffect } from "react";

const ActiveSectionContext = createContext();

const navSections = [
  "home", "about", "experience", "projects",
  "certificates", "resume", "chatbot", "contact",
];

export const ActiveSectionProvider = ({ children }) => {
  const [activeSection, setActiveSection] = useState("home");

  // IntersectionObserver + MutationObserver for lazy sections
  useEffect(() => {
    const sectionObservers = new Map();

    const observeSection = (id) => {
      if (sectionObservers.has(id)) return;
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveSection(id);
            }
          });
        },
        { rootMargin: "-30% 0px -65% 0px", threshold: 0 }
      );
      observer.observe(el);
      sectionObservers.set(id, observer);
    };

    navSections.forEach(observeSection);

    const mutationObserver = new MutationObserver(() => {
      navSections.forEach(observeSection);
      if (sectionObservers.size === navSections.length) {
        mutationObserver.disconnect();
      }
    });
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      sectionObservers.forEach((o) => o.disconnect());
      mutationObserver.disconnect();
    };
  }, []);

  return (
    <ActiveSectionContext.Provider value={activeSection}>
      {children}
    </ActiveSectionContext.Provider>
  );
};

export const useActiveSection = () => useContext(ActiveSectionContext);
