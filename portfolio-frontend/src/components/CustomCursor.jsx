// src/components/CustomCursor.jsx
// Glowing cursor trail — desktop only, theme-aware
import { useEffect, useRef, useState } from "react";
import { useTheme } from "../context/ThemeContext";

export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const mouse = useRef({ x: 0, y: 0 });
  const ring = useRef({ x: 0, y: 0 });
  const animId = useRef(null);
  const { isDark } = useTheme();

  useEffect(() => {
    const isTouchDevice =
      "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    const onMove = (e) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
      if (!visible) setVisible(true);
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      }
    };

    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    const lerp = (a, b, n) => a + (b - a) * n;
    const animate = () => {
      ring.current.x = lerp(ring.current.x, mouse.current.x, 0.15);
      ring.current.y = lerp(ring.current.y, mouse.current.y, 0.15);
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ring.current.x}px, ${ring.current.y}px)`;
      }
      animId.current = requestAnimationFrame(animate);
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);
    animId.current = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      cancelAnimationFrame(animId.current);
    };
  }, [visible]);

  if (typeof window !== "undefined" && ("ontouchstart" in window || navigator.maxTouchPoints > 0)) {
    return null;
  }

  // Theme-aware colors
  const ringBorder = isDark
    ? "1.5px solid rgba(139,92,246,0.35)"
    : "1.5px solid rgba(124,58,237,0.25)";
  const ringShadow = isDark
    ? "0 0 12px rgba(139,92,246,0.15), 0 0 24px rgba(6,182,212,0.08)"
    : "0 0 10px rgba(124,58,237,0.1), 0 0 20px rgba(124,58,237,0.05)";
  const dotBg = isDark
    ? "rgba(167,139,250,0.9)"
    : "rgba(124,58,237,0.7)";
  const dotShadow = isDark
    ? "0 0 8px rgba(139,92,246,0.5), 0 0 20px rgba(6,182,212,0.25)"
    : "0 0 6px rgba(124,58,237,0.3), 0 0 14px rgba(124,58,237,0.15)";

  return (
    <>
      <div
        ref={ringRef}
        className="fixed top-0 left-0 z-[9999] pointer-events-none"
        style={{
          width: 36,
          height: 36,
          marginLeft: -18,
          marginTop: -18,
          borderRadius: "50%",
          border: ringBorder,
          boxShadow: ringShadow,
          transition: "opacity 0.3s ease, border 0.4s ease, box-shadow 0.4s ease",
          opacity: visible ? 1 : 0,
          willChange: "transform",
        }}
      />

      <div
        ref={dotRef}
        className="fixed top-0 left-0 z-[9999] pointer-events-none"
        style={{
          width: 6,
          height: 6,
          marginLeft: -3,
          marginTop: -3,
          borderRadius: "50%",
          background: dotBg,
          boxShadow: dotShadow,
          transition: "opacity 0.3s ease, background 0.4s ease, box-shadow 0.4s ease",
          opacity: visible ? 1 : 0,
          willChange: "transform",
        }}
      />

      <style>{`
        @media (hover: hover) and (pointer: fine) {
          * { cursor: none !important; }
          a, button, [role="button"], input, textarea, select,
          a *, button *, [role="button"] * {
            cursor: none !important;
          }
        }
      `}</style>
    </>
  );
}
