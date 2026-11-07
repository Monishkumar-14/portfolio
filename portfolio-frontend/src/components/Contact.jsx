import { useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Send, Github, Linkedin, Mail, CheckCircle2, AlertCircle, Briefcase, Handshake, Wrench, BookOpen,
  MessageCircle, Code2, FileCode2,
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import "./Sections.css";
import "./Contact.css";

const LeetCodeIcon = ({ size = 15 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true">
    <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z" />
  </svg>
);

const fadeUp = (delay = 0, reduce = false) => ({
  initial: { opacity: 0, y: reduce ? 0 : 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, delay, ease: "easeOut" },
});

/* Your four links, exactly as given in the brief. */
const LINKS = {
  github: "https://github.com/Monishkumar-14",
  linkedin: "http://www.linkedin.com/in/monishkumar-ceg",
  email: "mailto:monish1421@gmail.com",
  leetcode: "https://leetcode.com/monish14_3",
};
const EMAIL = "monish1421@gmail.com";

const SOCIALS = [
  { icon: <Github size={15} aria-hidden="true" />, label: "GitHub", href: LINKS.github, external: true },
  { icon: <Linkedin size={15} aria-hidden="true" />, label: "LinkedIn", href: LINKS.linkedin, external: true },
  { icon: <Mail size={15} aria-hidden="true" />, label: "Email", href: LINKS.email },
  { icon: <LeetCodeIcon />, label: "LeetCode", href: LINKS.leetcode, external: true },
];

const SUBJECTS = [
  { icon: <Briefcase size={13} aria-hidden="true" />, label: "Job Opportunity" },
  { icon: <Handshake size={13} aria-hidden="true" />, label: "Collaboration" },
  { icon: <Wrench size={13} aria-hidden="true" />, label: "Freelance" },
  { icon: <BookOpen size={13} aria-hidden="true" />, label: "Open Source" },
  { icon: <MessageCircle size={13} aria-hidden="true" />, label: "Just Saying Hi" },
];

const MAX_LEN = 2000; // unchanged from the previous form
const validators = {
  name: (v) => (v.trim().length >= 2 ? null : "At least 2 characters"),
  email: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? null : "Enter a valid email"),
  message: (v) => (v.trim().length >= 10 ? null : "At least 10 characters"),
};

const API = import.meta.env.VITE_API_URL || "";
const INITIAL = { name: "", email: "", subject: "Job Opportunity", message: "" };

/* ── JSON-style info panel ── */
const Row = ({ n, indent = 0, children }) => (
  <div className="cx-row">
    <span className="cx-n" aria-hidden="true">{n}</span>
    <span className="cx-t" style={{ paddingLeft: `${indent * 1.6}ch` }}>{children}</span>
  </div>
);
const K = ({ children }) => <><span className="cx-k">"{children}"</span><span className="cx-p">: </span></>;
const S = ({ children, href, external }) => href ? (
  <a className="cx-s cx-a" href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>"{children}"</a>
) : <span className="cx-s">"{children}"</span>;
const P = ({ children }) => <span className="cx-p">{children}</span>;

const InfoPanel = () => (
  <section className="cx-win" aria-label="Contact information">
    <header className="cx-win__bar">
      <span className="cx-dots" aria-hidden="true"><i /><i /><i /></span>
      <span className="cx-win__file"><Code2 size={14} aria-hidden="true" /> contact_info.json</span>
    </header>
    <pre className="cx-code" aria-label="contact_info.json">
      <Row n={1}><P>{"{"}</P></Row>
      <Row n={2} indent={1}><K>status</K><S>open_to_work</S><P>,</P></Row>
      <Row n={3} indent={1}><K>email</K><S href={LINKS.email}>{EMAIL}</S><P>,</P></Row>
      <Row n={4} indent={1}><K>socials</K><P>{"{"}</P></Row>
      <Row n={5} indent={2}><K>github</K><S href={LINKS.github} external>Monishkumar-14</S><P>,</P></Row>
      <Row n={6} indent={2}><K>linkedin</K><S href={LINKS.linkedin} external>monishkumar-ceg</S></Row>
      <Row n={7} indent={1}><P>{"},"}</P></Row>
      <Row n={8} indent={1}><K>leetcode</K><S href={LINKS.leetcode} external>monish14_3</S><P>,</P></Row>
      <Row n={9} indent={1}><K>location</K><S>Chennai, India</S><P>,</P></Row>
      <Row n={10} indent={1}><K>response</K><S>Usually within 24hrs</S></Row>
      <Row n={11}><P>{"}"}</P></Row>
      <Row n={12}>{" "}</Row>
      <Row n={13}><span className="cx-c">{"// Waiting for connection..."}</span></Row>
      <Row n={14}><span className="cx-cursor" aria-hidden="true">_</span></Row>
    </pre>
  </section>
);

/* ── Form panel ── */
const FormPanel = ({ reduce }) => {
  const [form, setForm] = useState(INITIAL);
  const [touched, setTouched] = useState({});
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [trap, setTrap] = useState(""); // honeypot: real users never see or fill this
  const refs = { name: useRef(null), email: useRef(null), message: useRef(null) };
  const subjectRefs = useRef([]);

  const errors = { name: validators.name(form.name), email: validators.email(form.email), message: validators.message(form.message) };
  const isValid = !errors.name && !errors.email && !errors.message;

  const handleChange = (e) => { setSubmitError(null); setForm((p) => ({ ...p, [e.target.name]: e.target.value })); };
  const handleBlur = (e) => setTouched((p) => ({ ...p, [e.target.name]: true }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (sending) return; // no duplicate submissions
    setTouched({ name: true, email: true, message: true });
    if (!isValid) {
      const first = ["name", "email", "message"].find((k) => errors[k]);
      refs[first]?.current?.focus();
      return;
    }
    if (trap) return; // bot filled the hidden field: send nothing, show nothing
    setSending(true);
    setSubmitError(null);
    try {
      // Same endpoint and payload as before.
      await axios.post(`${API}/api/messages`, {
        name: form.name.trim(), email: form.email.trim(), subject: form.subject, message: form.message.trim(),
      });
      setSent(true); // only after the server confirmed (2xx)
      setForm(INITIAL);
      setTouched({});
      toast.success("Message sent successfully!");
    } catch (err) {
      const msg = err.response?.data?.message
        || (err.request ? "Couldn't reach the server. Check your connection and try again." : "Failed to send. Please try again.");
      setSubmitError(msg); // entered data is kept
      toast.error(msg);
    } finally {
      setSending(false);
    }
  };

  const onSubjectKey = (e, i) => {
    const d = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
    if (!d) return;
    e.preventDefault();
    const n = (i + d + SUBJECTS.length) % SUBJECTS.length;
    setForm((p) => ({ ...p, subject: SUBJECTS[n].label }));
    subjectRefs.current[n]?.focus();
  };

  const fieldErr = (k) => touched[k] && errors[k];

  return (
    <section className="cx-win cx-win--form" aria-label="Send me a message">
      <header className="cx-win__bar">
        <span className="cx-dots" aria-hidden="true"><i /><i /><i /></span>
        <span className="cx-win__file cx-win__file--tab"><b className="cx-ts" aria-hidden="true">TS</b> sendMessage.ts</span>
      </header>

      {sent ? (
        <div className="cx-sent" role="status">
          <CheckCircle2 size={44} aria-hidden="true" />
          <p className="cx-sent__t">Message Sent!</p>
          <p className="cx-sent__d">I'll get back to you within 24 hours.</p>
          <button type="button" className="cx-btn cx-btn--ghost" onClick={() => setSent(false)}>Send Another</button>
        </div>
      ) : (
        <form className="cx-form" onSubmit={handleSubmit} noValidate aria-busy={sending}>
          <div className="cx-mail">
            <div className="cx-mail__head"><Mail size={16} aria-hidden="true" /> mail.compose</div>
            <div className="cx-mail__to">
              <span>to: <a href={LINKS.email}>{EMAIL}</a></span>
              <span>response: <b>usually within 24hrs</b></span>
            </div>

            <div className="cx-mail__body">
              <div className="cx-two">
                <div className="cx-field">
                  <label htmlFor="contact-name">Name *</label>
                  <input ref={refs.name} id="contact-name" name="name" type="text" autoComplete="name" required
                    value={form.name} onChange={handleChange} onBlur={handleBlur} placeholder="Your Name"
                    aria-invalid={!!fieldErr("name")} aria-describedby={fieldErr("name") ? "err-name" : undefined} />
                  {fieldErr("name") && <p id="err-name" className="cx-err" role="alert"><AlertCircle size={12} aria-hidden="true" /> {errors.name}</p>}
                </div>
                <div className="cx-field">
                  <label htmlFor="contact-email">Email *</label>
                  <input ref={refs.email} id="contact-email" name="email" type="email" autoComplete="email" required
                    value={form.email} onChange={handleChange} onBlur={handleBlur} placeholder="your@email.com"
                    aria-invalid={!!fieldErr("email")} aria-describedby={fieldErr("email") ? "err-email" : undefined} />
                  {fieldErr("email") && <p id="err-email" className="cx-err" role="alert"><AlertCircle size={12} aria-hidden="true" /> {errors.email}</p>}
                </div>
              </div>

              <div className="cx-field">
                <span id="subject-label" className="cx-label">Subject</span>
                <div className="cx-subjects" role="radiogroup" aria-labelledby="subject-label">
                  {SUBJECTS.map(({ icon, label }, i) => {
                    const on = form.subject === label;
                    return (
                      <button key={label} type="button" role="radio" aria-checked={on} tabIndex={on ? 0 : -1}
                        ref={(el) => { subjectRefs.current[i] = el; }}
                        className={`cx-subj${on ? " is-on" : ""}`}
                        onClick={() => setForm((p) => ({ ...p, subject: label }))} onKeyDown={(e) => onSubjectKey(e, i)}>
                        {icon} {label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="cx-field">
                <label htmlFor="contact-message">Message *</label>
                <textarea ref={refs.message} id="contact-message" name="message" rows={6} required maxLength={MAX_LEN}
                  value={form.message} onChange={handleChange} onBlur={handleBlur}
                  placeholder="Tell me about your project, timeline, and goals..."
                  aria-invalid={!!fieldErr("message")} aria-describedby={fieldErr("message") ? "err-message" : undefined} />
                <div className="cx-msgfoot">
                  {fieldErr("message") ? <p id="err-message" className="cx-err" role="alert"><AlertCircle size={12} aria-hidden="true" /> {errors.message}</p> : <span />}
                  <span className="cx-count" aria-live="off">{form.message.length}/{MAX_LEN}</span>
                </div>
              </div>

              {/* honeypot */}
              <div className="cx-trap" aria-hidden="true">
                <label>Website<input type="text" name="website" tabIndex={-1} autoComplete="off" value={trap} onChange={(e) => setTrap(e.target.value)} /></label>
              </div>
            </div>
          </div>

          {submitError && <p className="cx-banner" role="alert"><AlertCircle size={16} aria-hidden="true" /> {submitError}</p>}

          <button type="submit" className="cx-btn cx-btn--send" disabled={sending}>
            {sending ? <><span className={`cx-spin${reduce ? " is-static" : ""}`} aria-hidden="true" /> SENDING...</> : <><Send size={16} aria-hidden="true" /> SEND MESSAGE</>}
          </button>
        </form>
      )}
    </section>
  );
};

const Contact = () => {
  const reduce = useReducedMotion();
  return (
    <section id="contact" className="sect contact" aria-labelledby="contact-title">
      <div className="sect__bg" aria-hidden="true" />
      <div className="sect__inner">
        <motion.h2 {...fadeUp(0, reduce)} id="contact-title" className="sect__title">
          <span className="sect__icon"><Mail size={34} aria-hidden="true" /></span>$ ./contact.exe
        </motion.h2>
        <motion.p {...fadeUp(0.05, reduce)} className="cx-sub">Interested in working together? Drop me a message.</motion.p>

        <div className="cx-grid">
          <motion.div {...fadeUp(0.1, reduce)} className="cx-left">
            <InfoPanel />
            <ul className="cx-socials" aria-label="Social links">
              {SOCIALS.map(({ icon, label, href, external }) => (
                <li key={label}>
                  <a className="cx-social" href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    aria-label={external ? `${label} (opens in a new tab)` : `${label}: ${EMAIL}`}>
                    {icon} {label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
          <motion.div {...fadeUp(0.15, reduce)} className="cx-right"><FormPanel reduce={reduce} /></motion.div>
        </div>

        <footer className="cx-foot">
          <p className="cx-foot__1"><FileCode2 size={18} aria-hidden="true" /> Monishkumar E M <span aria-hidden="true">|</span> Full-Stack Developer &amp; AI Engineer</p>
          <p className="cx-foot__2">Built with &lt;3 using React, Node.js &amp; Tailwind CSS</p>
          <p className="cx-foot__3">© 2026 Monishkumar E M. All rights reserved.</p>
        </footer>
      </div>
    </section>
  );
};

export default Contact;