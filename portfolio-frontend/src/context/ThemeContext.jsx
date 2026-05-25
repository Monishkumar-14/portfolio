import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    const stored = localStorage.getItem("theme");
    return stored ? stored === "dark" : true; // default dark
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      root.classList.remove("light");
      root.style.setProperty("--bg-main", "#0a0a1a");
      root.style.setProperty("--bg-card", "rgba(255,255,255,0.07)");
      root.style.setProperty("--bg-card-hover", "rgba(255,255,255,0.12)");
      root.style.setProperty("--border-card", "rgba(255,255,255,0.12)");
      root.style.setProperty("--border-card-hover", "rgba(255,255,255,0.22)");
      root.style.setProperty("--text-primary", "#f1f5f9");
      root.style.setProperty("--text-heading", "#ffffff");
      root.style.setProperty("--text-body", "rgba(255,255,255,0.75)");
      root.style.setProperty("--text-muted", "rgba(255,255,255,0.50)");
      root.style.setProperty("--text-faint", "rgba(255,255,255,0.30)");
      root.style.setProperty("--text-ultra-faint", "rgba(255,255,255,0.18)");
      root.style.setProperty("--orb1", "rgba(124,58,237,0.2)");
      root.style.setProperty("--orb2", "rgba(6,182,212,0.15)");
      root.style.setProperty("--orb3", "rgba(236,72,153,0.12)");
      // Nav
      root.style.setProperty("--nav-bg", "rgba(10,10,26,0.65)");
      root.style.setProperty("--nav-border", "rgba(255,255,255,0.12)");
      root.style.setProperty("--nav-shadow", "0 8px 32px rgba(0,0,0,0.4), 0 1px 0 rgba(255,255,255,0.1) inset");
      root.style.setProperty("--nav-text", "rgba(255,255,255,0.50)");
      root.style.setProperty("--nav-text-active", "#f1f5f9");
      root.style.setProperty("--nav-logo", "#ffffff");
      // Glass input
      root.style.setProperty("--input-bg", "rgba(255,255,255,0.06)");
      root.style.setProperty("--input-border", "rgba(255,255,255,0.10)");
      root.style.setProperty("--input-text", "#ffffff");
      root.style.setProperty("--input-placeholder", "rgba(255,255,255,0.22)");
      root.style.setProperty("--input-focus-border", "rgba(124,58,237,0.5)");
      root.style.setProperty("--input-focus-bg", "rgba(124,58,237,0.08)");
      // Card shadow
      root.style.setProperty("--card-shadow", "0 20px 60px rgba(0,0,0,0.3)");
      root.style.setProperty("--card-shadow-hover", "0 20px 60px rgba(0,0,0,0.3)");
      // Misc
      root.style.setProperty("--divider", "rgba(255,255,255,0.08)");
      root.style.setProperty("--badge-bg", "rgba(255,255,255,0.05)");
      root.style.setProperty("--badge-border", "rgba(255,255,255,0.09)");
      root.style.setProperty("--badge-text", "rgba(255,255,255,0.50)");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      root.classList.add("light");
      root.style.setProperty("--bg-main", "#f0f0ff");
      root.style.setProperty("--bg-card", "rgba(255,255,255,0.65)");
      root.style.setProperty("--bg-card-hover", "rgba(255,255,255,0.85)");
      root.style.setProperty("--border-card", "rgba(124,58,237,0.15)");
      root.style.setProperty("--border-card-hover", "rgba(124,58,237,0.30)");
      root.style.setProperty("--text-primary", "#1e1b4b");
      root.style.setProperty("--text-heading", "#1e1b4b");
      root.style.setProperty("--text-body", "rgba(30,27,75,0.75)");
      root.style.setProperty("--text-muted", "rgba(30,27,75,0.55)");
      root.style.setProperty("--text-faint", "rgba(30,27,75,0.40)");
      root.style.setProperty("--text-ultra-faint", "rgba(30,27,75,0.25)");
      root.style.setProperty("--orb1", "rgba(124,58,237,0.12)");
      root.style.setProperty("--orb2", "rgba(6,182,212,0.08)");
      root.style.setProperty("--orb3", "rgba(236,72,153,0.07)");
      // Nav
      root.style.setProperty("--nav-bg", "rgba(255,255,255,0.70)");
      root.style.setProperty("--nav-border", "rgba(124,58,237,0.15)");
      root.style.setProperty("--nav-shadow", "0 8px 32px rgba(124,58,237,0.08), 0 1px 0 rgba(255,255,255,0.5) inset");
      root.style.setProperty("--nav-text", "rgba(30,27,75,0.55)");
      root.style.setProperty("--nav-text-active", "#1e1b4b");
      root.style.setProperty("--nav-logo", "#1e1b4b");
      // Glass input
      root.style.setProperty("--input-bg", "rgba(30,27,75,0.04)");
      root.style.setProperty("--input-border", "rgba(30,27,75,0.12)");
      root.style.setProperty("--input-text", "#1e1b4b");
      root.style.setProperty("--input-placeholder", "rgba(30,27,75,0.30)");
      root.style.setProperty("--input-focus-border", "rgba(124,58,237,0.5)");
      root.style.setProperty("--input-focus-bg", "rgba(124,58,237,0.06)");
      // Card shadow
      root.style.setProperty("--card-shadow", "0 8px 32px rgba(124,58,237,0.06)");
      root.style.setProperty("--card-shadow-hover", "0 20px 60px rgba(124,58,237,0.1)");
      // Misc
      root.style.setProperty("--divider", "rgba(30,27,75,0.08)");
      root.style.setProperty("--badge-bg", "rgba(30,27,75,0.04)");
      root.style.setProperty("--badge-border", "rgba(30,27,75,0.10)");
      root.style.setProperty("--badge-text", "rgba(30,27,75,0.55)");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark((p) => !p);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);