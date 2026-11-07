import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Cpu, Globe, RotateCcw, List } from "lucide-react";
import "./Sections.css";
import "./Skills.css";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, delay, ease: "easeOut" },
});

const DI = "https://cdn.jsdelivr.net/gh/devicons/devicon/icons";
const SI = "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons";

/* Skill data. `icon` = devicon path; `url` = full URL; `badge` = text badge used when no
   logo exists (or the logo fails to load); `mono` = dark logo recoloured light. */
const GROUPS = [
  { label: "Programming Languages", items: [
    { name: "Python", icon: "python/python-original.svg" },
    { name: "Java", icon: "java/java-original.svg" },
    { name: "C++", icon: "cplusplus/cplusplus-original.svg" },
    { name: "JavaScript", icon: "javascript/javascript-original.svg" },
    { name: "TypeScript", icon: "typescript/typescript-original.svg" },
    { name: "SQL", icon: "azuresqldatabase/azuresqldatabase-original.svg", badge: "SQL" },
  ]},
  { label: "Frontend & Mobile", items: [
    { name: "React", icon: "react/react-original.svg" },
    { name: "React Native", icon: "react/react-original.svg" },
    { name: "Expo", icon: "expo/expo-original.svg", mono: true, badge: "Expo" },
    { name: "HTML", icon: "html5/html5-original.svg" },
    { name: "CSS", icon: "css3/css3-original.svg" },
    { name: "Tailwind CSS", icon: "tailwindcss/tailwindcss-original.svg" },
  ]},
  { label: "Backend & APIs", items: [
    { name: "FastAPI", icon: "fastapi/fastapi-original.svg" },
    { name: "Node.js", icon: "nodejs/nodejs-original.svg" },
    { name: "Express", icon: "express/express-original.svg", mono: true },
    { name: "REST APIs", icon: "openapi/openapi-original.svg", mono: true, badge: "API" },
  ]},
  { label: "Databases", items: [
    { name: "PostgreSQL", icon: "postgresql/postgresql-original.svg" },
    { name: "SQLite", icon: "sqlite/sqlite-original.svg" },
    { name: "Qdrant", url: "https://qdrant.tech/images/logo_with_text.svg", mono: true, badge: "Qd" },
    { name: "MongoDB", icon: "mongodb/mongodb-original.svg" },
  ]},
  { label: "AI & Machine Learning", items: [
    { name: "Machine Learning", icon: "tensorflow/tensorflow-original.svg", badge: "ML" },
    { name: "Deep Learning", icon: "pytorch/pytorch-original.svg", badge: "DL" },
    { name: "RAG", icon: "elasticsearch/elasticsearch-original.svg", badge: "RAG" },
    { name: "LangChain", url: "https://raw.githubusercontent.com/langchain-ai/langchain/master/docs/static/img/brand/wordmark.png", mono: true, badge: "LC" },
    { name: "Ollama", url: "https://ollama.com/public/ollama.png", mono: true, badge: "Ol" },
    { name: "LLMs", icon: "openai/openai-original.svg", mono: true, badge: "LLM" },
    { name: "NLP", icon: "scikitlearn/scikitlearn-original.svg", badge: "NLP" },
  ]},
  { label: "Tools & DevOps", items: [
    { name: "Git", icon: "git/git-original.svg" },
    { name: "GitHub", icon: "github/github-original.svg", mono: true },
    { name: "Docker", icon: "docker/docker-original.svg" },
    { name: "Linux", icon: "linux/linux-original.svg" },
    { name: "VS Code", icon: "vscode/vscode-original.svg" },
    { name: "GCP", icon: "googlecloud/googlecloud-original.svg", badge: "GCP" },
  ]},
];

const SKILLS = [];
const GROUPS_IDX = GROUPS.map((g) => ({
  label: g.label,
  items: g.items.map((it) => {
    const idx = SKILLS.length;
    SKILLS.push({ ...it, category: g.label });
    return { ...it, idx };
  }),
}));

/* ── Geometry (built once) ─────────────────────────────────── */
const GOLDEN = Math.PI * (3 - Math.sqrt(5));
const fib = (n, i, off = 0.5) => {
  const y = 1 - (2 * (i + off)) / n;
  const r = Math.sqrt(Math.max(0, 1 - y * y));
  const a = i * GOLDEN;
  return [Math.cos(a) * r, y, Math.sin(a) * r];
};
const N = SKILLS.length;
// Interleave so neighbouring skills on the sphere are from different categories.
const STEP = [11, 13, 7, 5].find((s) => {
  const g = (a, b) => (b ? g(b, a % b) : a);
  return g(s, N) === 1;
}) || 1;
const ICON_PTS = SKILLS.map((_, i) => fib(N, (i * STEP) % N));

const MESH_N = 120;
const MESH_PTS = Array.from({ length: MESH_N }, (_, i) => fib(MESH_N, i, 0.3));
const MESH_EDGES = (() => {
  const set = new Set();
  const out = [];
  for (let i = 0; i < MESH_N; i++) {
    const d = [];
    for (let j = 0; j < MESH_N; j++) {
      if (i === j) continue;
      const dx = MESH_PTS[i][0] - MESH_PTS[j][0], dy = MESH_PTS[i][1] - MESH_PTS[j][1], dz = MESH_PTS[i][2] - MESH_PTS[j][2];
      d.push([dx * dx + dy * dy + dz * dz, j]);
    }
    d.sort((a, b) => a[0] - b[0]);
    for (let k = 0; k < 3; k++) {
      const j = d[k][1];
      const key = i < j ? `${i}-${j}` : `${j}-${i}`;
      if (!set.has(key)) { set.add(key); out.push([i, j]); }
    }
  }
  return out;
})();

const INITIAL = { yaw: 0.6, pitch: 0.25 };
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const wrap = (a) => ((((a + Math.PI) % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI)) - Math.PI;

const roundRect = (ctx, x, y, w, h, r) => {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
};

const Skills = () => {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const st = useRef({
    yaw: INITIAL.yaw, pitch: INITIAL.pitch, vy: 0, vp: 0, drag: false, idleAt: 0,
    target: null, hover: -1, selected: -1, items: [], w: 0, h: 0, R: 0, visible: true,
  }).current;

  const [selected, setSelected] = useState(-1);
  const [listOpen, setListOpen] = useState(() => typeof window !== "undefined" && window.innerWidth < 720);
  useEffect(() => { st.selected = selected; }, [selected, st]);

  const focusSkill = useCallback((i) => {
    setSelected(i);
    const p = ICON_PTS[i];
    st.target = { yaw: Math.atan2(-p[0], p[2]), pitch: clamp(Math.atan2(p[1], Math.hypot(p[0], p[2])), -1.2, 1.2) };
    st.vy = 0; st.vp = 0;
  }, [st]);

  const resetView = useCallback(() => {
    st.target = { ...INITIAL };
    st.vy = 0; st.vp = 0;
    setSelected(-1);
  }, [st]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const box = wrapRef.current;
    const ctx = canvas.getContext("2d");
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    let alive = true;

    /* Sprites (logos). Failed loads fall back to text badges. */
    const sprites = new Array(SKILLS.length).fill(null);
    SKILLS.forEach((s, i) => {
      if (!s.icon && !s.url) return;
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        if (!alive) return;
        if (s.mono) {
          const c = document.createElement("canvas");
          c.width = c.height = 128;
          const g = c.getContext("2d");
          g.drawImage(img, 0, 0, 128, 128);
          g.globalCompositeOperation = "source-in";
          g.fillStyle = "#e6e6e6";
          g.fillRect(0, 0, 128, 128);
          sprites[i] = c;
        } else sprites[i] = img;
      };
      img.src = s.url || `${DI}/${s.icon}`;
    });

    const resize = () => {
      const r = box.getBoundingClientRect();
      const w = Math.max(1, r.width), h = Math.max(1, r.height);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      st.w = w; st.h = h; st.R = Math.min(w, h) * 0.38;
    };
    const ro = new ResizeObserver(resize);
    ro.observe(box);
    resize();

    const io = new IntersectionObserver(([e]) => { st.visible = e.isIntersecting; }, { threshold: 0 });
    io.observe(box);

    /* ── Drawing ── */
    const draw = () => {
      const { w, h, R } = st;
      ctx.clearRect(0, 0, w, h);
      const cx = w / 2, cy = h / 2 - 8, D = R * 3.4;
      const cyw = Math.cos(st.yaw), syw = Math.sin(st.yaw), cp = Math.cos(st.pitch), sp = Math.sin(st.pitch);
      const rot = (p) => {
        const x1 = p[0] * cyw + p[2] * syw, z1 = -p[0] * syw + p[2] * cyw;
        return [x1, p[1] * cp - z1 * sp, p[1] * sp + z1 * cp];
      };
      const base = Math.max(R * 0.17, 28);

      // icon projection
      const items = SKILLS.map((_, i) => {
        const [x, y, z] = rot(ICON_PTS[i]);
        const rr = R * 1.1;
        const k = D / (D - z * rr);
        return { i, z, sx: cx + x * rr * k, sy: cy - y * rr * k, k, size: base * k * 0.85 };
      }).sort((a, b) => a.z - b.z);
      st.items = items;

      const drawIcon = (it) => {
        const s = SKILLS[it.i];
        const t = (it.z + 1) / 2;
        const isHover = st.hover === it.i, isSel = st.selected === it.i;
        const alpha = isHover || isSel ? 1 : it.z > 0 ? 0.55 + 0.45 * t : 0.15 + 0.5 * t;
        const size = it.size * (isHover ? 1.3 : 1);
        ctx.globalAlpha = alpha;
        const sprite = sprites[it.i];
        if (sprite) ctx.drawImage(sprite, it.sx - size / 2, it.sy - size / 2, size, size);
        else {
          const badgeText = s.badge || s.name.slice(0, 2).toUpperCase();
          roundRect(ctx, it.sx - size / 2, it.sy - size / 2, size, size, size * 0.24);
          ctx.fillStyle = "rgba(255,107,53,0.14)"; ctx.fill();
          ctx.lineWidth = 1.5; ctx.strokeStyle = "rgba(255,107,53,0.85)"; ctx.stroke();
          ctx.fillStyle = "#ff8a5c";
          ctx.font = `700 ${size * (badgeText.length > 2 ? 0.3 : 0.38)}px var(--font-mono, monospace)`;
          ctx.textAlign = "center"; ctx.textBaseline = "middle";
          ctx.fillText(badgeText, it.sx, it.sy + 1);
        }
        if (isSel) {
          ctx.beginPath(); ctx.arc(it.sx, it.sy, size * 0.78, 0, Math.PI * 2);
          ctx.lineWidth = 2; ctx.strokeStyle = "#ff6b35"; ctx.setLineDash([4, 3]); ctx.stroke(); ctx.setLineDash([]);
        }
        const fs = Math.max(10, 11 * it.k) * (isHover ? 1.15 : 1);
        ctx.font = `${isHover || isSel ? 700 : 500} ${fs}px var(--font-mono, monospace)`;
        ctx.textAlign = "center"; ctx.textBaseline = "top";
        ctx.fillStyle = isSel ? "#ff8a5c" : isHover ? "#ffffff" : "#b9bec7";
        ctx.fillText(s.name, it.sx, it.sy + size / 2 + 4);
        ctx.globalAlpha = 1;
      };

      // 1) back-side icons
      items.forEach((it) => { if (it.z < 0 && st.hover !== it.i) drawIcon(it); });

      // 2) sphere body
      const sr = R * 1.03;
      const g = ctx.createRadialGradient(cx - sr * 0.25, cy - sr * 0.3, sr * 0.1, cx, cy, sr);
      g.addColorStop(0, "rgba(30,28,27,0.82)");
      g.addColorStop(1, "rgba(14,13,13,0.9)");
      ctx.beginPath(); ctx.arc(cx, cy, sr, 0, Math.PI * 2); ctx.fillStyle = g; ctx.fill();
      ctx.lineWidth = 5; ctx.strokeStyle = "rgba(255,107,53,0.1)"; ctx.stroke();

      // 3) wireframe (two batches: back dim, front bright)
      const pts = MESH_PTS.map((p) => {
        const [x, y, z] = rot(p);
        const k = D / (D - z * R);
        return [cx + x * R * k, cy - y * R * k, z];
      });
      ctx.lineWidth = 1;
      for (const front of [false, true]) {
        ctx.beginPath();
        for (const [a, b] of MESH_EDGES) {
          const pa = pts[a], pb = pts[b];
          if (((pa[2] + pb[2]) / 2 > 0) !== front) continue;
          ctx.moveTo(pa[0], pa[1]); ctx.lineTo(pb[0], pb[1]);
        }
        ctx.strokeStyle = front ? "rgba(255,107,53,0.34)" : "rgba(255,107,53,0.1)";
        ctx.stroke();
      }
      ctx.fillStyle = "rgba(255,150,100,0.55)";
      for (const p of pts) if (p[2] > 0.1) ctx.fillRect(p[0] - 1, p[1] - 1, 2, 2);

      // 4) front icons, hovered last (on top)
      items.forEach((it) => { if (it.z >= 0 && st.hover !== it.i) drawIcon(it); });
      const hov = items.find((it) => it.i === st.hover);
      if (hov) drawIcon(hov);
    };

    /* ── Loop ── */
    let raf, last = performance.now();
    const tick = (now) => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!st.visible || document.hidden || !st.w) return;
      if (!st.drag) {
        if (st.target) {
          const dy = wrap(st.target.yaw - st.yaw), dp = st.target.pitch - st.pitch, f = Math.min(1, dt * 6);
          st.yaw += dy * f; st.pitch += dp * f;
          if (Math.abs(dy) < 0.002 && Math.abs(dp) < 0.002) { st.target = null; st.idleAt = now; }
        } else {
          st.yaw += st.vy; st.pitch = clamp(st.pitch + st.vp, -1.2, 1.2);
          st.vy *= 0.95; st.vp *= 0.95;
          if (!reduce && st.hover < 0 && now - st.idleAt > 1500 && Math.abs(st.vy) < 0.0006) st.yaw += 0.15 * dt;
        }
      }
      draw();
    };
    raf = requestAnimationFrame(tick);

    /* ── Pointer input ── */
    let down = null;
    const pos = (e) => { const r = canvas.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
    const hit = (x, y) => {
      for (let k = st.items.length - 1; k >= 0; k--) {
        const it = st.items[k];
        if (it.z < -0.2) continue;
        if (Math.hypot(x - it.sx, y - it.sy) <= Math.max(it.size * 0.6, 22)) return it.i;
      }
      return -1;
    };
    const onDown = (e) => {
      const [x, y] = pos(e);
      down = { px: x, py: y, moved: 0 };
      st.drag = true; st.vy = 0; st.vp = 0; st.target = null;
      canvas.setPointerCapture?.(e.pointerId);
      canvas.classList.add("is-dragging");
    };
    const onMove = (e) => {
      const [x, y] = pos(e);
      if (down) {
        const dx = x - down.px, dy = y - down.py;
        down.px = x; down.py = y; down.moved += Math.abs(dx) + Math.abs(dy);
        st.yaw += dx * 0.006; st.pitch = clamp(st.pitch + dy * 0.006, -1.2, 1.2);
        st.vy = reduce ? 0 : dx * 0.006; st.vp = reduce ? 0 : dy * 0.006;
      } else {
        const h = hit(x, y);
        if (h !== st.hover) { st.hover = h; canvas.classList.toggle("is-hover", h >= 0); }
      }
    };
    const onUp = (e) => {
      if (!down) return;
      const [x, y] = pos(e);
      const wasClick = down.moved < 6;
      down = null; st.drag = false; st.idleAt = performance.now();
      canvas.classList.remove("is-dragging");
      canvas.releasePointerCapture?.(e.pointerId);
      if (wasClick) { const h = hit(x, y); if (h >= 0) focusSkill(h); }
    };
    const onLeave = () => { if (!down) { st.hover = -1; canvas.classList.remove("is-hover"); } };
    const onKey = (e) => {
      const m = { ArrowLeft: [-0.12, 0], ArrowRight: [0.12, 0], ArrowUp: [0, -0.12], ArrowDown: [0, 0.12] }[e.key];
      if (!m) return;
      e.preventDefault();
      st.target = null; st.yaw += m[0]; st.pitch = clamp(st.pitch + m[1], -1.2, 1.2); st.idleAt = performance.now();
    };
    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointercancel", onUp);
    canvas.addEventListener("pointerleave", onLeave);
    canvas.addEventListener("keydown", onKey);

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      ro.disconnect(); io.disconnect();
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointercancel", onUp);
      canvas.removeEventListener("pointerleave", onLeave);
      canvas.removeEventListener("keydown", onKey);
    };
  }, [st, focusSkill]);

  const sel = selected >= 0 ? SKILLS[selected] : null;

  return (
    <section id="skills" className="sect skills" aria-labelledby="skills-title">
      <div className="sect__bg" aria-hidden="true" />
      <div className="sect__inner">
        <motion.h2 {...fadeUp(0)} id="skills-title" className="sect__title">
          <span className="sect__icon"><Cpu size={34} aria-hidden="true" /></span># Skills.json
        </motion.h2>

        <motion.div {...fadeUp(0.1)} className="skills__stage">
          <div className="skills__canvaswrap" ref={wrapRef}>
            <canvas
              ref={canvasRef}
              className="skills__canvas"
              tabIndex={0}
              role="img"
              aria-label="Interactive 3D skills sphere. Drag or use arrow keys to rotate. A full keyboard-accessible skill list is available below."
            />
          </div>

          <div className={`skills__detail${sel ? "" : " skills__detail--empty"}`} role="status" aria-live="polite">
            <div className="skills__detail-k">{sel ? "Selected" : "Tip"}</div>
            <div className="skills__detail-name">{sel ? sel.name : "Pick a technology"}</div>
            <div className="skills__detail-cat">{sel ? sel.category : "Click an icon or use the list below"}</div>
          </div>

          <div className="skills__bar">
            <span className="skills__pill"><Globe size={18} aria-hidden="true" /> Drag to explore skills universe</span>
            <button type="button" className="skills__reset" onClick={resetView} aria-label="Reset sphere view">
              <RotateCcw size={16} aria-hidden="true" />
            </button>
          </div>
        </motion.div>

        <div className="skills__listwrap">
          <button type="button" className="skills__toggle" aria-expanded={listOpen} aria-controls="skills-list" onClick={() => setListOpen((v) => !v)}>
            <List size={15} aria-hidden="true" /> {listOpen ? "Hide" : "Show"} skills as list
          </button>
          {listOpen && (
            <div id="skills-list" className="skills__list">
              {GROUPS_IDX.map((g) => (
                <div key={g.label} className="skills__group">
                  <h3>{g.label}</h3>
                  <ul>
                    {g.items.map((it) => (
                      <li key={it.idx}>
                        <button type="button" className="skills__chip" aria-pressed={selected === it.idx} onClick={() => focusSkill(it.idx)}>
                          {it.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Skills;
