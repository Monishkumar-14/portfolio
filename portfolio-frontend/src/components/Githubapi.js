/* Pure GitHub REST helpers (no React). Public, unauthenticated; no secrets in the frontend.
   - Pagination via Link header, 30-minute localStorage cache, ETag revalidation (304s are free),
   - in-flight request de-duplication, explicit rate-limit / network error kinds. */
import { GITHUB_USER } from "./Projectsdata";

const API = "https://api.github.com";
export const TTL_MS = 30 * 60 * 1000;
const inflight = new Map();

export class GithubError extends Error {
  constructor(kind, message, extra = {}) { super(message); this.kind = kind; Object.assign(this, extra); }
}

export const safeUrl = (u) => {
  if (!u || typeof u !== "string") return null;
  try {
    const x = new URL(/^https?:\/\//i.test(u.trim()) ? u.trim() : `https://${u.trim()}`);
    return /^https?:$/.test(x.protocol) && x.hostname.includes(".") ? x.href : null;
  } catch { return null; }
};

export const normalize = (r) => ({
  id: r.id, name: r.name, fullName: r.full_name, description: r.description || null, url: r.html_url,
  homepage: safeUrl(r.homepage), visibility: r.visibility || (r.private ? "private" : "public"),
  isPrivate: !!r.private, language: r.language || null, topics: Array.isArray(r.topics) ? r.topics : [],
  stars: r.stargazers_count ?? null, forks: r.forks_count ?? null, updatedAt: r.updated_at || null,
  defaultBranch: r.default_branch || null, fork: !!r.fork,
});

export const timeAgo = (iso, now = Date.now()) => {
  if (!iso) return null;
  const d = (now - new Date(iso).getTime()) / 864e5;
  if (!(d >= 0)) return "today";
  if (d < 1) return "today";
  if (d < 2) return "yesterday";
  if (d < 31) return `${Math.floor(d)} days ago`;
  if (d < 365) { const m = Math.max(1, Math.floor(d / 30.4)); return `${m} month${m > 1 ? "s" : ""} ago`; }
  const y = Math.floor(d / 365); return `${y} year${y > 1 ? "s" : ""} ago`;
};

const store = {
  read(key) { try { return JSON.parse(localStorage.getItem(key)); } catch { return null; } },
  write(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch { /* storage full/blocked: ignore */ } },
};

async function ghFetch(url, etag) {
  let res;
  try {
    res = await fetch(url, { headers: { Accept: "application/vnd.github+json", ...(etag ? { "If-None-Match": etag } : {}) } });
  } catch (e) { throw new GithubError("network", "Could not reach GitHub."); }
  if (res.status === 304) return { notModified: true, res };
  if (res.status === 429 || (res.status === 403 && res.headers.get("x-ratelimit-remaining") === "0")) {
    const reset = Number(res.headers.get("x-ratelimit-reset"));
    throw new GithubError("rate_limit", "GitHub API rate limit reached.", { resetAt: reset ? reset * 1000 : null });
  }
  if (res.status === 404) throw new GithubError("not_found", "Not found.");
  if (!res.ok) throw new GithubError("http", `GitHub responded with ${res.status}.`);
  return { res, data: await res.json() };
}

const dedupe = (key, fn) => {
  if (inflight.has(key)) return inflight.get(key);
  const p = fn().finally(() => inflight.delete(key));
  inflight.set(key, p);
  return p;
};

export const OWNER_KEY = `gh-repos:v1:${GITHUB_USER}`;

/** All public repos owned by the user (paginated). Returns { repos, fetchedAt, fromCache }. */
export function loadOwnerRepos() {
  return dedupe(OWNER_KEY, async () => {
    const cached = store.read(OWNER_KEY);
    if (cached && Date.now() - cached.ts < TTL_MS) return { repos: cached.data, fetchedAt: cached.ts, fromCache: true };
    try {
      const all = []; let etag = null;
      for (let page = 1; page <= 10; page++) {
        const url = `${API}/users/${GITHUB_USER}/repos?type=owner&sort=updated&per_page=100&page=${page}`;
        const r = await ghFetch(url, page === 1 ? cached?.etag : null);
        if (r.notModified) { store.write(OWNER_KEY, { ...cached, ts: Date.now() }); return { repos: cached.data, fetchedAt: Date.now(), fromCache: true }; }
        if (page === 1) etag = r.res.headers.get("etag");
        all.push(...r.data.filter((x) => !x.private).map(normalize));
        if (!/rel="next"/.test(r.res.headers.get("link") || "")) break;
      }
      store.write(OWNER_KEY, { ts: Date.now(), etag, data: all });
      return { repos: all, fetchedAt: Date.now(), fromCache: false };
    } catch (e) {
      if (cached) throw Object.assign(e, { stale: { repos: cached.data, fetchedAt: cached.ts } });
      throw e;
    }
  });
}

/** One repo by "owner/name" (used for pinned repos that live under other accounts). null on failure. */
export function loadRepo(fullName) {
  const key = `gh-repo:v1:${fullName.toLowerCase()}`;
  return dedupe(key, async () => {
    const cached = store.read(key);
    if (cached && Date.now() - cached.ts < TTL_MS) return cached.data;
    try {
      const r = await ghFetch(`${API}/repos/${fullName}`, cached?.etag);
      if (r.notModified) { store.write(key, { ...cached, ts: Date.now() }); return cached.data; }
      const data = normalize(r.data);
      store.write(key, { ts: Date.now(), etag: r.res.headers.get("etag"), data });
      return data;
    } catch { return cached?.data ?? null; }
  });
}