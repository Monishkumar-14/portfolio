import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === "undefined") return true;
    const stored = localStorage.getItem("theme");
    if (stored) return stored === "dark";
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      root.classList.remove("light");
      root.style.colorScheme = "dark";

      // Terminal OS Dark Tokens
      root.style.setProperty("--bg-main", "#191919");
      root.style.setProperty("--bg-surface", "#202020");
      root.style.setProperty("--bg-surface-secondary", "#252525");
      root.style.setProperty("--bg-card", "#1E1E1E");
      root.style.setProperty("--bg-card-hover", "#252525");
      root.style.setProperty("--border-card", "rgba(255,255,255,0.08)");
      root.style.setProperty("--border-card-hover", "rgba(255,107,53,0.4)");
      root.style.setProperty("--text-primary", "#F0F2F4");
      root.style.setProperty("--text-heading", "#F0F2F4");
      root.style.setProperty("--text-secondary", "#B9BEC7");
      root.style.setProperty("--text-muted", "#9299A4");
      root.style.setProperty("--text-faint", "#6B7280");
      root.style.setProperty("--text-ultra-faint", "#4B5563");
      root.style.setProperty("--primary-accent", "#FF6B35");
      root.style.setProperty("--primary-accent-hover", "#FF8A5C");
      root.style.setProperty("--tech-blue", "#4D8DFF");
      root.style.setProperty("--tech-blue-hover", "#6BA3FF");
      root.style.setProperty("--accent-success", "#18C98B");
      root.style.setProperty("--accent-violet", "#A78BFA");

      // Nav
      root.style.setProperty("--nav-bg", "rgba(25,25,25,0.92)");
      root.style.setProperty("--nav-border", "rgba(255,255,255,0.08)");
      root.style.setProperty("--nav-shadow", "0 10px 30px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.03) inset");
      root.style.setProperty("--nav-text", "#B9BEC7");
      root.style.setProperty("--nav-text-active", "#FF6B35");
      root.style.setProperty("--nav-active-bg", "rgba(255,107,53,0.12)");
      root.style.setProperty("--nav-logo", "#F0F2F4");

      // Input
      root.style.setProperty("--input-bg", "#252525");
      root.style.setProperty("--input-border", "rgba(255,255,255,0.10)");
      root.style.setProperty("--input-text", "#F0F2F4");
      root.style.setProperty("--input-placeholder", "#6B7280");
      root.style.setProperty("--input-focus-border", "#FF6B35");
      root.style.setProperty("--input-focus-bg", "#252525");

      // Card shadows
      root.style.setProperty("--card-shadow", "0 4px 24px -4px rgba(0,0,0,0.5)");
      root.style.setProperty("--card-shadow-hover", "0 12px 40px -8px rgba(0,0,0,0.6)");

      // Misc
      root.style.setProperty("--divider", "rgba(255,255,255,0.08)");
      root.style.setProperty("--badge-bg", "rgba(255,255,255,0.06)");
      root.style.setProperty("--badge-border", "rgba(255,255,255,0.10)");
      root.style.setProperty("--badge-text", "#FF6B35");

      // Atmospheric
      root.style.setProperty("--orb1", "rgba(255,107,53,0.03)");
      root.style.setProperty("--orb2", "rgba(77,141,255,0.025)");
      root.style.setProperty("--orb3", "rgba(24,201,139,0.02)");

      localStorage.setItem("theme", "dark");
      const meta = document.querySelector('meta[name="theme-color"]');
      if (meta) meta.setAttribute("content", "#191919");
    } else {
      root.classList.remove("dark");
      root.classList.add("light");
      root.style.colorScheme = "light";

      // Terminal OS Light Tokens — warm-neutral, readable
      root.style.setProperty("--bg-main", "#F7F5F2");
      root.style.setProperty("--bg-surface", "#FFFFFF");
      root.style.setProperty("--bg-surface-secondary", "#F0EDE8");
      root.style.setProperty("--bg-card", "#FFFFFF");
      root.style.setProperty("--bg-card-hover", "#FAFAF8");
      root.style.setProperty("--border-card", "#E5E0DA");
      root.style.setProperty("--border-card-hover", "#FF6B35");
      root.style.setProperty("--text-primary", "#1A1A1A");
      root.style.setProperty("--text-heading", "#1A1A1A");
      root.style.setProperty("--text-secondary", "#4A4A4A");
      root.style.setProperty("--text-muted", "#6B6B6B");
      root.style.setProperty("--text-faint", "#8E8E8E");
      root.style.setProperty("--text-ultra-faint", "#ABABAB");
      root.style.setProperty("--primary-accent", "#E05A2B");
      root.style.setProperty("--primary-accent-hover", "#C94F25");
      root.style.setProperty("--tech-blue", "#2B6CB0");
      root.style.setProperty("--tech-blue-hover", "#1E5A9E");
      root.style.setProperty("--accent-success", "#0F9D6E");
      root.style.setProperty("--accent-violet", "#7C5DBA");

      // Nav
      root.style.setProperty("--nav-bg", "rgba(247,245,242,0.92)");
      root.style.setProperty("--nav-border", "#E5E0DA");
      root.style.setProperty("--nav-shadow", "0 6px 24px rgba(0,0,0,0.06), 0 1px 0 rgba(255,255,255,0.9) inset");
      root.style.setProperty("--nav-text", "#4A4A4A");
      root.style.setProperty("--nav-text-active", "#E05A2B");
      root.style.setProperty("--nav-active-bg", "rgba(224,90,43,0.10)");
      root.style.setProperty("--nav-logo", "#1A1A1A");

      // Input
      root.style.setProperty("--input-bg", "#FFFFFF");
      root.style.setProperty("--input-border", "#E5E0DA");
      root.style.setProperty("--input-text", "#1A1A1A");
      root.style.setProperty("--input-placeholder", "#8E8E8E");
      root.style.setProperty("--input-focus-border", "#E05A2B");
      root.style.setProperty("--input-focus-bg", "#FFFFFF");

      // Card shadows
      root.style.setProperty("--card-shadow", "0 2px 12px -2px rgba(0,0,0,0.06)");
      root.style.setProperty("--card-shadow-hover", "0 8px 32px -4px rgba(0,0,0,0.10)");

      // Misc
      root.style.setProperty("--divider", "#E5E0DA");
      root.style.setProperty("--badge-bg", "#F0EDE8");
      root.style.setProperty("--badge-border", "#E5E0DA");
      root.style.setProperty("--badge-text", "#E05A2B");

      // Atmospheric
      root.style.setProperty("--orb1", "rgba(224,90,43,0.03)");
      root.style.setProperty("--orb2", "rgba(43,108,176,0.025)");
      root.style.setProperty("--orb3", "rgba(15,157,110,0.02)");

      localStorage.setItem("theme", "light");
      const meta = document.querySelector('meta[name="theme-color"]');
      if (meta) meta.setAttribute("content", "#F7F5F2");
    }
  }, [isDark]);

  // Listen to system preference changes when no explicit stored preference exists
  useEffect(() => {
    if (typeof window === "undefined" || localStorage.getItem("theme")) return;
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e) => setIsDark(e.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const toggleTheme = () => {
    setIsDark((p) => !p);
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
