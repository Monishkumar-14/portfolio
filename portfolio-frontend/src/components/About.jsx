import { motion } from "framer-motion";
import { Github, Linkedin, Mail, Download, ExternalLink, MapPin, Briefcase, Star, Code2, Database, Brain, Layers } from "lucide-react";

// ── Animation helpers ─────────────────────────────────────────────
const fadeUp   = (delay = 0) => ({
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.7, delay, ease: "easeOut" },
});
const fadeLeft = (delay = 0) => ({
  initial: { opacity: 0, x: -40 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true },
  transition: { duration: 0.7, delay, ease: "easeOut" },
});

// ── Resume Data ───────────────────────────────────────────────────

const miniStats = [
  { num: "10+",   label: "Deployed Projects",      color: "text-violet-400" },
  { num: "6",    label: "Certifications",          color: "text-cyan-400"   },
  { num: "8.20", label: "CGPA / 10",               color: "text-pink-400"   },
  { num: "15+",  label: "GitHub Repositories",     color: "text-amber-400"  },
  { num: "1",    label: "Internship",              color: "text-green-400"  },
];

const chips = [
  { label: "BTech IT · CEG Anna University", icon: <Star size={11}/>, cls: "bg-violet-500/15 border-violet-500/30 text-violet-300"  },
  { label: "Chennai, India",                 icon: <MapPin size={11}/>, cls: "bg-cyan-500/12  border-cyan-500/28   text-cyan-300"    },
  { label: "Open to Work",                   icon: <Briefcase size={11}/>, cls: "bg-pink-500/12  border-pink-500/28   text-pink-300"    },
  { label: "Intern · AstraZeneca",           cls: "bg-green-500/12 border-green-500/28  text-green-400"  },
  { label: "CGPA 8.20 / 10",                icon: <Star size={11}/>, cls: "bg-amber-500/12 border-amber-500/28  text-amber-300"   },
  { label: "NSS Coordinator",               icon: <span className="text-[10px]">🌱</span>, cls: "bg-green-500/12 border-green-500/28  text-green-400"   },
];

const timeline = [
  {
    color: "bg-green-400 shadow-[0_0_10px_rgba(74,222,128,0.8)]",
    date: "May 2026 — Present",
    title: "SWE Intern · AstraZeneca 🧬",         // ← ADD
    sub: "Building RAG chatbot for document intelligence · ETS Dept · Chennai",
  },
  {
    color: "bg-violet-500 shadow-[0_0_8px_rgba(124,58,237,0.7)]",
    date: "2026 — Present",
    title: "Portfolio SaaS · Final Year Project",
    sub: "AI-powered portfolio with admin panel, chatbot & resume analyzer",
  },
  {
    color: "bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.7)]",
    date: "2026",
    title: "Google Certified — Cloud & Cybersecurity",
    sub: "Google Cloud Engineering + Cybersecurity Professional certificates",
  },
  {
    color: "bg-pink-400 shadow-[0_0_8px_rgba(236,72,153,0.7)]",
    date: "Jun 2025",
    title: "NSS Coordinator",
    sub: "Led village outreach at Puliyambakkam — 150+ participants over 3 days",
  },
  {
    color: "bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.7)]",
    date: "Aug 2025",
    title: "SpareChange — PERN + ML App",
    sub: "Full-stack micro-savings platform with ML engine, sub-200ms APIs",
  },
  {
    color: "bg-violet-500 shadow-[0_0_8px_rgba(124,58,237,0.7)]",
    date: "Aug 2023",
    title: "Started B.Tech at CEG, Anna University",
    sub: "BTech IT · HSC 96.17% from Gingee, Villupuram",
  },
];

// Grouped tech stack matching the image (Languages / Frameworks / Developer Tools)
// Devicon base URL
const DI = "https://cdn.jsdelivr.net/gh/devicons/devicon/icons";

const techGroups = [
  {
    label: "Languages",
    icon: <Code2 size={13} />,
    color: "text-violet-400",
    borderColor: "border-violet-500/25",
    glowColor: "hover:shadow-[0_0_12px_rgba(139,92,246,0.3)]",
    items: [
      { name: "C / C++",       src: `${DI}/c/c-original.svg`                                                           },
      { name: "Java",          src: `${DI}/java/java-original.svg`                                                     },
      { name: "SQL (Postgres)",src: `${DI}/postgresql/postgresql-original.svg`                                         },
      { name: "JavaScript",    src: `${DI}/javascript/javascript-original.svg`                                         },
      { name: "HTML",          src: `${DI}/html5/html5-original.svg`                                                   },
      { name: "CSS",           src: `${DI}/css3/css3-original.svg`                                                     },
      { name: "Python",        src: `${DI}/python/python-original.svg`                                                 },
    ],
  },
  {
    label: "Frameworks",
    icon: <Layers size={13} />,
    color: "text-cyan-400",
    borderColor: "border-cyan-500/25",
    glowColor: "hover:shadow-[0_0_12px_rgba(34,211,238,0.25)]",
    items: [
      { name: "React",       src: `${DI}/react/react-original.svg`                                                     },
      { name: "Node.js",     src: `${DI}/nodejs/nodejs-original.svg`                                                   },
      { name: "Express.js",  src: `${DI}/express/express-original-wordmark.svg`, invert: true                          },
      { name: "Tailwind CSS",src: `${DI}/tailwindcss/tailwindcss-original.svg`                                         },
    ],
  },
  {
    label: "Databases",
    icon: <Database size={13} />,
    color: "text-pink-400",
    borderColor: "border-pink-500/25",
    glowColor: "hover:shadow-[0_0_12px_rgba(244,114,182,0.25)]",
    items: [
      { name: "PostgreSQL", src: `${DI}/postgresql/postgresql-original.svg` },
      { name: "MongoDB",    src: `${DI}/mongodb/mongodb-original.svg`       },
    ],
  },
  {
    label: "AI / ML",
    icon: <Brain size={13} />,
    color: "text-amber-400",
    borderColor: "border-amber-500/25",
    glowColor: "hover:shadow-[0_0_12px_rgba(251,191,36,0.25)]",
    items: [
      { name: "scikit-learn", src: `${DI}/scikitlearn/scikitlearn-original.svg` },
      { name: "pandas",       src: `${DI}/pandas/pandas-original.svg`           },
      { name: "NumPy",        src: `${DI}/numpy/numpy-original.svg`             },
      { name: "TF-IDF / NLP", src: null /* no devicon — uses fallback emoji */ },
    ],
  },
  {
    label: "Developer Tools",
    icon: <Code2 size={13} />,
    color: "text-green-400",
    borderColor: "border-green-500/25",
    glowColor: "hover:shadow-[0_0_12px_rgba(74,222,128,0.25)]",
    items: [
      { name: "VS Code", src: `${DI}/vscode/vscode-original.svg`                                     },
      { name: "Eclipse", src: `${DI}/eclipse/eclipse-original.svg`                                   },
      { name: "Git",     src: `${DI}/git/git-original.svg`                                           },
      { name: "GitHub",  src: `${DI}/github/github-original.svg`, invert: true                       },
      { name: "GCP",     src: `${DI}/googlecloud/googlecloud-original.svg`                           },
      { name: "Linux",   src: `${DI}/linux/linux-original.svg`                                       },
    ],
  },
];

const activity = [
  {
    icon: "⚔️",
    iconBg: "bg-amber-500/15 border-amber-500/25",
    title: "LeetCode — monish14_3",
    sub: "Consistent DSA: arrays, trees, graphs, dynamic programming",
    badge: "Active",
    badgeCls: "bg-amber-500/15 border-amber-500/25 text-amber-300",
  },
  {
    icon: "⌥",
    iconBg: "bg-white/8 border-white/12",
    title: "GitHub — Monishkumar-14",
    sub: "15+ public repos across full-stack, ML & systems projects",
    badge: "15+ Repos",
    badgeCls: "bg-green-500/12 border-green-500/25 text-green-400",
  },
  {
    icon: "🌱",
    iconBg: "bg-pink-500/12 border-pink-500/25",
    title: "NSS Coordinator",
    sub: "Rural outreach — Puliyambakkam, Kanchipuram, 150+ participants",
    badge: "Leadership",
    badgeCls: "bg-pink-500/12 border-pink-500/25 text-pink-300",
  },
];

// ── Component ─────────────────────────────────────────────────────
const About = () => {
  return (
    <div className="min-h-screen flex items-start py-24 px-6">
      <div className="max-w-6xl mx-auto w-full">
        <p className="text-[11px] font-semibold uppercase tracking-[3px]
            text-violet-400 mb-3">
            01 — About me
          </p>
        {/* ── Section Header ── */}
        <motion.div {...fadeUp(0)} className="mb-14">
          <h2 className="text-5xl md:text-6xl font-extrabold tracking-tight leading-tight">
            Who is{" "}
            <span className="bg-gradient-to-r from-violet-400 via-cyan-400 to-pink-400
              bg-clip-text text-transparent">
              Monishkumar?
            </span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-5">

          {/* ══ LEFT COLUMN ══ */}
          <div className="flex flex-col gap-5">

            {/* Avatar Card */}
            <motion.div
              {...fadeLeft(0.1)}
              className="glass-card p-9 flex flex-col items-center text-center
                hover:scale-[1.01] hover:shadow-lg transition-transform duration-300"
            >
              {/* Profile photo with spinning ring */}
              <div className="relative w-40 h-40 mb-5">
                <div
                  className="absolute inset-0 rounded-full p-[3px] animate-spin [animation-duration:3s]"
                  style={{
                    background: "conic-gradient(#7c3aed, #06b6d4, #ec4899, #7c3aed)",
                  }}
                >
                  <div className="w-full h-full rounded-full bg-[#0a0a1a] avatar-inner-bg" />
                </div>
                <img
                  src="/monish-profile.jpg"
                  alt="Monishkumar E M"
                  className="absolute inset-[5px] rounded-full object-cover z-10"
                  style={{
                    width: "calc(100% - 10px)",
                    height: "calc(100% - 10px)",
                    objectPosition: "center 15%",
                    transform: "scale(1.25)",
                  }}
                />
              </div>

              <h3 className="text-xl font-bold mb-1">Monishkumar E M</h3>
              {/* Role headline — new */}
              <p className="text-xs text-violet-300 font-semibold mb-1">
                Full Stack Developer · AI Enthusiast
              </p>
              <p className="text-[11px] text-white/40 mb-1">CEG, Anna University · Chennai</p>
              <p className="text-xs text-white/55 font-medium mb-6">CGPA: 8.20 / 10</p>

              {/* Socials */}
              <div className="flex flex-wrap gap-2 justify-center mb-4">
                {[
                  { icon: <Github size={12}/>,   label: "GitHub",   href: "https://github.com/Monishkumar-14"           },
                  { icon: <Linkedin size={12}/>, label: "LinkedIn", href: "https://linkedin.com/in/monish-kumar-b55774291" },
                  { icon: <Mail size={12}/>,     label: "Email",    href: "mailto:monish1421@gmail.com"                 },
                ].map(({ icon, label, href }) => (
                  <motion.a
                    key={label} href={href} target="_blank" rel="noreferrer"
                    whileHover={{ scale: 1.06, y: -2 }}
                    whileTap={{ scale: 0.94 }}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs
                      font-medium bg-white/7 border border-white/12 text-white/65
                      hover:bg-violet-500/20 hover:border-violet-500/40
                      hover:text-violet-300 transition-all"
                  >
                    {icon} {label}
                  </motion.a>
                ))}
              </div>

              {/* Contact info */}
              <div className="flex flex-wrap gap-2 justify-center">
                {[
                  { icon: <span>📱</span>, text: "+91 85310 41337" },
                  { icon: <MapPin size={10}/>, text: "Chennai" },
                  { icon: <span>⚔️</span>, text: "LeetCode: monish14_3" },
                ].map(({ icon, text }) => (
                  <span key={text}
                    className="flex items-center gap-1 px-3 py-1 rounded-full text-[10px] bg-white/5
                      border border-white/10 text-white/40">
                    {icon} {text}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Mini Stats */}
            <motion.div {...fadeLeft(0.2)} className="grid grid-cols-2 gap-3">
              {miniStats.map(({ num, label, color }) => (
                <motion.div
                  key={label}
                  whileHover={{ scale: 1.04, y: -3 }}
                  className="glass-card p-5 text-center rounded-2xl"
                >
                  <div className={`text-3xl font-extrabold ${color}`}>{num}</div>
                  <div className="text-[10px] text-white/40 mt-1 leading-tight">
                    {label}
                  </div>
                </motion.div>
              ))}
            </motion.div>

          </div>

          {/* ══ RIGHT COLUMN ══ */}
          <div className="flex flex-col gap-5">

            {/* Bio Card */}
            <motion.div
              {...fadeUp(0.15)}
              className="glass-card p-9 hover:scale-[1.005] hover:shadow-lg transition-transform duration-300"
            >
              <p className="text-[10px] font-semibold uppercase tracking-[2px] text-white/35 mb-5">
                About Me
              </p>
              <div className="flex flex-wrap gap-2 mb-7">
                {chips.map(({ label, icon, cls }) => (
                  <span key={label}
                    className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-medium border ${cls}`}>
                    {icon} {label}
                  </span>
                ))}
              </div>
              <p className="text-sm text-white/75 leading-relaxed mb-4">
                I'm{" "}
                <span className="text-violet-300 font-semibold">Monishkumar E M</span>,
                a final-year IT student at{" "}
                <span className="text-violet-300 font-semibold">CEG, Anna University</span>,
                focused on building scalable full-stack applications and AI-driven solutions.
              </p>
              <p className="text-sm text-white/75 leading-relaxed mb-4">
                I've developed end-to-end systems using the{" "}
                <span className="text-cyan-300 font-semibold">PERN stack</span>,
                including REST APIs,{" "}
                <span className="text-cyan-300 font-semibold">JWT authentication</span>, and
                role-based access control — with performance optimized to{" "}
                <span className="text-cyan-300 font-semibold">sub-200ms response times</span>.
              </p>
              <p className="text-sm text-white/75 leading-relaxed">
                I'm particularly interested in{" "}
                <span className="text-pink-300 font-semibold">
                  backend systems, system design
                </span>, and integrating machine learning into real-world applications.
                Outside academics I solve DSA on{" "}
                <span className="text-pink-300 font-semibold">LeetCode (monish14_3)</span>{" "}
                and maintain 20+ GitHub repos.
              </p>
              <div className="flex gap-3 flex-wrap mt-8">
                <motion.a
                  href="/Monishkumar_Resume.pdf"
                  download
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.96 }}
                  className="btn-primary-glass flex items-center gap-2 px-7 py-3 text-sm"
                >
                  <Download size={14}/> Download CV
                </motion.a>
                <motion.a
                  href="https://github.com/Monishkumar-14" target="_blank"
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.96 }}
                  className="btn-sec-glass flex items-center gap-2 px-7 py-3 text-sm"
                >
                  <ExternalLink size={14}/> View GitHub
                </motion.a>
              </div>
            </motion.div>

            {/* Education */}
            <motion.div {...fadeUp(0.2)} className="glass-card p-7">
              <p className="text-[10px] font-semibold uppercase tracking-[2px] text-white/35 mb-5">
                Education
              </p>
              <div className="flex flex-col divide-y divide-white/6">
                {[
                  {
                    icon: "🎓",
                    iconBg: "bg-violet-500/15 border-violet-500/25",
                    deg: "BTech in Information Technology",
                    inst: "College of Engineering Guindy (CEG), Anna University",
                    badges: [
                      { label: "Aug 2023 – Present", cls: "bg-violet-500/15 border-violet-500/25 text-violet-300" },
                      { label: "CGPA: 8.20 / 10",    cls: "bg-green-500/12  border-green-500/25  text-green-400"  },
                    ],
                  },
                  {
                    icon: "📚",
                    iconBg: "bg-amber-500/12 border-amber-500/25",
                    deg: "Higher Secondary Certificate (HSC)",
                    inst: "Saradha Higher Matric School, Gingee, Villupuram District",
                    badges: [
                      { label: "2023",    cls: "bg-amber-500/12 border-amber-500/25 text-amber-300" },
                      { label: "96.17%",  cls: "bg-green-500/12  border-green-500/25  text-green-400" },
                    ],
                  },
                ].map(({ icon, iconBg, deg, inst, badges }) => (
                  <div key={deg} className="flex items-start gap-4 py-5 first:pt-0 last:pb-0">
                    <div className={`w-11 h-11 rounded-[14px] flex items-center justify-center
                      text-xl flex-shrink-0 border ${iconBg}`}>
                      {icon}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white mb-1">{deg}</p>
                      <p className="text-xs text-white/45 mb-3">{inst}</p>
                      <div className="flex gap-2 flex-wrap">
                        {badges.map(({ label, cls }) => (
                          <span key={label}
                            className={`px-3 py-1 rounded-full text-[10px] font-semibold border ${cls}`}>
                            {label}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Timeline */}
            <motion.div {...fadeUp(0.25)} className="glass-card p-7">
              <p className="text-[10px] font-semibold uppercase tracking-[2px] text-white/35 mb-6">
                Journey
              </p>
              <div className="relative pl-5">
                <div className="absolute left-0 top-1 bottom-0 w-px
                  bg-gradient-to-b from-violet-500/70 to-transparent" />
                {timeline.map(({ color, date, title, sub }, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className="relative pl-6 pb-6 last:pb-0"
                  >
                    <div className={`absolute left-[-5px] top-1.5 w-2.5 h-2.5 rounded-full ${color}`} />
                    <p className="text-[10px] text-white/28 uppercase tracking-[1.5px] mb-1">{date}</p>
                    <p className="text-sm font-bold text-white mb-1">{title}</p>
                    <p className="text-xs text-white/50 leading-relaxed">{sub}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

{/* Tech Stack — Grouped */}
<motion.div {...fadeUp(0.3)} className="glass-card p-6">
  <p className="text-[10px] font-semibold uppercase tracking-[2px] text-white/35 mb-6">
    Tech Stack
  </p>
  <div className="flex flex-col gap-5">
    {techGroups.map(({ label, icon, color, borderColor, glowColor, items }, gi) => (
      <div key={label}>
        <div className={`flex items-center gap-1.5 ${color} mb-2`}>
          {icon}
          <span className="text-[11px] font-semibold uppercase tracking-[1.5px]">{label}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {items.map(({ name, src, invert }, i) => (
            <motion.span
              key={name}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: gi * 0.05 + i * 0.04 }}
              whileHover={{ scale: 1.08, y: -2 }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px]
                font-medium bg-white/6 border ${borderColor} text-white/70
                hover:bg-white/10 hover:text-white transition-all cursor-default ${glowColor}`}
            >
              {src ? (
                <img
                  src={src}
                  alt={name}
                  width={15}
                  height={15}
                  className={`object-contain flex-shrink-0 ${invert ? "invert brightness-75" : ""}`}
                />
              ) : (
                <span className="text-[13px]">🤖</span>
              )}
              {name}
            </motion.span>
          ))}
        </div>
      </div>
    ))}
  </div>
</motion.div>

            {/* Activity & Achievements */}
            <motion.div {...fadeUp(0.35)} className="glass-card p-6">
              <p className="text-[10px] font-semibold uppercase tracking-[2px] text-white/35 mb-4">
                Activity & Achievements
              </p>
              <div className="flex flex-col divide-y divide-white/6">
                {activity.map(({ icon, iconBg, title, sub, badge, badgeCls }) => (
                  <div key={title} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
                    <div className={`w-10 h-10 rounded-[12px] flex items-center
                      justify-center text-lg flex-shrink-0 border ${iconBg}`}>
                      {icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white/90 mb-0.5">{title}</p>
                      <p className="text-xs text-white/45 leading-relaxed">{sub}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-semibold
                      border flex-shrink-0 ${badgeCls}`}>
                      {badge}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default About;