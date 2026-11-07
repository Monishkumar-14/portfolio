import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  FolderOpen, Book, Star, GitFork, ExternalLink, ArrowRight, X, RefreshCw, AlertTriangle, Github,
} from "lucide-react";
import "./Sections.css";
import "./Projects.css";
import {
  GITHUB_USER, ALL_REPOS_URL, FALLBACK_REPOS, FALLBACK_TOTAL, FALLBACK_VERIFIED_ON, PINNED,
} from "./Projectsdata";
import { loadOwnerRepos, loadRepo, timeAgo } from "./githubApi";

const fadeUp = (delay = 0, reduce = false) => ({
  initial: { opacity: 0, y: reduce ? 0 : 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, delay, ease: "easeOut" },
});

const LANG_COLORS = {
  JavaScript: "#f1e05a", TypeScript: "#3178c6", Python: "#3572a5", Java: "#b07219", C: "#555555", "C++": "#f34b7d",
  HTML: "#e34c26", CSS: "#563d7c", "Jupyter Notebook": "#da5b0b", Shell: "#89e051", Dart: "#00b4ab", Kotlin: "#a97bff", Go: "#00add8",
};
const langColor = (l) => LANG_COLORS[l] || "#8b949e";
const keyOf = (fullName) => fullName?.toLowerCase() ?? null;

/* ── Data hook: live GitHub data → cached/stale → verified fallback ── */
const useRepos = () => {
  const [s, setS] = useState({ status: "loading", repos: [], extra: {}, error: null, fetchedAt: null });
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    let alive = true;
    setS((p) => ({ ...p, status: "loading", error: null }));
    loadOwnerRepos()
      .then(({ repos, fetchedAt }) => alive && setS((p) => ({ ...p, status: "live", repos, fetchedAt, error: null })))
      .catch((e) => {
        if (!alive) return;
        if (e.stale) setS((p) => ({ ...p, status: "stale", repos: e.stale.repos, fetchedAt: e.stale.fetchedAt, error: e }));
        else setS((p) => ({ ...p, status: "fallback", repos: FALLBACK_REPOS, error: e }));
      });

    // Pinned repos that live under other accounts: fetch their public metadata individually.
    const others = PINNED.filter((p) => p.repo && !p.repo.toLowerCase().startsWith(`${GITHUB_USER.toLowerCase()}/`));
    Promise.all(others.map((p) => loadRepo(p.repo).then((d) => [keyOf(p.repo), d]))).then((entries) => {
      if (alive) setS((p) => ({ ...p, extra: Object.fromEntries(entries.filter(([, d]) => d)) }));
    });
    return () => { alive = false; };
  }, [nonce]);

  return { ...s, reload: () => setNonce((n) => n + 1) };
};

/* ── Small pieces ── */
const Lang = ({ name }) => name ? (
  <span className="pj-lang"><i style={{ background: langColor(name) }} aria-hidden="true" />{name}</span>
) : null;

const Counts = ({ stars, forks }) => (stars == null && forks == null) ? null : (
  <>
    {stars != null && <span className="pj-count" title={`${stars} stars`}><Star size={15} aria-hidden="true" />{stars}<span className="pj-sr">stars</span></span>}
    {forks != null && <span className="pj-count" title={`${forks} forks`}><GitFork size={15} aria-hidden="true" />{forks}<span className="pj-sr">forks</span></span>}
  </>
);

const statusMessage = (s) => {
  if (s.status === "stale") return `Live refresh failed — showing data cached ${timeAgo(new Date(s.fetchedAt).toISOString())}.`;
  if (s.status !== "fallback") return null;
  const why = s.error?.kind === "rate_limit"
    ? `GitHub's API rate limit was reached${s.error.resetAt ? ` (resets ${new Date(s.error.resetAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })})` : ""}`
    : s.error?.kind === "network" ? "GitHub could not be reached" : "GitHub returned an error";
  return `${why}. Showing ${FALLBACK_REPOS.length} of ${FALLBACK_TOTAL} public repositories, verified ${FALLBACK_VERIFIED_ON}.`;
};

const Sidebar = ({ data, selected, onSelect }) => {
  const { status, repos, reload } = data;
  const msg = statusMessage(data);
  const count = status === "fallback" ? `${repos.length} / ${FALLBACK_TOTAL}` : status === "loading" ? "…" : repos.length;
  return (
    <aside className="pj-side" aria-label="Repositories">
      <header className="pj-side__head">
        <Book size={20} aria-hidden="true" />
        <h3>Repositories</h3>
        <span className="pj-badge" aria-label={`${count} public repositories`}>{count}</span>
      </header>

      {msg && (
        <div className="pj-note" role="status">
          <AlertTriangle size={14} aria-hidden="true" /><span>{msg}</span>
          <button type="button" onClick={reload}><RefreshCw size={12} aria-hidden="true" /> Retry</button>
        </div>
      )}

      <div className="pj-side__scroll" tabIndex={0} aria-busy={status === "loading"}>
        {status === "loading" && (
          <ul className="pj-list" aria-hidden="true">
            {[0, 1, 2, 3, 4].map((i) => <li key={i} className="pj-skel"><span /><span /></li>)}
          </ul>
        )}
        {status !== "loading" && repos.length === 0 && <p className="pj-empty">No public repositories found for {GITHUB_USER}.</p>}
        {status !== "loading" && repos.length > 0 && (
          <ul className="pj-list">
            {repos.map((r) => {
              const isSel = selected === keyOf(r.fullName);
              const ago = timeAgo(r.updatedAt);
              return (
                <li key={r.id}>
                  <button type="button" className={`pj-item${isSel ? " is-selected" : ""}`} aria-current={isSel ? "true" : undefined} onClick={() => onSelect(isSel ? null : keyOf(r.fullName))}>
                    <span className="pj-item__top">
                      <span className="pj-item__name" title={r.name}>{r.name}</span>
                      <span className="pj-pill">{r.fork ? "Fork" : r.visibility === "public" ? "Public" : r.visibility}</span>
                    </span>
                    <span className="pj-item__meta">
                      <Lang name={r.language} />
                      {ago && <span className="pj-ago">Updated {ago}</span>}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </aside>
  );
};

const SelectedPanel = ({ repo, cfg, onClose }) => {
  const desc = repo.description || cfg?.description || null;
  const topics = repo.topics.length ? repo.topics : cfg?.tech || [];
  const demo = repo.homepage || cfg?.demo || null;
  const ago = timeAgo(repo.updatedAt);
  return (
    <section className="pj-detail" aria-label={`Selected repository ${repo.name}`} aria-live="polite">
      <div className="pj-detail__top">
        <h4 className="pj-detail__name">{repo.fullName}</h4>
        <span className="pj-pill">{repo.fork ? "Fork" : "Public"}</span>
        <button type="button" className="pj-x" onClick={onClose} aria-label="Clear selection"><X size={16} aria-hidden="true" /></button>
      </div>
      <p className="pj-detail__desc">{desc || "No description provided on GitHub."}</p>
      {topics.length > 0 && <ul className="pj-chips">{topics.map((t) => <li key={t} className="pj-chip">{t}</li>)}</ul>}
      <div className="pj-detail__meta">
        <Lang name={repo.language} /><Counts stars={repo.stars} forks={repo.forks} />
        {ago && <span className="pj-ago">Updated {ago}</span>}
        <span className="pj-detail__links">
          <a className="pj-btn pj-btn--solid" href={repo.url} target="_blank" rel="noreferrer"><Github size={14} aria-hidden="true" /> View on GitHub</a>
          {demo && <a className="pj-btn" href={demo} target="_blank" rel="noreferrer">Demo <ExternalLink size={13} aria-hidden="true" /></a>}
        </span>
      </div>
    </section>
  );
};

const KIND_BADGE = { own: "Public", team: "Team repo", portfolio: "Portfolio" };
const KIND_TITLE = {
  own: "Public repository on your GitHub account",
  team: "Public repository owned by a teammate's account",
  portfolio: "Portfolio project — no public repository",
};

const PinnedCard = ({ cfg, live, selected }) => {
  const url = live?.url || (cfg.repo ? `https://github.com/${cfg.repo}` : null);
  const desc = cfg.description || live?.description || "";
  const tech = cfg.tech?.length ? cfg.tech : live?.topics || [];
  const demo = live?.homepage || cfg.demo || null;
  return (
    <article id={`pj-card-${cfg.key}`} className={`pj-card${selected ? " is-selected" : ""}`} aria-labelledby={`pj-t-${cfg.key}`}>
      <header className="pj-card__head">
        <Book size={18} aria-hidden="true" className="pj-card__icon" />
        <h4 id={`pj-t-${cfg.key}`} className="pj-card__title">
          {url ? <a href={url} target="_blank" rel="noreferrer" title={`${cfg.title} on GitHub`}>{cfg.title}</a> : cfg.title}
        </h4>
        <span className="pj-pill" title={KIND_TITLE[cfg.kind]}>{KIND_BADGE[cfg.kind]}</span>
      </header>
      {cfg.kind === "team" && <p className="pj-card__repo">{cfg.repo}</p>}
      <p className="pj-card__desc">{desc}</p>
      <ul className="pj-chips" aria-label="Technologies">{tech.map((t) => <li key={t} className="pj-chip">{t}</li>)}</ul>
      <footer className="pj-card__foot">
        <Lang name={live?.language} />
        <Counts stars={live?.stars ?? null} forks={live?.forks ?? null} />
        <span className="pj-card__actions">
          {url && <a className="pj-btn pj-btn--icon" href={url} target="_blank" rel="noreferrer" aria-label={`${cfg.title} source on GitHub`}><Github size={15} aria-hidden="true" /></a>}
          {demo && <a className="pj-btn" href={demo} target="_blank" rel="noreferrer" aria-label={`${cfg.title} live demo`}>Demo <ExternalLink size={13} aria-hidden="true" /></a>}
        </span>
      </footer>
    </article>
  );
};

const Projects = () => {
  const reduce = useReducedMotion();
  const data = useRepos();
  const [selected, setSelected] = useState(null);

  const byName = useMemo(() => {
    const m = new Map();
    data.repos.forEach((r) => m.set(keyOf(r.fullName), r));
    return m;
  }, [data.repos]);
  const cfgByName = useMemo(() => new Map(PINNED.filter((p) => p.repo).map((p) => [keyOf(p.repo), p])), []);
  const selectedRepo = selected ? byName.get(selected) : null;

  // Bring the matching pinned card into view when a pinned repo is chosen in the sidebar.
  const prev = useRef(null);
  useEffect(() => {
    const cfg = selected && cfgByName.get(selected);
    if (cfg && prev.current !== selected) {
      document.getElementById(`pj-card-${cfg.key}`)?.scrollIntoView({ block: "nearest", behavior: reduce ? "auto" : "smooth" });
    }
    prev.current = selected;
  }, [selected, cfgByName, reduce]);

  return (
    <section id="projects" className="sect proj" aria-labelledby="proj-title">
      <div className="sect__bg" aria-hidden="true" />
      <div className="sect__inner">
        <motion.h2 {...fadeUp(0, reduce)} id="proj-title" className="sect__title">
          <span className="sect__icon"><FolderOpen size={34} aria-hidden="true" /></span>$ ls -la ~/projects
        </motion.h2>

        <div className="proj__grid">
          <motion.div {...fadeUp(0.1, reduce)} className="proj__left">
            <Sidebar data={data} selected={selected} onSelect={setSelected} />
          </motion.div>

          <motion.div {...fadeUp(0.15, reduce)} className="proj__right">
            <h3 className="proj__label">Pinned Projects</h3>
            {selectedRepo && <SelectedPanel repo={selectedRepo} cfg={cfgByName.get(selected)} onClose={() => setSelected(null)} />}
            <div className="proj__cards">
              {PINNED.map((cfg) => {
                const k = keyOf(cfg.repo);
                const live = k ? byName.get(k) || data.extra[k] || null : null;
                return <PinnedCard key={cfg.key} cfg={cfg} live={live} selected={!!k && selected === k} />;
              })}
            </div>
          </motion.div>
        </div>

        <div className="proj__all">
          <a href={ALL_REPOS_URL} target="_blank" rel="noreferrer">View all repositories <ArrowRight size={18} aria-hidden="true" /></a>
        </div>
      </div>
    </section>
  );
};

export default Projects;