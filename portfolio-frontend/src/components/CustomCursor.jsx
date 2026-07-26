// src/components/CustomCursor.jsx
// Glowing cursor trail — desktop only (hidden on touch devices)
import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const mouse = useRef({ x: 0, y: 0 });
  const ring = useRef({ x: 0, y: 0 });
  const animId = useRef(null);

  useEffect(() => {
    // Skip on touch devices
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

    // Smooth ring follow
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

  // Don't render on touch
  if (typeof window !== "undefined" && ("ontouchstart" in window || navigator.maxTouchPoints > 0)) {
    return null;
  }

  return (
    <>
      {/* Outer ring — follows with lag */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 z-[9999] pointer-events-none"
        style={{
          width: 36,
          height: 36,
          marginLeft: -18,
          marginTop: -18,
          borderRadius: "50%",
          border: "1.5px solid rgba(139,92,246,0.35)",
          boxShadow: "0 0 12px rgba(139,92,246,0.15), 0 0 24px rgba(6,182,212,0.08)",
          transition: "opacity 0.3s ease",
          opacity: visible ? 1 : 0,
          willChange: "transform",
        }}
      />

      {/* Inner dot — snaps to cursor */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 z-[9999] pointer-events-none"
        style={{
          width: 6,
          height: 6,
          marginLeft: -3,
          marginTop: -3,
          borderRadius: "50%",
          background: "rgba(167,139,250,0.9)",
          boxShadow: "0 0 8px rgba(139,92,246,0.5), 0 0 20px rgba(6,182,212,0.25)",
          transition: "opacity 0.3s ease",
          opacity: visible ? 1 : 0,
          willChange: "transform",
        }}
      />

      {/* Hide default cursor on non-interactive elements */}
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
