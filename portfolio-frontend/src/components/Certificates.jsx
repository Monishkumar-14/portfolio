import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  ExternalLink, Shield, Cloud, Code2, Cpu, Wrench, BarChart3, Network,
  BadgeCheck, Calendar, Clock, Award, Terminal, FileText,
} from "lucide-react";
import "./Sections.css";
import "./Certificates.css";

const fadeUp = (delay = 0, reduce = false) => ({
  initial: { opacity: 0, y: reduce ? 0 : 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, delay, ease: "easeOut" },
});

const GoogleIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);
const NptelIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <rect width="24" height="24" rx="6" fill="#1a56db"/>
    <text x="12" y="16" textAnchor="middle" fontSize="9" fontWeight="bold" fill="white" fontFamily="monospace">IIT</text>
  </svg>
);
const IbmIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <rect width="24" height="24" rx="6" fill="#0530ad"/>
    <text x="12" y="16" textAnchor="middle" fontSize="8" fontWeight="bold" fill="white" fontFamily="monospace">IBM</text>
  </svg>
);

/* ─────────────────────────────────────────────────────────────
   Certificate data.
   kind "credly"   → verification link (Credly public badge) → "Verified" badge + "View Certificate"
   kind "document" → a certificate file you host (Google Drive) → no "Verified" badge, "View Document"
   Checked 3 Nov 2026 against the three Credly pages:
   - Google Cybersecurity (v.2): issued by Coursera ✔
   - IBM DevOps & Software Engineering: issued by Coursera ✔
   - Google Cloud Engineering: issued by Google Cloud (Career Launchpad), NOT Coursera → corrected below
   Removed: the patterned credential IDs from the previous file (GOOG-CYBER-2024-MN14, GOOG-CLOUD-2026,
   IBM-DEVOPS-2026, NPTEL-PDS-2025) — they don't match any real Credly ID and one contradicted its own
   year. The real Credly badge ID (from each link) is shown instead. Restore via `credentialId` if they are real.
   ───────────────────────────────────────────────────────────── */
const CERTS = [
  {
    id: "google-cyber", Icon: Shield, cat: "security", kind: "credly",
    title: "Google Cybersecurity Professional Certificate",
    issuer: "Google · Coursera", IssuerIcon: GoogleIcon,
    year: "2026", duration: "6 months",
    link: "https://www.credly.com/badges/6e919e6f-6a0b-4592-9395-5d3f100c6750/public_url",
    topics: ["Network Security", "Threat Analysis", "SIEM Tools", "IDS/IPS", "Python Automation"],
  },
  {
    id: "google-cloud", Icon: Cloud, cat: "cloud", kind: "credly",
    title: "Google Cloud Engineering Certificate",
    issuer: "Google Cloud · Career Launchpad", IssuerIcon: GoogleIcon,
    year: "2026", duration: "3 months",
    link: "https://www.credly.com/badges/27ee8a96-1ff6-4f4d-ae01-c549bf779bc6/public_url",
    topics: ["GCP Core Services", "Compute Engine", "Cloud Storage", "IAM"],
  },
  {
    id: "ibm-devops", Icon: Wrench, cat: "devops", kind: "credly",
    title: "IBM DevOps and Software Engineering Professional Certificate",
    issuer: "IBM · Coursera", IssuerIcon: IbmIcon,
    year: "2026",
    link: "https://www.credly.com/badges/f8734e8f-6c94-4522-8a56-22e162bee16a/public_url",
    topics: ["CI/CD Pipelines", "Docker", "Kubernetes", "Microservices", "Agile"],
  },
  {
    id: "nptel-python", Icon: BarChart3, cat: "ml", kind: "document",
    title: "Python for Data Science",
    issuer: "NPTEL · IIT", IssuerIcon: NptelIcon,
    year: "Jan – Feb 2025", duration: "4 weeks", score: "85%",
    link: "https://drive.google.com/file/d/1wVxKTwnPxdrnNtCPcHhTrmmD_yFcVbpU/view",
    topics: ["NumPy", "pandas", "Data Wrangling", "EDA"],
  },
  {
    id: "learntube-c", Icon: Code2, cat: "prog", kind: "document",
    title: "C Programming",
    issuer: "LearnTube", IssuerIcon: null,
    year: "19 Sep 2024", duration: "14 hrs · 92 lessons",
    link: "https://drive.google.com/file/d/1pOmnnIQ8ACuKf54ty-HLzTM8okzE3qR4/view",
    topics: ["Pointers", "Memory Management", "File I/O"],
  },
  {
    id: "learntube-cpp", Icon: Cpu, cat: "prog", kind: "document",
    title: "C++ Programming",
    issuer: "LearnTube", IssuerIcon: null,
    year: "9 Oct 2024", duration: "14 hrs · 44 lessons",
    link: "https://drive.google.com/file/d/1daO30aJMh5N9UymBAPAEpps_ZrOP1GBj/view",
    topics: ["OOP", "Templates", "STL"],
  },
  {
    id: "learntube-dsa", Icon: Network, cat: "dsa", kind: "document",
    title: "Data Structures & Algorithms",
    issuer: "LearnTube", IssuerIcon: null,
    year: "30 Oct 2024", duration: "14 hrs · 87 lessons",
    link: "https://drive.google.com/file/d/11Xbe_RsxWUyrEDMovmKWcqNd2yAv_54z/view",
    topics: ["Arrays & Trees", "Graphs", "Dynamic Programming"],
  },
];

const FILTERS = [
  { key: "all", label: "All" },
  { key: "cloud", label: "Cloud" },
  { key: "security", label: "Security" },
  { key: "devops", label: "DevOps" },
  { key: "ml", label: "ML / Data" },
  { key: "prog", label: "Programming" },
  { key: "dsa", label: "DSA" },
];

const badgeId = (link) => link?.match(/credly\.com\/badges\/([0-9a-f-]{36})/i)?.[1] ?? null;

const CertCard = ({ cert, reduce }) => {
  const { Icon, title, issuer, IssuerIcon, year, duration, score, link, kind, topics, credentialId } = cert;
  const isCredly = kind === "credly";
  const bid = isCredly ? badgeId(link) : null;
  const idText = credentialId ? `ID: ${credentialId}` : bid ? `Credly ID: ${bid.slice(0, 8)}` : null;
  return (
    <motion.li
      className="ct-li"
      initial={{ opacity: 0, y: reduce ? 0 : 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <article className="ct-card" aria-label={title}>
        <header className="ct-card__head">
          <span className="ct-icon"><Icon size={20} aria-hidden="true" /></span>
          <div className="ct-card__who">
            <h3 className="ct-card__title">{title}</h3>
            <p className="ct-card__issuer">{IssuerIcon && <IssuerIcon size={15} />}<span>{issuer}</span></p>
          </div>
        </header>

        <ul className="ct-meta" aria-label="Details">
          <li className="ct-badge"><Calendar size={12} aria-hidden="true" />{year}</li>
          {duration && <li className="ct-badge"><Clock size={12} aria-hidden="true" />{duration}</li>}
          {score && <li className="ct-badge ct-badge--ok">Score {score}</li>}
          {isCredly && <li className="ct-badge ct-badge--ok"><BadgeCheck size={12} aria-hidden="true" />Verified on Credly</li>}
        </ul>

        {topics?.length > 0 && (
          <ul className="ct-chips" aria-label="Skills covered">
            {topics.map((t) => <li key={t} className="ct-chip">{t}</li>)}
          </ul>
        )}

        <footer className="ct-card__foot">
          {idText ? <span className="ct-id" title={bid ? `Credly badge ${bid}` : undefined}>{idText}</span> : <span />}
          {link && (
            <a className="ct-btn" href={link} target="_blank" rel="noopener noreferrer"
               aria-label={`${isCredly ? "View certificate" : "View document"}: ${title} (opens in a new tab)`}>
              {isCredly ? <ExternalLink size={13} aria-hidden="true" /> : <FileText size={13} aria-hidden="true" />}
              {isCredly ? "View Certificate" : "View Document"}
            </a>
          )}
        </footer>
      </article>
    </motion.li>
  );
};

const Certificates = () => {
  const reduce = useReducedMotion();
  const [filter, setFilter] = useState("all");
  const filtered = filter === "all" ? CERTS : CERTS.filter((c) => c.cat === filter);

  return (
    <section id="certificates" className="sect cert" aria-labelledby="cert-title">
      <div className="sect__bg" aria-hidden="true" />
      <div className="sect__inner">
        <motion.h2 {...fadeUp(0, reduce)} id="cert-title" className="sect__title">
          <span className="sect__icon"><Terminal size={34} aria-hidden="true" /></span>$ ls -la ~/certificates
        </motion.h2>
        <motion.p {...fadeUp(0.05, reduce)} className="ct-sub">
          Professional certifications and technical learning achievements.
        </motion.p>

        <motion.div {...fadeUp(0.1, reduce)} className="ct-filters" role="group" aria-label="Filter certificates by category">
          {FILTERS.map(({ key, label }) => (
            <button key={key} type="button" className={`ct-filter${filter === key ? " is-active" : ""}`}
              aria-pressed={filter === key} onClick={() => setFilter(key)}>
              {label}
            </button>
          ))}
          <span className="ct-count" role="status" aria-live="polite">
            {filtered.length} {filtered.length === 1 ? "cert" : "certs"}
          </span>
        </motion.div>

        {filtered.length > 0 ? (
          <ul className="ct-grid">
            {filtered.map((cert) => <CertCard key={cert.id} cert={cert} reduce={reduce} />)}
          </ul>
        ) : (
          <div className="ct-empty">
            <Award size={32} aria-hidden="true" />
            <p>No certificates in this category.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Certificates;