/* Shared building blocks for the admin pages. Defined at module level on purpose: components declared
   inside another component remount on every keystroke and make inputs lose focus. */
import { useEffect, useId, useRef } from "react";
import { motion } from "framer-motion";
import { X, Eye, EyeOff, Lock, AlertCircle } from "lucide-react";

export const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, delay, ease: "easeOut" },
});

export const timeAgo = (date) => {
  const mins = Math.floor((Date.now() - new Date(date).getTime()) / 60000);
  if (!Number.isFinite(mins)) return "";
  const hrs = Math.floor(mins / 60), days = Math.floor(hrs / 24);
  if (days > 0) return `${days}d ago`;
  if (hrs > 0) return `${hrs}h ago`;
  if (mins > 0) return `${mins}m ago`;
  return "Just now";
};

export const Spinner = ({ size = 16 }) => (
  <span className="adm-spin" style={{ width: size, height: size }} role="status" aria-label="Loading" />
);

export const PageHeader = ({ eyebrow, icon: Icon, title, sub, action }) => (
  <motion.div {...fadeUp(0)} className="adm-head">
    <div className="adm-head__text">
      <p className="adm-eyebrow">{Icon ? <Icon size={14} aria-hidden="true" /> : null}{">"} {eyebrow}</p>
      <h1 className="adm-h1">{title}</h1>
      {sub ? <p className="adm-sub">{sub}</p> : null}
    </div>
    {action}
  </motion.div>
);

export const Field = ({ id, label, error, hint, children }) => (
  <div className="adm-field">
    <label className="adm-label" htmlFor={id}>{label}</label>
    {children}
    {error ? <p className="adm-err" role="alert"><AlertCircle size={12} aria-hidden="true" /> {error}</p> : null}
    {hint ? <p className="adm-hint">{hint}</p> : null}
  </div>
);

export const Pill = ({ tone, children }) => <span className={`adm-pill${tone ? ` adm-pill--${tone}` : ""}`}>{children}</span>;

export const Switch = ({ checked, onChange, label }) => (
  <button type="button" role="switch" aria-checked={checked} aria-label={label} className="adm-switch" onClick={() => onChange(!checked)} />
);

export const SettingRow = ({ icon: Icon, label, desc, checked, onChange }) => (
  <div className="adm-setting">
    <div className="adm-setting__l">
      <span className="adm-setting__ic"><Icon size={15} aria-hidden="true" /></span>
      <div><p className="adm-setting__t">{label}</p><p className="adm-setting__d">{desc}</p></div>
    </div>
    <Switch checked={checked} onChange={onChange} label={label} />
  </div>
);

export const PasswordInput = ({ id, value, onChange, show, onToggle, placeholder = "••••••••", autoComplete, invalid }) => (
  <div className="adm-inwrap">
    <Lock size={14} aria-hidden="true" />
    <input id={id} type={show ? "text" : "password"} value={value} onChange={onChange} placeholder={placeholder}
      autoComplete={autoComplete} aria-invalid={invalid || undefined} className="adm-input adm-input--icon adm-input--icon-r" />
    <button type="button" className="adm-eye" onClick={onToggle} aria-label={show ? "Hide password" : "Show password"}>
      {show ? <EyeOff size={14} /> : <Eye size={14} />}
    </button>
  </div>
);

/* Accessible modal: role=dialog, Escape closes, Tab stays inside, body scroll locked, focus restored.
   Render inside <AnimatePresence> so the exit animation plays. */
export const Modal = ({ title, subtitle, onClose, children, footer, width = 560 }) => {
  const panel = useRef(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;                       // latest handler without re-running the effect
  const titleId = useId();

  useEffect(() => {
    const previous = document.activeElement;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panel.current?.focus();
    const onKey = (e) => {
      if (e.key === "Escape") { e.stopPropagation(); closeRef.current(); return; }
      if (e.key !== "Tab" || !panel.current) return;
      const items = [...panel.current.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])')];
      if (!items.length) return;
      const first = items[0], last = items[items.length - 1];
      if (e.shiftKey && (document.activeElement === first || document.activeElement === panel.current)) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = overflow; previous?.focus?.(); };
  }, []);

  return (
    <motion.div className="adm-modal-ov" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <motion.div ref={panel} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby={titleId} className="adm-modal" style={{ "--w": `${width}px` }}
        initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 24 }} transition={{ duration: 0.22 }}>
        <div className="adm-modal__head">
          <div><h2 id={titleId} className="adm-modal__t">{title}</h2>{subtitle ? <p className="adm-modal__s">{subtitle}</p> : null}</div>
          <button type="button" className="adm-iconbtn" onClick={onClose} aria-label="Close dialog"><X size={15} /></button>
        </div>
        <div className="adm-modal__body">{children}</div>
        {footer ? <div className="adm-modal__foot">{footer}</div> : null}
      </motion.div>
    </motion.div>
  );
};