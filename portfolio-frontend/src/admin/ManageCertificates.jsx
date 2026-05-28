import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, X, CheckCircle } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

const EMPTY = {
  title: "", issuer: "", category: "Cloud",
  year: "", score: "", link: "", verified: false, featured: false,
};

const CATEGORIES = ["Cloud", "Security", "ML / Data", "DSA", "Programming", "Other"];

const CAT_COLORS = {
  "Cloud":       "bg-cyan-500/12 border-cyan-500/28 text-cyan-300",
  "Security":    "bg-pink-500/12 border-pink-500/28 text-pink-300",
  "ML / Data":   "bg-violet-500/15 border-violet-500/30 text-violet-300",
  "DSA":         "bg-amber-500/12 border-amber-500/28 text-amber-300",
  "Programming": "bg-green-500/10 border-green-500/25 text-green-400",
  "Other":       "bg-white/6 border-white/10 text-white/45",
};

// ── Modal ─────────────────────────────────────────────────────────
const CertModal = ({ cert, token, onClose, onSaved }) => {
  const [form,    setForm]    = useState(cert || EMPTY);
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const handleSave = async () => {
    if (!form.title.trim() || !form.issuer.trim() || !form.year.trim()) {
      toast.error("Title, issuer and year are required.");
      return;
    }
    setLoading(true);
    try {
      const instance = axios.create({
        baseURL: import.meta.env.VITE_API_URL,
        headers: { Authorization: `Bearer ${token}` },
      });
      if (cert?._id) {
        await instance.put(`/api/certificates/${cert._id}`, form);
        toast.success("Certificate updated!");
      } else {
        await instance.post("/api/certificates", form);
        toast.success("Certificate added!");
      }
      onSaved();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Save failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1,    y: 0  }}
        exit={{ scale: 0.95,    y: 20 }}
        className="w-full max-w-lg glass-card p-8 relative overflow-y-auto"
        style={{ maxHeight: "90vh" }}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-lg font-extrabold">
              {cert?._id ? "Edit Certificate" : "Add Certificate"}
            </h2>
            <p className="text-xs text-white/35 mt-1">Fill in the details</p>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/8 border border-white/12
              flex items-center justify-center text-white/50
              hover:text-white hover:bg-white/15 transition-all">
            <X size={14}/>
          </button>
        </div>

        {/* Fields */}
        <div className="flex flex-col gap-4">

          {/* Title */}
          <div>
            <label className="block text-[10px] font-semibold uppercase
              tracking-[1.5px] text-white/30 mb-1.5">
              Certificate Title *
            </label>
            <input
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="e.g. Google Cybersecurity Professional"
              className="glass-input w-full px-4 py-2.5 text-sm"
            />
          </div>

          {/* Issuer + Year */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-semibold uppercase
                tracking-[1.5px] text-white/30 mb-1.5">
                Issuer *
              </label>
              <input
                value={form.issuer}
                onChange={(e) => set("issuer", e.target.value)}
                placeholder="Google · Coursera"
                className="glass-input w-full px-4 py-2.5 text-sm"
              />
            </div>
            <div>
              <label className="block text-[10px] font-semibold uppercase
                tracking-[1.5px] text-white/30 mb-1.5">
                Year *
              </label>
              <input
                value={form.year}
                onChange={(e) => set("year", e.target.value)}
                placeholder="2024"
                className="glass-input w-full px-4 py-2.5 text-sm"
              />
            </div>
          </div>

          {/* Category + Score */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-semibold uppercase
                tracking-[1.5px] text-white/30 mb-1.5">
                Category
              </label>
              <select
                value={form.category}
                onChange={(e) => set("category", e.target.value)}
                className="glass-input w-full px-4 py-2.5 text-sm"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-semibold uppercase
                tracking-[1.5px] text-white/30 mb-1.5">
                Score (Optional)
              </label>
              <input
                value={form.score}
                onChange={(e) => set("score", e.target.value)}
                placeholder="e.g. 85%"
                className="glass-input w-full px-4 py-2.5 text-sm"
              />
            </div>
          </div>

          {/* Verification link */}
          <div>
            <label className="block text-[10px] font-semibold uppercase
              tracking-[1.5px] text-white/30 mb-1.5">
              Verification Link
            </label>
            <input
              value={form.link}
              onChange={(e) => set("link", e.target.value)}
              placeholder="https://coursera.org/verify/..."
              className="glass-input w-full px-4 py-2.5 text-sm"
            />
          </div>

          {/* Toggles */}
          <div className="flex gap-4">
            {[
              { key: "verified", label: "Verified" },
              { key: "featured", label: "Featured" },
            ].map(({ key, label }) => (
              <label key={key}
                className="flex items-center gap-2.5 cursor-pointer">
                <div
                  onClick={() => set(key, !form[key])}
                  className={`w-10 h-5 rounded-full transition-all relative
                    ${form[key]
                      ? "bg-violet-500"
                      : "bg-white/15"
                    }`}
                >
                  <div className={`absolute top-0.5 w-4 h-4 rounded-full
                    bg-white transition-all shadow-sm
                    ${form[key] ? "left-5" : "left-0.5"}`}
                  />
                </div>
                <span className="text-xs font-medium text-white/55">{label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 mt-7">
          <button onClick={onClose}
            className="px-5 py-2.5 rounded-[10px] text-sm font-semibold
              bg-white/6 border border-white/10 text-white/60
              hover:bg-white/10 transition-all">
            Cancel
          </button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleSave}
            disabled={loading}
            className="px-6 py-2.5 rounded-[10px] text-sm font-bold
              btn-primary-glass disabled:opacity-50
              flex items-center gap-2"
          >
            {loading ? (
              <>
                <motion.div
                  className="w-3.5 h-3.5 border-2 border-white/30
                    border-t-white rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                />
                Saving...
              </>
            ) : (
              cert?._id ? "Update" : "Add Certificate"
            )}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ── Main ──────────────────────────────────────────────────────────
const ManageCertificates = () => {
  const { token }  = useAuth();
  const [certs,    setCerts]   = useState([]);
  const [loading,  setLoading] = useState(true);
  const [modal,    setModal]   = useState(null);

  const fetchCerts = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/certificates`
      );
      setCerts(data.certificates || data);
    } catch {
      toast.error("Failed to fetch certificates.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCerts(); }, []);

  const deleteCert = async (id) => {
    if (!window.confirm("Delete this certificate?")) return;
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/certificates/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Certificate deleted.");
      fetchCerts();
    } catch {
      toast.error("Delete failed.");
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">
            Manage Certificates
          </h1>
          <p className="text-xs text-white/35 mt-1">
            {certs.length} certificate{certs.length !== 1 ? "s" : ""}
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => setModal("add")}
          className="flex items-center gap-2 px-5 py-2.5 rounded-[12px]
            text-sm font-bold btn-primary-glass"
        >
          <Plus size={15}/> Add Certificate
        </motion.button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center py-20 text-white/30 text-sm">
          Loading certificates...
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block glass-card overflow-hidden">
          {/* Head */}
          <div className="grid px-5 py-3 border-b border-white/7
            text-[10px] font-semibold uppercase tracking-[1.5px] text-white/28"
            style={{ gridTemplateColumns: "1fr 140px 110px 70px 80px 90px" }}>
            <span>Certificate</span>
            <span>Issuer</span>
            <span>Category</span>
            <span>Year</span>
            <span>Status</span>
            <span>Actions</span>
          </div>

          {certs.length === 0 ? (
            <div className="text-center py-14 text-white/30 text-sm">
              No certificates yet. Click "+ Add Certificate".
            </div>
          ) : (
            <AnimatePresence>
              {certs.map((c, i) => (
                <motion.div
                  key={c._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0,   y: -10 }}
                  transition={{ delay: i * 0.05 }}
                  className="grid px-5 py-4 border-b border-white/5
                    hover:bg-white/3 transition-colors items-center"
                  style={{ gridTemplateColumns: "1fr 140px 110px 70px 80px 90px" }}
                >
                  {/* Title */}
                  <div>
                    <p className="text-sm font-bold text-white leading-snug">
                      {c.title}
                    </p>
                    {c.score && (
                      <span className="inline-flex items-center gap-1 mt-1
                        px-2 py-0.5 rounded-full text-[9px] font-semibold
                        bg-green-500/12 border border-green-500/25 text-green-400">
                        ★ {c.score}
                      </span>
                    )}
                  </div>

                  {/* Issuer */}
                  <p className="text-xs text-white/45 truncate">{c.issuer}</p>

                  {/* Category */}
                  <span className={`inline-flex px-2.5 py-1 rounded-full
                    text-[10px] font-semibold border w-fit
                    ${CAT_COLORS[c.category] || CAT_COLORS["Other"]}`}>
                    {c.category}
                  </span>

                  {/* Year */}
                  <p className="text-xs text-white/40 font-mono">{c.year}</p>

                  {/* Verified */}
                  <div>
                    {c.verified ? (
                      <span className="inline-flex items-center gap-1
                        px-2.5 py-1 rounded-full text-[10px] font-semibold
                        bg-green-500/12 border border-green-500/25 text-green-400">
                        <CheckCircle size={9}/> Verified
                      </span>
                    ) : (
                      <span className="inline-flex px-2.5 py-1 rounded-full
                        text-[10px] font-semibold bg-white/5 border
                        border-white/10 text-white/30">
                        Unverified
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    {c.link && (
                      <a href={c.link} target="_blank" rel="noreferrer"
                        aria-label={`View ${c.title} certificate link`}
                        className="w-7 h-7 rounded-[8px] bg-cyan-500/10
                          border border-cyan-500/22 flex items-center
                          justify-center text-cyan-400
                          hover:bg-cyan-500/20 transition-all text-xs">
                        ↗
                      </a>
                    )}
                    <button
                      onClick={() => setModal(c)}
                      aria-label={`Edit ${c.title}`}
                      className="w-7 h-7 rounded-[8px] bg-violet-500/12
                        border border-violet-500/25 flex items-center
                        justify-center text-violet-400
                        hover:bg-violet-500/25 transition-all">
                      <Pencil size={11}/>
                    </button>
                    <button
                      onClick={() => deleteCert(c._id)}
                      aria-label={`Delete ${c.title}`}
                      className="w-7 h-7 rounded-[8px] bg-red-500/10
                        border border-red-500/22 flex items-center
                        justify-center text-red-400
                        hover:bg-red-500/20 transition-all">
                      <Trash2 size={11}/>
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        {/* Mobile card layout */}
        <div className="md:hidden flex flex-col gap-3">
          {certs.length === 0 ? (
            <div className="text-center py-14 text-white/30 text-sm">
              No certificates yet. Click "+ Add Certificate".
            </div>
          ) : (
            certs.map((c) => (
              <div key={c._id} className="glass-card p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-white">{c.title}</p>
                    <p className="text-[11px] text-white/40 mt-0.5">{c.issuer} · {c.year}</p>
                  </div>
                  {c.verified ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5
                      rounded-full text-[9px] font-semibold flex-shrink-0 ml-2
                      bg-green-500/12 border border-green-500/25 text-green-400">
                      <CheckCircle size={9}/> Verified
                    </span>
                  ) : (
                    <span className="inline-flex px-2 py-0.5 rounded-full
                      text-[9px] font-semibold flex-shrink-0 ml-2
                      bg-white/5 border border-white/10 text-white/30">
                      Unverified
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <span className={`inline-flex px-2.5 py-1 rounded-full
                    text-[10px] font-semibold border
                    ${CAT_COLORS[c.category] || CAT_COLORS["Other"]}`}>
                    {c.category}
                  </span>
                  {c.score && (
                    <span className="inline-flex items-center gap-1
                      px-2 py-0.5 rounded-full text-[9px] font-semibold
                      bg-green-500/12 border border-green-500/25 text-green-400">
                      ★ {c.score}
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  {c.link && (
                    <a href={c.link} target="_blank" rel="noreferrer"
                      aria-label={`View ${c.title} certificate link`}
                      className="w-7 h-7 rounded-[8px] bg-cyan-500/10
                        border border-cyan-500/22 flex items-center
                        justify-center text-cyan-400
                        hover:bg-cyan-500/20 transition-all text-xs">
                      ↗
                    </a>
                  )}
                  <button
                    onClick={() => setModal(c)}
                    aria-label={`Edit ${c.title}`}
                    className="w-7 h-7 rounded-[8px] bg-violet-500/12
                      border border-violet-500/25 flex items-center
                      justify-center text-violet-400
                      hover:bg-violet-500/25 transition-all">
                    <Pencil size={11}/>
                  </button>
                  <button
                    onClick={() => deleteCert(c._id)}
                    aria-label={`Delete ${c.title}`}
                    className="w-7 h-7 rounded-[8px] bg-red-500/10
                      border border-red-500/22 flex items-center
                      justify-center text-red-400
                      hover:bg-red-500/20 transition-all">
                    <Trash2 size={11}/>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        </>
      )}

      {/* Modal */}
      <AnimatePresence>
        {modal && (
          <CertModal
            cert={modal === "add" ? null : modal}
            token={token}
            onClose={() => setModal(null)}
            onSaved={fetchCerts}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ManageCertificates;