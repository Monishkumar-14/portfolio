import { useState } from "react";
import { motion } from "framer-motion";
import { KeyRound, Eye, EyeOff, Lock, ShieldCheck, AlertCircle } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: "easeOut" },
});

const ChangePassword = () => {
  const { token } = useAuth();
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [show, setShow] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  // Validation
  const errors = {
    currentPassword: form.currentPassword.length < 1 ? "Required" : null,
    newPassword:
      form.newPassword.length < 8
        ? "Must be at least 8 characters"
        : form.newPassword === form.currentPassword
        ? "New password must be different"
        : null,
    confirmPassword:
      form.confirmPassword !== form.newPassword
        ? "Passwords don't match"
        : null,
  };

  const hasStrength = {
    length: form.newPassword.length >= 8,
    uppercase: /[A-Z]/.test(form.newPassword),
    lowercase: /[a-z]/.test(form.newPassword),
    number: /\d/.test(form.newPassword),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(form.newPassword),
  };

  const strengthScore = Object.values(hasStrength).filter(Boolean).length;
  const strengthLabel =
    strengthScore <= 2 ? "Weak" :
    strengthScore <= 3 ? "Fair" :
    strengthScore <= 4 ? "Good" : "Strong";
  const strengthColor =
    strengthScore <= 2 ? "bg-red-500" :
    strengthScore <= 3 ? "bg-amber-500" :
    strengthScore <= 4 ? "bg-cyan-400" : "bg-green-400";

  const isFormValid =
    !errors.currentPassword && !errors.newPassword && !errors.confirmPassword &&
    form.confirmPassword.length > 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) {
      toast.error("Please fix the errors before submitting.");
      return;
    }
    setLoading(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/admin/change-password`,
        {
          currentPassword: form.currentPassword,
          newPassword: form.newPassword,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Password changed successfully! 🔒");
      setSuccess(true);
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setTimeout(() => setSuccess(false), 4000);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to change password.");
    } finally {
      setLoading(false);
    }
  };

  const PasswordField = ({ label, name, value, showPw, toggleShow }) => (
    <div>
      <label className="block text-[10px] font-semibold uppercase
        tracking-[1.5px] text-white/30 mb-2">
        {label}
      </label>
      <div className="relative">
        <Lock size={14} className="absolute left-4 top-1/2 -translate-y-1/2
          text-white/25" />
        <input
          type={showPw ? "text" : "password"}
          value={value}
          onChange={(e) => set(name, e.target.value)}
          placeholder="••••••••"
          className="glass-input w-full pl-10 pr-12 py-3 text-sm"
        />
        <button
          type="button"
          onClick={toggleShow}
          className="absolute right-4 top-1/2 -translate-y-1/2
            text-white/25 hover:text-white/60 transition-colors"
        >
          {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-xl mx-auto">
      {/* Header */}
      <motion.div {...fadeUp(0)} className="mb-8">
        <div className="flex items-center gap-2.5 mb-1">
          <KeyRound size={16} className="text-violet-400" />
          <p className="text-[10px] font-semibold uppercase tracking-[2px]
            text-white/28">
            Security
          </p>
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight">
          Change Password
        </h1>
        <p className="text-xs text-white/35 mt-1">
          Update your admin password. Make sure it's at least 8 characters.
        </p>
      </motion.div>

      {/* Success Banner */}
      {success && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 p-4 rounded-[14px]
            bg-green-500/10 border border-green-500/25 mb-6"
        >
          <ShieldCheck size={18} className="text-green-400 flex-shrink-0" />
          <div>
            <p className="text-sm font-bold text-green-400">Password Updated</p>
            <p className="text-[11px] text-green-400/60 mt-0.5">
              Your admin password has been changed successfully.
            </p>
          </div>
        </motion.div>
      )}

      {/* Form */}
      <motion.div {...fadeUp(0.1)} className="glass-card p-8">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">

          <PasswordField
            label="Current Password"
            name="currentPassword"
            value={form.currentPassword}
            showPw={show.current}
            toggleShow={() => setShow((s) => ({ ...s, current: !s.current }))}
          />

          <div className="border-t border-white/6 my-1" />

          <PasswordField
            label="New Password"
            name="newPassword"
            value={form.newPassword}
            showPw={show.new}
            toggleShow={() => setShow((s) => ({ ...s, new: !s.new }))}
          />

          {/* Password Strength Meter */}
          {form.newPassword.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="space-y-3"
            >
              {/* Strength bar */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-1.5 rounded-full bg-white/8 overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${strengthColor}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${(strengthScore / 5) * 100}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <span className={`text-[10px] font-bold ${
                  strengthScore <= 2 ? "text-red-400" :
                  strengthScore <= 3 ? "text-amber-400" :
                  strengthScore <= 4 ? "text-cyan-400" : "text-green-400"
                }`}>
                  {strengthLabel}
                </span>
              </div>

              {/* Requirements */}
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { key: "length",    label: "8+ characters"    },
                  { key: "uppercase", label: "Uppercase letter"  },
                  { key: "lowercase", label: "Lowercase letter"  },
                  { key: "number",    label: "Number"            },
                  { key: "special",   label: "Special character" },
                ].map(({ key, label }) => (
                  <span
                    key={key}
                    className={`flex items-center gap-1.5 text-[10px] font-medium
                      ${hasStrength[key] ? "text-green-400/70" : "text-white/20"}`}
                  >
                    {hasStrength[key] ? "✓" : "○"} {label}
                  </span>
                ))}
              </div>
            </motion.div>
          )}

          <PasswordField
            label="Confirm New Password"
            name="confirmPassword"
            value={form.confirmPassword}
            showPw={show.confirm}
            toggleShow={() => setShow((s) => ({ ...s, confirm: !s.confirm }))}
          />

          {/* Match indicator */}
          {form.confirmPassword.length > 0 && (
            <div className={`flex items-center gap-2 text-xs font-medium
              ${form.confirmPassword === form.newPassword
                ? "text-green-400"
                : "text-red-400"
              }`}>
              {form.confirmPassword === form.newPassword ? (
                <>
                  <ShieldCheck size={13} /> Passwords match
                </>
              ) : (
                <>
                  <AlertCircle size={13} /> Passwords don't match
                </>
              )}
            </div>
          )}

          {/* Submit */}
          <motion.button
            type="submit"
            disabled={loading || !isFormValid}
            whileHover={!loading && isFormValid ? { scale: 1.02, y: -1 } : {}}
            whileTap={!loading && isFormValid ? { scale: 0.98 } : {}}
            className="w-full py-3.5 rounded-[14px] text-sm font-bold
              btn-primary-glass flex items-center justify-center gap-2
              disabled:opacity-40 disabled:cursor-not-allowed mt-2"
          >
            {loading ? (
              <>
                <motion.div
                  className="w-4 h-4 border-2 border-white/30
                    border-t-white rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                />
                Updating...
              </>
            ) : (
              <>
                <KeyRound size={15} /> Update Password
              </>
            )}
          </motion.button>
        </form>
      </motion.div>

      {/* Tip */}
      <motion.div {...fadeUp(0.2)} className="mt-5 text-center">
        <p className="text-[10px] text-white/20">
          🔒 Passwords are encrypted with bcrypt · Minimum 8 characters required
        </p>
      </motion.div>
    </div>
  );
};

export default ChangePassword;
