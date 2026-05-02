import mongoose   from "mongoose";
import dotenv     from "dotenv";
import Admin      from "../models/Admin.js";
import Project    from "../models/Project.js";
import Certificate from "../models/Certificate.js";

dotenv.config();

const PROJECTS = [
  {
    title: "SpareChange",
    description: "A full-stack micro-savings platform that rounds transactions and allocates spare change across savings, investments, or donations — powered by an ML recommendation engine.",
    techStack: ["ReactJS", "Node.js", "Express", "PostgreSQL", "JWT", "RBAC", "Python", "scikit-learn"],
    githubLink: "https://github.com/Monishkumar-14/SpareChange",
    liveLink: "",
    category: "Full Stack",
    status: "Live",
    featured: true,
    order: 1,
    caseStudy: {
      problem:   "Users lack simple tools to automate micro-savings without behavioural change.",
      approach:  "PERN stack with normalised DB schema + content-based ML on spending patterns.",
      challenge: "Building sub-200ms APIs across 6 normalised PostgreSQL tables with RBAC.",
      outcome:   "Automated allocation with ML suggestions — ~40% accuracy gain over random baseline.",
    },
  },
  {
    title: "Ingre2Recipe",
    description: "NLP-based ingredient parser using TF-IDF similarity scoring on 1,000+ recipes with a collaborative filtering recommendation layer.",
    techStack: ["Python", "TF-IDF", "NLP", "scikit-learn", "pandas", "NumPy", "Collaborative Filtering"],
    githubLink: "https://github.com/Monishkumar-14/Ingre2Recipe",
    liveLink: "",
    category: "ML / AI",
    status: "Live",
    order: 2,
    caseStudy: {
      problem:   "Users struggle to find recipes using only what's in their kitchen.",
      approach:  "TF-IDF tokenises ingredients; collaborative filtering surfaces personalised recipes.",
      challenge: "Partial matches and misspellings required fuzzy matching logic.",
      outcome:   "85%+ accuracy on 1,000+ recipe dataset with modular, extensible architecture.",
    },
  },
  {
    title: "SpareParts Management System",
    description: "Database-driven inventory and order management system with 3 user roles and granular RBAC across 8+ relational tables.",
    techStack: ["PostgreSQL", "RBAC", "SQL", "Node.js", "Express.js", "REST API"],
    githubLink: "https://github.com/Monishkumar-14/SpareParts_Management_System",
    liveLink: "",
    category: "DBMS",
    status: "Live",
    order: 3,
    caseStudy: {
      problem:   "Manual spare parts tracking leads to inventory errors and procurement delays.",
      approach:  "Normalised PostgreSQL schema with 8+ tables and 3-role access control.",
      challenge: "Complex multi-table JOINs were slow — solved with strategic indexing.",
      outcome:   "~35% faster queries. Enforcing data integrity across 3 roles and 8+ tables.",
    },
  },
  {
    title: "Git Graph Simulator",
    description: "Real-time Git graph visualiser in C++ using the Crow web framework, implementing a DAG to model commit trees, branches, and merges.",
    techStack: ["C++", "Crow Framework", "DAG", "Data Structures", "Algorithms"],
    githubLink: "https://github.com/Monishkumar-14/git-simulator",
    liveLink: "https://git-simulator.onrender.com",
    category: "Systems",
    status: "Live",
    order: 4,
    caseStudy: {
      problem:   "Developers struggle to visualise Git graph operations like branching and merging.",
      approach:  "C++ DAG implementation served via Crow HTTP framework as a real-time web app.",
      challenge: "Rendering DAG topology correctly for complex merge/branch scenarios.",
      outcome:   "Live tool used by 20+ peers to improve Git understanding interactively.",
    },
  },
];

const CERTIFICATES = [
  { title: "Google Cybersecurity Professional Certificate", issuer: "Google · Coursera", category: "Security",     year: "2024", verified: true, featured: true, order: 1 },
  { title: "Google Cloud Engineering Certificate",          issuer: "Google · Coursera", category: "Cloud",        year: "2024", verified: true, order: 2 },
  { title: "Python for Data Science",                       issuer: "NPTEL · IIT",       category: "ML / Data",    year: "2024", score: "85%", verified: true, order: 3 },
  { title: "C Programming",                                 issuer: "LearnTube",          category: "Programming",  year: "2023", order: 4 },
  { title: "C++ Programming",                               issuer: "LearnTube",          category: "Programming",  year: "2023", order: 5 },
  { title: "Data Structures & Algorithms",                  issuer: "LearnTube",          category: "DSA",          year: "2023", order: 6 },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("✅ Connected to MongoDB");

  // Admin
  const adminExists = await Admin.findOne({ username: "monish" });
  if (!adminExists) {
    await Admin.create({ username: "monish", password: "Monish@2024" });
    console.log("✅ Admin created  →  monish / Monish@2024");
  } else {
    console.log("ℹ️  Admin already exists");
  }

  // Projects
  await Project.deleteMany({});
  await Project.insertMany(PROJECTS);
  console.log(`✅ ${PROJECTS.length} projects seeded`);

  // Certificates
  await Certificate.deleteMany({});
  await Certificate.insertMany(CERTIFICATES);
  console.log(`✅ ${CERTIFICATES.length} certificates seeded`);

  await mongoose.disconnect();
  console.log("🎉 Seed complete!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});