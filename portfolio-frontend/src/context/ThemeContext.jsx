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
      root.style.setProperty("--bg-main", "#0a0a1a");
      root.style.setProperty("--bg-card", "rgba(255,255,255,0.07)");
      root.style.setProperty("--border-card", "rgba(255,255,255,0.12)");
      root.style.setProperty("--text-primary", "#f1f5f9");
      root.style.setProperty("--text-muted", "rgba(241,245,249,0.5)");
      root.style.setProperty("--orb1", "rgba(124,58,237,0.2)");
      root.style.setProperty("--orb2", "rgba(6,182,212,0.15)");
      root.style.setProperty("--orb3", "rgba(236,72,153,0.12)");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      root.style.setProperty("--bg-main", "#f0f0ff");
      root.style.setProperty("--bg-card", "rgba(255,255,255,0.55)");
      root.style.setProperty("--border-card", "rgba(124,58,237,0.15)");
      root.style.setProperty("--text-primary", "#1e1b4b");
      root.style.setProperty("--text-muted", "rgba(30,27,75,0.55)");
      root.style.setProperty("--orb1", "rgba(124,58,237,0.12)");
      root.style.setProperty("--orb2", "rgba(6,182,212,0.08)");
      root.style.setProperty("--orb3", "rgba(236,72,153,0.07)");
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