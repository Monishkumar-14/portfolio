/* Local, curated project configuration — kept separate from presentation.
   Everything here was verified on 2 Nov 2026 against github.com pages and raw READMEs,
   or comes unchanged from your previous Projects.jsx (marked "portfolio"). */

export const GITHUB_USER = "Monishkumar-14";
export const PROFILE_URL = `https://github.com/${GITHUB_USER}`;
export const ALL_REPOS_URL = `${PROFILE_URL}?tab=repositories`;

/* Shown ONLY when the GitHub API is unreachable and nothing is cached.
   Source: the public profile page + repo pages, read on 2 Nov 2026 (profile said "12 repositories"). */
export const FALLBACK_TOTAL = 12;
export const FALLBACK_VERIFIED_ON = "2 Nov 2026";
const fb = (name, language = null, extra = {}) => ({
  id: name, name, fullName: `${GITHUB_USER}/${name}`, url: `${PROFILE_URL}/${name}`,
  description: null, homepage: null, visibility: "public", isPrivate: false, language,
  topics: [], stars: null, forks: null, updatedAt: null, fork: false, ...extra,
});
export const FALLBACK_REPOS = [
  fb("placetrack", null, { homepage: "https://placetrack-beta.vercel.app/", stars: 0, forks: 0 }),
  fb("online_recipe_sharing_platform", "JavaScript"),
  fb("MERN-groceries", "JavaScript"),
  fb("Smart-Periodic-table", "C"),
  fb("ML-unit-test", "Jupyter Notebook"),
  fb("Unit_test"),
  fb("ML-LAB-BATCH-1", "Jupyter Notebook", { fork: true, description: "upload your Machine learning lab exercises" }),
];

/* Pinned selection. Add/remove entries here to change what is pinned.
   kind: "own"       = repo under your account
         "team"      = public repo under a teammate's account (verified to exist)
         "portfolio" = project with no public repo; shown from your existing portfolio data
   description/tech: verified against the repo README where one exists (source noted),
   otherwise carried over from your previous Projects.jsx. Unverified metrics were removed. */
export const PINNED = [
  {
    key: "sparechange", kind: "team", repo: "GUNASEKHAR5/SPARE_CHANGE", title: "SpareChange",
    description: "Micro-savings platform that rounds up transactions and allocates the spare change across savings, investments or donations, with an ML recommendation engine.", // portfolio (repo README is title-only)
    tech: ["ReactJS", "Node.js", "Express", "PostgreSQL", "JWT", "Python", "scikit-learn"],
  },
  {
    key: "placetrack", kind: "own", repo: "Monishkumar-14/placetrack", title: "PlaceTrack",
    description: "Placement management platform for college students to track campus recruitment with real-time analytics and a visual pipeline.", // portfolio (repo has no README)
    tech: ["React 19", "TypeScript", "FastAPI", "PostgreSQL", "Tailwind v4", "Shadcn/UI", "JWT"],
    demo: "https://placetrack-beta.vercel.app/", // also set as the repo's website on GitHub
  },
  {
    key: "ingre2recipe", kind: "team", repo: "SankaraKrishnan12/ingre-to-recipe", title: "Ingre2Recipe",
    description: "Machine-learning web app that recommends Indian recipes from the ingredients you have, using dual TF-IDF and Word2Vec engines with region and diet filters.", // README
    tech: ["React.js", "Tailwind CSS", "Flask", "scikit-learn", "gensim", "SQLite", "pandas", "NumPy"],
  },
  {
    key: "spareparts", kind: "team", repo: "Gogul11/SpareParts_Management_System", title: "SpareParts Management",
    description: "Web application for managing spare-parts inventory and transactions with three roles: users browse and order, admins manage users, suppliers and categories, and suppliers manage listings.", // README
    tech: ["React JS", "Node.js", "PostgreSQL"],
  },
  {
    key: "gitgraph", kind: "team", repo: "Gogul11/GIT-Simulator", title: "Git Graph Simulator",
    description: "Web-based tool that simulates and visualises Git commits, branching and merging as a commit graph, with a C++ (Crow) backend implementing the Git logic.", // README
    tech: ["C++", "Crow", "React", "Cytoscape.js", "Axios"],
    demo: "https://git-simulator-eight.vercel.app/", // link given in the repo README
  },
  {
    key: "xv6", kind: "team", repo: "Sithishwar/Schedulingalgo_xv6", title: "Synchronization in xv6",
    description: "Thread-like concurrency in xv6 using fork()/pipe() with custom spinlock synchronization.", // portfolio (repo has no README)
    tech: ["C", "xv6", "fork()", "pipe()", "Spinlocks"],
  },
  {
    key: "recipe-platform", kind: "own", repo: "Monishkumar-14/online_recipe_sharing_platform", title: "Online Recipe Sharing Platform",
    description: "Full-stack recipe sharing application where users register, log in, create and browse recipes, and rate and comment on them.", // README
    tech: ["Spring Boot", "Java", "React", "PostgreSQL"],
  },
  {
    key: "iot-attendance", kind: "portfolio", repo: null, title: "IoT Smart Attendance",
    description: "ESP32 + RFID attendance system with real-time cloud sync to Google Sheets and Blynk mobile monitoring.", // portfolio (no public repository)
    tech: ["ESP32", "RFID", "Google Sheets", "Blynk IoT", "C++"],
  },
];