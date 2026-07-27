// src/components/Background.jsx
// Night sky with twinkling stars (dark) / soft gradient (light)
import { useEffect, useRef, useMemo } from "react";
import { useTheme } from "../context/ThemeContext";

/* ── Generate star field ── */
const generateStars = (count) =>
  Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 0.4,
    baseOpacity: Math.random() * 0.55 + 0.25,
    phase: Math.random() * Math.PI * 2,
    speed: Math.random() * 1.8 + 0.8,
    driftX: (Math.random() - 0.5) * 0.004,
    driftY: (Math.random() - 0.5) * 0.003,
  }));

/* ── Canvas: twinkling + drifting stars ── */
const StarCanvas = () => {
  const canvasRef = useRef(null);
  const starsData = useMemo(() => generateStars(180), []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = (time) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const t = time / 1000;

      starsData.forEach((s) => {
        const pulse = Math.sin(s.phase + t * s.speed);
        const twinkle = 0.25 + 0.75 * (0.5 + 0.5 * pulse);
        const alpha = s.baseOpacity * twinkle;

        const driftedX = ((s.x + s.driftX * t * 8) % 100 + 100) % 100;
        const driftedY = ((s.y + s.driftY * t * 8) % 100 + 100) % 100;
        const x = (driftedX / 100) * canvas.width;
        const y = (driftedY / 100) * canvas.height;

        ctx.beginPath();
        ctx.arc(x, y, s.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${alpha.toFixed(3)})`;
        ctx.fill();

        if (s.size > 1.2 && alpha > 0.35) {
          ctx.beginPath();
          ctx.arc(x, y, s.size * 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(180,170,255,${(alpha * 0.08).toFixed(3)})`;
          ctx.fill();
        }
      });

      animId = requestAnimationFrame(draw);
    };

    animId = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, [starsData]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ pointerEvents: "none" }}
    />
  );
};

/* ── Canvas: rare, slow falling stars ── */
const ShootingStarCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId;
    let shooters = [];
    let nextSpawnTime = performance.now() + 3000;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const scheduleNext = () => {
      nextSpawnTime = performance.now() + 8000 + Math.random() * 7000;
    };

    const spawn = () => {
      const startX = Math.random() * canvas.width * 0.6 + canvas.width * 0.2;
      const startY = Math.random() * canvas.height * 0.35;
      const angle = (Math.random() * 25 + 25) * (Math.PI / 180);
      const speed = Math.random() * 2 + 2;
      const tailLen = Math.random() * 80 + 50;

      shooters.push({
        x: startX,
        y: startY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        tailLen,
        life: 1,
        decay: 0.005 + Math.random() * 0.003,
      });
    };

    const draw = (now) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (now >= nextSpawnTime) {
        spawn();
        scheduleNext();
      }

      shooters = shooters.filter((s) => s.life > 0.01);

      shooters.forEach((s) => {
        s.x += s.vx;
        s.y += s.vy;
        s.life -= s.decay;
        if (s.life < 0) s.life = 0;

        const alpha = s.life;
        const mag = Math.sqrt(s.vx ** 2 + s.vy ** 2);
        const tailX = s.x - (s.vx / mag) * s.tailLen;
        const tailY = s.y - (s.vy / mag) * s.tailLen;

        const grad = ctx.createLinearGradient(s.x, s.y, tailX, tailY);
        grad.addColorStop(0, `rgba(220,215,255,${alpha.toFixed(3)})`);
        grad.addColorStop(0.35, `rgba(139,92,246,${(alpha * 0.5).toFixed(3)})`);
        grad.addColorStop(1, "rgba(139,92,246,0)");

        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(s.x, s.y);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;
        ctx.lineCap = "round";
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(s.x, s.y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${alpha.toFixed(3)})`;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(s.x, s.y, 6, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(167,139,250,${(alpha * 0.25).toFixed(3)})`;
        ctx.fill();
      });

      animId = requestAnimationFrame(draw);
    };

    animId = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ pointerEvents: "none" }}
    />
  );
};

/* ── Main Background ── */
const Background = () => {
  const { isDark } = useTheme();

  return (
    <div
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden"
      style={{
        background: isDark
          ? "linear-gradient(180deg, #020014 0%, #070b2a 25%, #0a0a2e 50%, #0d0820 75%, #050012 100%)"
          : "linear-gradient(135deg, #f0f0ff 0%, #e8e0ff 30%, #dbeafe 60%, #fce7f3 100%)",
        transition: "background 0.6s ease",
      }}
    >
      {isDark ? (
        <>
          {/* Dark mode: Nebula + Stars + Comets */}
          <div
            className="absolute inset-0"
            style={{
              background: `
                radial-gradient(ellipse 70% 50% at 15% 15%, rgba(124,58,237,0.1) 0%, transparent 60%),
                radial-gradient(ellipse 50% 60% at 85% 25%, rgba(6,182,212,0.06) 0%, transparent 55%),
                radial-gradient(ellipse 60% 40% at 50% 85%, rgba(236,72,153,0.05) 0%, transparent 55%)
              `,
            }}
          />

          {[
            { size: 400, color: "rgba(124,58,237,0.06)", top: "-5%", left: "5%", delay: "0s" },
            { size: 300, color: "rgba(6,182,212,0.04)", top: "40%", right: "0%", delay: "-5s" },
            { size: 250, color: "rgba(236,72,153,0.04)", bottom: "5%", left: "30%", delay: "-9s" },
          ].map((o, i) => (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                width: o.size,
                height: o.size,
                background: o.color,
                filter: "blur(100px)",
                top: o.top,
                left: o.left,
                right: o.right,
                bottom: o.bottom,
                animation: `floatOrb 18s ease-in-out infinite`,
                animationDelay: o.delay,
              }}
            />
          ))}

          <StarCanvas />
          <ShootingStarCanvas />

          <div
            className="absolute bottom-0 left-0 right-0 h-[15%]"
            style={{
              background:
                "linear-gradient(to top, rgba(124,58,237,0.03), transparent)",
            }}
          />
        </>
      ) : (
        <>
          {/* Light mode: soft pastel orbs */}
          <div
            className="absolute inset-0"
            style={{
              background: `
                radial-gradient(ellipse 60% 50% at 20% 20%, rgba(124,58,237,0.08) 0%, transparent 55%),
                radial-gradient(ellipse 50% 50% at 80% 30%, rgba(6,182,212,0.06) 0%, transparent 50%),
                radial-gradient(ellipse 55% 40% at 50% 80%, rgba(236,72,153,0.05) 0%, transparent 50%)
              `,
            }}
          />

          {[
            { size: 350, color: "rgba(124,58,237,0.06)", top: "5%", left: "10%", delay: "0s" },
            { size: 280, color: "rgba(6,182,212,0.05)", top: "45%", right: "5%", delay: "-4s" },
            { size: 220, color: "rgba(236,72,153,0.04)", bottom: "10%", left: "35%", delay: "-8s" },
          ].map((o, i) => (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                width: o.size,
                height: o.size,
                background: o.color,
                filter: "blur(80px)",
                top: o.top,
                left: o.left,
                right: o.right,
                bottom: o.bottom,
                animation: `floatOrb 20s ease-in-out infinite`,
                animationDelay: o.delay,
              }}
            />
          ))}
        </>
      )}

      <style>{`
        @keyframes floatOrb {
          0%,100% { transform: translate(0,0) scale(1); }
          33%      { transform: translate(15px,-20px) scale(1.02); }
          66%      { transform: translate(-10px,12px) scale(0.98); }
        }
      `}</style>
    </div>
  );
};

export default Background;