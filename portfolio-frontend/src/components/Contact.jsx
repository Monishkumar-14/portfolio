import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Github, Linkedin, Mail, CheckCircle2, AlertCircle } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

// ── Inline LeetCode SVG ───────────────────────────────────────────
const LeetCodeIcon = () => (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor">
    <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z"/>
  </svg>
);

// ── Data ──────────────────────────────────────────────────────────
const CONTACT_ITEMS = [
  {
    icon: "✉️",
    iconBg: "bg-violet-500/12 border-violet-500/28",
    label: "Email",
    value: "monish1421@gmail.com",
    href: "mailto:monish1421@gmail.com",
  },
  {
    icon: "📱",
    iconBg: "bg-cyan-500/10 border-cyan-500/25",
    label: "Phone",
    value: "+91 85310 41337",
    href: "tel:+918531041337",
  },
  {
    icon: "📍",
    iconBg: "bg-pink-500/10 border-pink-500/25",
    label: "Location",
    value: "Chennai, Tamil Nadu, India",
    href: "https://maps.google.com/?q=Chennai,Tamil+Nadu,India",
  },
  {
    icon: "⏰",
    iconBg: "bg-amber-500/10 border-amber-500/25",
    label: "Response Time",
    value: "Usually within 24 hours",
    href: null,
  },
];

const SOCIALS = [
  { icon: <Github size={15} />,   label: "GitHub",   href: "https://github.com/Monishkumar-14" },
  { icon: <Linkedin size={15} />, label: "LinkedIn", href: "https://linkedin.com/in/monish-kumar-b55774291" },
  { icon: <Mail size={15} />,     label: "Email",    href: "mailto:monish1421@gmail.com" },
  { icon: <LeetCodeIcon />,       label: "LeetCode", href: "https://leetcode.com/monish14_3" },
];

const SUBJECTS = [
  { icon: "💼", label: "Job Opportunity",   extraField: { name: "company", placeholder: "e.g. Google, Startup Inc.", label: "Company Name" } },
  { icon: "🤝", label: "Collaboration",     extraField: null },
  { icon: "🛠️", label: "Freelance Project", extraField: { name: "budget",  placeholder: "e.g. ₹50k–₹1L / $500–$2k",  label: "Budget Range" } },
  { icon: "📚", label: "Open Source",       extraField: null },
  { icon: "💬", label: "Just Saying Hi",    extraField: null },
];

// ── Validation helpers ────────────────────────────────────────────
const validators = {
  name:    (v) => v.trim().length >= 2  ? null : "Name must be at least 2 characters",
  email:   (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? null : "Enter a valid email address",
  message: (v) => v.trim().length >= 10 ? null : "Message must be at least 10 characters",
};

// ── Animations ────────────────────────────────────────────────────
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] },
});

// ── FloatingInput — TRUE floating label ───────────────────────────
// How it works:
//   • placeholder=" " (single space) keeps the :placeholder-shown selector
//     active when the field is empty, so peer-placeholder-shown CSS works.
//   • The <label> starts centred inside the input.
//   • On focus OR when value exists → label slides up + shrinks.
//   • No separate <label> outside the component is needed.
const FloatingInput = ({
  name, label, type = "text", value, onChange, onBlur,
  error, touched, required, as: Tag = "input", rows, maxLength,
}) => {
  const hasValue  = value.length > 0;
  const isValid   = touched && !error && hasValue;
  const isInvalid = touched && !!error;

  // For textarea the label starts at top; for input it starts centred.
  const labelBase    = Tag === "textarea" ? "top-3 -translate-y-0" : "top-1/2 -translate-y-1/2";
  // Floated position (focus or has value)
  const labelFloated = "!top-2 !translate-y-0 !text-[10px] !leading-none";

  return (
    <div className="relative">
      <Tag
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        type={type}
        // ⚠️ IMPORTANT: placeholder must be a single space so
        //    peer-placeholder-shown triggers correctly when empty.
        placeholder=" "
        required={required}
        rows={rows}
        maxLength={maxLength}
        className={[
          // Base glass input styles (defined in your global CSS)
          "glass-input w-full px-4 text-sm transition-all duration-200 peer",
          // Extra top padding so text doesn't overlap the floated label
          Tag === "textarea" ? "pt-6 pb-3 resize-none" : "pt-5 pb-2",
          isValid   ? "!border-green-500/50 !bg-green-500/5"  : "",
          isInvalid ? "!border-red-500/50   !bg-red-500/5"    : "",
          // Focus glow
          "focus:ring-2 focus:ring-violet-500/30 outline-none",
        ].join(" ")}
      />

      {/* ── Floating Label ── */}
      <label
        htmlFor={name}
        className={[
          // Base position
          `absolute left-4 pointer-events-none select-none`,
          `text-sm text-white/40 transition-all duration-200`,
          labelBase,
          // Float up when peer is focused OR has a value
          // (peer-focus always floats; peer-placeholder-shown is true when empty=no float)
          "peer-focus:" + labelFloated,
          // When NOT placeholder-shown (i.e. has a value) → float
          hasValue ? labelFloated : "",
          // Color changes
          "peer-focus:text-violet-400",
          hasValue && !isInvalid ? "text-violet-400/70" : "",
          isInvalid ? "!text-red-400/70" : "",
          isValid   ? "!text-green-400/70" : "",
        ].join(" ")}
      >
        {label}{required && <span className="ml-0.5 text-violet-400/60">*</span>}
      </label>

      {/* ── Validation Icon ── */}
      <AnimatePresence>
        {isValid && (
          <motion.span
            key="ok"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            className={`absolute right-3 ${Tag === "textarea" ? "top-3" : "top-1/2 -translate-y-1/2"} text-green-400`}
          >
            <CheckCircle2 size={14} />
          </motion.span>
        )}
        {isInvalid && (
          <motion.span
            key="err"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            className={`absolute right-3 ${Tag === "textarea" ? "top-3" : "top-1/2 -translate-y-1/2"} text-red-400`}
          >
            <AlertCircle size={14} />
          </motion.span>
        )}
      </AnimatePresence>

      {/* ── Error Message ── */}
      <AnimatePresence>
        {isInvalid && (
          <motion.p
            key="msg"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="text-[10px] text-red-400 mt-1 ml-1"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

// ── Component ─────────────────────────────────────────────────────
const Contact = () => {
  const [form, setForm] = useState({
    name: "", email: "", subject: "Job Opportunity", company: "", budget: "", message: "",
  });
  const [touched,   setTouched]   = useState({});
  const [activeSub, setActiveSub] = useState("Job Opportunity");
  const [loading,   setLoading]   = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const activeSubject = SUBJECTS.find((s) => s.label === activeSub);
  const extraField    = activeSubject?.extraField ?? null;

  const errors = {
    name:    validators.name(form.name),
    email:   validators.email(form.email),
    message: validators.message(form.message),
  };
  const isFormValid = !errors.name && !errors.email && !errors.message;

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleBlur = (e) => {
    setTouched((prev) => ({ ...prev, [e.target.name]: true }));
  };

  const pickSubject = (label) => {
    setActiveSub(label);
    setForm((prev) => ({ ...prev, subject: label, company: "", budget: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ name: true, email: true, message: true });

    if (!isFormValid) {
      toast.error("Please fix the errors before sending.");
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/messages`, form);
      setSubmitted(true);
      toast.success("Message sent! Monish will reply soon 🚀");
      setForm({ name: "", email: "", subject: "Job Opportunity", company: "", budget: "", message: "" });
      setTouched({});
      setActiveSub("Job Opportunity");
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const charPct = form.message.length / 500;
  const charColor =
    form.message.length > 450 ? "text-red-400" :
    form.message.length > 350 ? "text-amber-400" : "text-white/25";

  return (
    <div className="min-h-screen py-24 px-6">
      <div className="max-w-5xl mx-auto">

        {/* ── Header ── */}
        <motion.div {...fadeUp(0)} className="mb-14">
          <p className="text-[11px] font-semibold uppercase tracking-[3px] text-violet-400 mb-3">
            06 — Contact
          </p>
          <h2 className="text-5xl md:text-6xl font-extrabold tracking-tight leading-tight mb-4">
            Let's Build{" "}
            <span className="bg-gradient-to-r from-violet-400 via-cyan-400 to-pink-400 bg-clip-text text-transparent">
              Something Great
            </span>{" "}
            Together
          </h2>
          <p className="text-sm text-white/40 leading-relaxed max-w-lg">
            Available for internships, freelance projects &amp; collaborations.
            Drop a message — I reply within 24 hours.
          </p>

          <motion.div {...fadeUp(0.15)} className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-6">
            {[
              { dot: "bg-violet-400", text: "Open to full-time roles" },
              { dot: "bg-cyan-400",   text: "Remote & on-site" },
              { dot: "bg-pink-400",   text: "Trusted by peers & mentors" },
            ].map(({ dot, text }) => (
              <span key={text} className="flex items-center gap-2">
                <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
                <span className="text-[11px] text-white/35 font-medium">{text}</span>
              </span>
            ))}
          </motion.div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.45fr] gap-5">

          {/* ══ LEFT — Info ══ */}
          <div className="flex flex-col gap-4">

            <motion.div {...fadeUp(0.1)} className="glass-card p-7">
              {/* Availability badge */}
              <div className="flex items-center gap-3 p-4 rounded-[16px] bg-green-500/7 border border-green-500/20 mb-6">
                <motion.div
                  className="w-2.5 h-2.5 rounded-full bg-green-400 flex-shrink-0"
                  animate={{ boxShadow: ["0 0 6px #4ade80", "0 0 20px #4ade80", "0 0 6px #4ade80"] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                <div>
                  <p className="text-[12px] font-bold text-green-400">Available for Opportunities</p>
                  <p className="text-[10px] text-green-400/55 mt-0.5">
                    Actively seeking roles · Chennai / Remote
                  </p>
                </div>
              </div>

              <h3 className="text-lg font-extrabold mb-2">Get in Touch</h3>
              <p className="text-sm text-white/42 leading-relaxed mb-6">
                Whether it's a job opportunity, project collaboration, or just a hello — I'm always happy to connect!
              </p>

              <div className="flex flex-col gap-3">
                {CONTACT_ITEMS.map(({ icon, iconBg, label, value, href }, i) => (
                  <motion.a
                    key={label}
                    href={href || undefined}
                    target={href ? "_blank" : undefined}
                    rel="noreferrer"
                    initial={{ opacity: 0, x: -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.15 + i * 0.07, duration: 0.5, ease: "easeOut" }}
                    whileHover={{ x: 5 }}
                    className={`flex items-center gap-4 p-4 rounded-[14px] bg-white/4 border border-white/8 transition-all ${
                      href
                        ? "hover:bg-violet-500/10 hover:border-violet-500/25 cursor-pointer group"
                        : "cursor-default"
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-[12px] flex items-center justify-center text-lg flex-shrink-0 border ${iconBg}`}>
                      {icon}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] text-white/30 uppercase tracking-[1px] mb-0.5">{label}</p>
                      <p className="text-[13px] font-semibold text-white/80 truncate">{value}</p>
                    </div>
                    {href && (
                      <span className="ml-auto text-white/20 group-hover:text-violet-400 transition-colors text-xs">↗</span>
                    )}
                  </motion.a>
                ))}
              </div>
            </motion.div>

            <motion.div {...fadeUp(0.18)} className="glass-card p-5">
              <p className="text-[10px] font-semibold uppercase tracking-[2px] text-white/28 mb-4">
                Find Me Online
              </p>
              <div className="flex flex-wrap gap-2.5">
                {SOCIALS.map(({ icon, label, href }, i) => (
                  <motion.a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + i * 0.06 }}
                    whileHover={{ scale: 1.08, y: -3 }}
                    whileTap={{ scale: 0.94 }}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-[12px] bg-white/6 border border-white/10 text-white/60 text-xs font-semibold hover:bg-violet-500/15 hover:border-violet-500/30 hover:text-violet-300 transition-all"
                  >
                    <span className="text-sm">{icon}</span>
                    {label}
                  </motion.a>
                ))}
              </div>
            </motion.div>

          </div>

          {/* ══ RIGHT — Form ══ */}
          <motion.div {...fadeUp(0.2)} className="glass-card p-9">
            <p className="text-[10px] font-semibold uppercase tracking-[2px] text-white/28 mb-6">
              Send a Message
            </p>

            <form onSubmit={handleSubmit} noValidate>

              {/* Name + Email row — NO external labels, label lives inside FloatingInput */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <FloatingInput
                  name="name"
                  label="Your Name"
                  value={form.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.name}
                  touched={touched.name}
                  required
                />
                <FloatingInput
                  name="email"
                  type="email"
                  label="Email Address"
                  value={form.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.email}
                  touched={touched.email}
                  required
                />
              </div>

              {/* Subject chips */}
              <div className="mb-4">
                <label className="block text-[11px] font-semibold uppercase tracking-[1px] text-white/35 mb-3">
                  I'm reaching out about
                </label>
                <div className="flex flex-wrap gap-2">
                  {SUBJECTS.map(({ icon, label }) => (
                    <motion.button
                      key={label}
                      type="button"
                      whileTap={{ scale: 0.95 }}
                      onClick={() => pickSubject(label)}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold border transition-all ${
                        activeSub === label
                          ? "bg-violet-500/20 border-violet-500/40 text-violet-300 shadow-[0_0_12px_rgba(139,92,246,0.2)]"
                          : "bg-white/5 border-white/9 text-white/45 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      <span>{icon}</span> {label}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Smart extra field (animated in/out) — also uses floating label */}
              <AnimatePresence>
                {extraField && (
                  <motion.div
                    key={extraField.name}
                    initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                    animate={{ opacity: 1, height: "auto", marginBottom: 16 }}
                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    {/*
                      Extra field (company / budget) — we use a plain floating-label
                      input here manually since it's not validated and has a violet tint.
                    */}
                    <div className="relative">
                      <input
                        name={extraField.name}
                        value={form[extraField.name] || ""}
                        onChange={handleChange}
                        type="text"
                        placeholder=" "
                        className="glass-input w-full px-4 pt-5 pb-2 text-sm !border-violet-500/25 !bg-violet-500/5 focus:ring-2 focus:ring-violet-500/30 outline-none peer transition-all duration-200"
                      />
                      <label className={[
                        "absolute left-4 pointer-events-none select-none text-sm transition-all duration-200",
                        "text-violet-400/60",
                        "top-1/2 -translate-y-1/2",
                        // Float when focused
                        "peer-focus:!top-2 peer-focus:!translate-y-0 peer-focus:!text-[10px] peer-focus:!leading-none peer-focus:text-violet-400",
                        // Float when has value
                        (form[extraField.name] || "").length > 0
                          ? "!top-2 !translate-y-0 !text-[10px] !leading-none"
                          : "",
                      ].join(" ")}>
                        {extraField.label}
                        <span className="ml-1 normal-case text-[10px] text-white/25">(optional)</span>
                      </label>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Subject text input — floating label */}
              <div className="mb-4">
                <div className="relative">
                  <input
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    type="text"
                    placeholder=" "
                    className="glass-input w-full px-4 pt-5 pb-2 text-sm focus:ring-2 focus:ring-violet-500/30 outline-none peer transition-all duration-200"
                  />
                  <label className={[
                    "absolute left-4 pointer-events-none select-none text-sm transition-all duration-200 text-white/40",
                    "top-1/2 -translate-y-1/2",
                    "peer-focus:!top-2 peer-focus:!translate-y-0 peer-focus:!text-[10px] peer-focus:!leading-none peer-focus:text-violet-400",
                    form.subject.length > 0 ? "!top-2 !translate-y-0 !text-[10px] !leading-none text-violet-400/70" : "",
                  ].join(" ")}>
                    Subject
                  </label>
                </div>
              </div>

              {/* Message — floating label textarea */}
              <div className="mb-5">
                <div className="flex justify-between items-center mb-2">
                  {/* No label here — it floats inside the textarea */}
                  <span /> {/* spacer */}
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1 rounded-full bg-white/10 overflow-hidden">
                      <motion.div
                        className={`h-full rounded-full ${
                          form.message.length > 450 ? "bg-red-400" :
                          form.message.length > 350 ? "bg-amber-400" : "bg-violet-400"
                        }`}
                        animate={{ width: `${Math.min(charPct * 100, 100)}%` }}
                        transition={{ duration: 0.2 }}
                      />
                    </div>
                    <span className={`text-[10px] font-mono ${charColor}`}>
                      {form.message.length} / 500
                    </span>
                  </div>
                </div>
                <FloatingInput
                  as="textarea"
                  name="message"
                  label="Your Message"
                  value={form.message}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.message}
                  touched={touched.message}
                  rows={5}
                  maxLength={500}
                  required
                />
              </div>

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={!loading ? { scale: 1.02, y: -2 } : {}}
                whileTap={!loading ? { scale: 0.98 } : {}}
                className="w-full py-4 rounded-[14px] text-sm font-bold btn-primary-glass flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/8 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-700 pointer-events-none" />

                <AnimatePresence mode="wait">
                  {loading ? (
                    <motion.span
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2"
                    >
                      <motion.div
                        className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                      />
                      Sending...
                    </motion.span>
                  ) : submitted ? (
                    <motion.span
                      key="sent"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex items-center gap-2 text-green-300"
                    >
                      <CheckCircle2 size={15} /> Message Sent Successfully!
                    </motion.span>
                  ) : (
                    <motion.span
                      key="send"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center gap-2"
                    >
                      <Send size={15} /> Send Message
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>

              {/* Trust footer */}
              <div className="flex items-center justify-center gap-2 mt-4 flex-wrap">
                {["🔒 Your data is secure", "No spam, ever", "Reply within 24h"].map((t, i) => (
                  <span key={t} className="flex items-center gap-2">
                    {i > 0 && <span className="w-1 h-1 rounded-full bg-white/15" />}
                    <span className="text-[10px] text-white/22">{t}</span>
                  </span>
                ))}
              </div>

            </form>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default Contact;