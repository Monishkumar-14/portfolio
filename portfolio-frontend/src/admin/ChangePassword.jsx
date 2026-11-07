import { useState } from "react";
import { motion } from "framer-motion";
import { KeyRound, Lock, ShieldCheck, AlertCircle, Check, Circle } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { Field, PageHeader, PasswordInput, Spinner, fadeUp } from "./AdminUI";
import "./Admin.css";

const ChangePassword = () => {
  const { token } = useAuth();
  const [form, setForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [show, setShow] = useState({ current: false, new: false, confirm: false });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  // Validation (unchanged rules)
  const errors = {
    currentPassword: form.currentPassword.length < 1 ? "Required" : null,
    newPassword:
      form.newPassword.length < 8 ? "Must be at least 8 characters"
      : form.newPassword === form.currentPassword ? "New password must be different" : null,
    confirmPassword: form.confirmPassword !== form.newPassword ? "Passwords don't match" : null,
  };

  const hasStrength = {
    length: form.newPassword.length >= 8,
    uppercase: /[A-Z]/.test(form.newPassword),
    lowercase: /[a-z]/.test(form.newPassword),
    number: /\d/.test(form.newPassword),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(form.newPassword),
  };
  const strengthScore = Object.values(hasStrength).filter(Boolean).length;
  const strengthLabel = strengthScore <= 2 ? "Weak" : strengthScore <= 3 ? "Fair" : strengthScore <= 4 ? "Good" : "Strong";
  const strengthColor = strengthScore <= 2 ? "#ff5a4f" : strengthScore <= 3 ? "#e5c07b" : strengthScore <= 4 ? "#4d8dff" : "#22d67a";

  const isFormValid = !errors.currentPassword && !errors.newPassword && !errors.confirmPassword && form.confirmPassword.length > 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    if (!isFormValid) { toast.error("Please fix the errors before submitting."); return; }
    setLoading(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/admin/change-password`,
        { currentPassword: form.currentPassword, newPassword: form.newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Password changed successfully!");
      setSuccess(true);
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setTimeout(() => setSuccess(false), 4000);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to change password.");
    } finally {
      setLoading(false);
    }
  };

  const toggle = (k) => () => setShow((s) => ({ ...s, [k]: !s[k] }));
  const matches = form.confirmPassword === form.newPassword;

  return (
    <div className="adm-narrow adm-narrow--sm">
      <PageHeader eyebrow="Security" icon={KeyRound} title="Change Password" sub="Update your admin password. Make sure it's at least 8 characters." />

      {success && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="adm-banner" role="status">
          <ShieldCheck size={18} aria-hidden="true" />
          <div><p>Password Updated</p><small>Your admin password has been changed successfully.</small></div>
        </motion.div>
      )}

      <motion.div {...fadeUp(0.1)} className="adm-card adm-card--pad">
        <form onSubmit={handleSubmit} className="adm-stack" style={{ gap: 20 }} noValidate>
          <Field id="currentPassword" label="Current Password">
            <PasswordInput id="currentPassword" value={form.currentPassword} autoComplete="current-password"
              onChange={(e) => set("currentPassword", e.target.value)} show={show.current} onToggle={toggle("current")} />
          </Field>

          <div className="adm-divider" />

          <Field id="newPassword" label="New Password">
            <PasswordInput id="newPassword" value={form.newPassword} autoComplete="new-password"
              onChange={(e) => set("newPassword", e.target.value)} show={show.new} onToggle={toggle("new")} />
          </Field>

          {form.newPassword.length > 0 && (
            <div className="adm-stack" style={{ gap: 12 }} aria-live="polite">
              <div className="adm-meter">
                <div className="adm-meter__bar"><i style={{ width: `${(strengthScore / 5) * 100}%`, background: strengthColor }} /></div>
                <span style={{ font: "700 11px/1 var(--mono)", color: strengthColor }}>{strengthLabel}</span>
              </div>
              <div className="adm-reqs">
                {[
                  { key: "length", label: "8+ characters" },
                  { key: "uppercase", label: "Uppercase letter" },
                  { key: "lowercase", label: "Lowercase letter" },
                  { key: "number", label: "Number" },
                  { key: "special", label: "Special character" },
                ].map(({ key, label }) => (
                  <span key={key} className={`adm-req${hasStrength[key] ? " is-ok" : ""}`}>
                    {hasStrength[key] ? <Check size={12} aria-hidden="true"/> : <Circle size={11} aria-hidden="true"/>} {label}
                  </span>
                ))}
              </div>
            </div>
          )}

          <Field id="confirmPassword" label="Confirm New Password">
            <PasswordInput id="confirmPassword" value={form.confirmPassword} autoComplete="new-password"
              onChange={(e) => set("confirmPassword", e.target.value)} show={show.confirm} onToggle={toggle("confirm")} />
          </Field>

          {form.confirmPassword.length > 0 && (
            <div className="adm-match" style={{ color: matches ? "var(--green)" : "var(--red)" }} role="status">
              {matches ? <><ShieldCheck size={13} aria-hidden="true"/> Passwords match</> : <><AlertCircle size={13} aria-hidden="true"/> Passwords don't match</>}
            </div>
          )}

          <button type="submit" disabled={loading || !isFormValid} className="adm-btn adm-btn--primary adm-btn--block" style={{ marginTop: 4 }}>
            {loading ? <><Spinner size={15}/> UPDATING...</> : <><KeyRound size={15} aria-hidden="true"/> UPDATE PASSWORD</>}
          </button>
        </form>
      </motion.div>

      <p className="adm-login__fine"><Lock size={11} aria-hidden="true" style={{ display: "inline", marginRight: 6, verticalAlign: "-1px" }}/>Passwords are encrypted with bcrypt · Minimum 8 characters required</p>
    </div>
  );
};

export default ChangePassword;