import { motion } from "framer-motion";
import {
  Github, Linkedin, Mail, Download, Phone, MapPin, Terminal, ChevronRight,
  Briefcase, GraduationCap, Award,
} from "lucide-react";
import "./Sections.css";
import "./About.css";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, delay, ease: "easeOut" },
});

// Profile rows (values come from the previous About.jsx / your brief).
const PROFILE_ROWS = [
  { label: "Operator", value: "Monishkumar E M", tone: "orange" },
  { label: "Role", value: "Full-Stack Developer · AI Engineer", tone: "blue" },
  { label: "Location", value: "Chennai, India" },
  { label: "Education", value: "B.Tech IT · CEG, Anna University" },
  { label: "CGPA", value: "8.2 / 10" },
  { label: "Status", value: "Open to Work", tone: "status" }, // remove this row if not accurate
];

const LINKS = [
  { icon: <Github size={13} />, label: "GitHub", href: "https://github.com/Monishkumar-14" },
  { icon: <Linkedin size={13} />, label: "LinkedIn", href: "https://linkedin.com/in/monish-kumar-b55774291" },
  { icon: <Mail size={13} />, label: "Email", href: "mailto:monish1421@gmail.com" },
];

// Only figures already present in your previous About.jsx.
const METRICS = [
  { icon: <Briefcase size={16} style={{ color: "#ff6b35" }} />, label: "Internship", value: "1", unit: "AstraZeneca · ETS" },
  { icon: <GraduationCap size={16} style={{ color: "#4d8dff" }} />, label: "CGPA", value: "8.2", unit: "/ 10" },
  { icon: <Award size={16} style={{ color: "#ff6b35" }} />, label: "Certifications", value: "6", unit: "total" },
];

const Command = ({ fn, arg, blue }) => (
  <p className="about-cmd">
    <ChevronRight size={16} className="about-cmd__arrow" aria-hidden="true" />
    <span><span className={`about-cmd__fn${blue ? " about-cmd__fn--blue" : ""}`}>{fn}</span> {arg}</span>
  </p>
);

const About = () => (
  <section id="about" className="sect about" aria-labelledby="about-title">
    <div className="sect__bg" aria-hidden="true" />
    <div className="sect__inner">
      <motion.h2 {...fadeUp(0)} id="about-title" className="sect__title">
        <span className="sect__icon"><Terminal size={34} aria-hidden="true" /></span># About.system
      </motion.h2>

      <div className="about__grid">
        {/* LEFT — profile card */}
        <motion.div {...fadeUp(0.1)} className="about-card">
          <div className="about-card__photo">
            <span className="about-card__ring" aria-hidden="true" />
            <img className="about-card__img" src="/monish-profile.jpg" alt="Monishkumar E M" width={190} height={190} loading="eager" />
            <span className="about-card__dot" aria-hidden="true" />
          </div>

          <dl className="about-rows">
            {PROFILE_ROWS.map(({ label, value, tone }) => (
              <div key={label} className="about-row">
                <dt>{label}</dt>
                <dd className={tone ? `is-${tone}` : undefined}>{value}</dd>
              </div>
            ))}
          </dl>

          <div className="about-links">
            {LINKS.map(({ icon, label, href }) => (
              <a key={label} href={href} target="_blank" rel="noreferrer" className="about-link">{icon} {label}</a>
            ))}
            <a href="/Monishkumar_Resume.pdf" download className="about-link about-link--cta">
              <Download size={13} aria-hidden="true" /> Download CV
            </a>
          </div>
          <div className="about-card__phone">
            <span><Phone size={11} aria-hidden="true" /> +91 85310 41337</span>
            <span><MapPin size={11} aria-hidden="true" /> Chennai</span>
          </div>
        </motion.div>

        {/* RIGHT — terminal + metrics */}
        <div className="about__col">
          <motion.div {...fadeUp(0.15)} className="about-term">
            <div className="about-term__bar">
              <Terminal size={14} aria-hidden="true" /> user_profile.log
            </div>
            <div className="about-term__body">
              <Command fn="whoami" arg="" />
              <p className="about-out">
                I'm <b>Monishkumar E M</b>, a final-year Information Technology student at{" "}
                <b>College of Engineering, Guindy, Anna University</b>, focused on building scalable
                applications, backend systems and AI-powered solutions.
              </p>

              <Command fn="cat" arg="experience.log" blue />
              <p className="about-out">
                Junior Data Analyst Intern at <span className="hl">AstraZeneca India Pvt. Ltd.</span> (ETS team),
                working on enterprise AI and data intelligence projects, including a <b>RAG-based document assistant</b>{" "}
                and <b>ServiceNow</b> data workflows with <b>natural-language-to-SQL</b>.
              </p>

              <Command fn="cat" arg="mission.txt" blue />
              <p className="about-out">
                My work focuses on building practical software solutions, developing enterprise AI applications,
                designing reliable backend systems, and integrating machine learning into real-world workflows.
              </p>
            </div>
          </motion.div>

          <motion.div {...fadeUp(0.2)} className="about-metrics">
            {METRICS.map(({ icon, label, value, unit }) => (
              <div key={label} className="about-metric">
                <div className="about-metric__label">{icon}{label}</div>
                <div className="about-metric__value">{value}<span className="about-metric__unit">{unit}</span></div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  </section>
);

export default About;