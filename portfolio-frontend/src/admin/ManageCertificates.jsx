import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, CheckCircle, ExternalLink, Award, Star } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { Field, Modal, PageHeader, Pill, Spinner, Switch } from "./AdminUI";
import "./Admin.css";

const COLS = "minmax(0, 1fr) 150px 120px 70px 110px 110px";

const EMPTY = {
  title: "", issuer: "", category: "Cloud",
  year: "", score: "", link: "", verified: false, featured: false,
};

const CATEGORIES = ["Cloud", "Security", "ML / Data", "DSA", "Programming", "Other"];

// Category → pill tone (portfolio palette: orange, blue, green, amber, red, neutral)
const CAT_TONE = { "Cloud": "blue", "Security": "red", "ML / Data": "orange", "DSA": "amber", "Programming": "green", "Other": undefined };

const TextField = ({ id, label, value, onChange, placeholder }) => (
  <Field id={id} label={label}>
    <input id={id} value={value ?? ""} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="adm-input" />
  </Field>
);

const VerifiedPill = ({ verified }) => verified
  ? <Pill tone="green"><CheckCircle size={10} aria-hidden="true"/> Verified</Pill>
  : <Pill>Unverified</Pill>;

const RowActions = ({ c, onEdit, onDelete }) => (
  <div className="adm-actions">
    {c.link && (
      <a href={c.link} target="_blank" rel="noreferrer" aria-label={`View ${c.title} certificate link`} className="adm-iconbtn adm-iconbtn--blue"><ExternalLink size={14}/></a>
    )}
    <button type="button" onClick={() => onEdit(c)} aria-label={`Edit ${c.title}`} className="adm-iconbtn adm-iconbtn--accent"><Pencil size={14}/></button>
    <button type="button" onClick={() => onDelete(c._id)} aria-label={`Delete ${c.title}`} className="adm-iconbtn adm-iconbtn--danger"><Trash2 size={14}/></button>
  </div>
);

// ── Modal ─────────────────────────────────────────────────────────
const CertModal = ({ cert, token, onClose, onSaved }) => {
  const [form,    setForm]    = useState(cert || EMPTY);
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const handleSave = async () => {
    if (loading) return;
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
    <Modal
      title={cert?._id ? "Edit Certificate" : "Add Certificate"} subtitle="Fill in the details" onClose={onClose} width={560}
      footer={<>
        <button type="button" onClick={onClose} className="adm-btn">Cancel</button>
        <button type="button" onClick={handleSave} disabled={loading} className="adm-btn adm-btn--primary">
          {loading ? <><Spinner size={14}/> SAVING...</> : (cert?._id ? "UPDATE CERTIFICATE" : "ADD CERTIFICATE")}
        </button>
      </>}
    >
      <div className="adm-stack">
        <TextField id="cm-title" label="Certificate Title *" value={form.title} onChange={(v) => set("title", v)} placeholder="e.g. Google Cybersecurity Professional" />

        <div className="adm-grid2">
          <TextField id="cm-issuer" label="Issuer *" value={form.issuer} onChange={(v) => set("issuer", v)} placeholder="Google · Coursera" />
          <TextField id="cm-year"   label="Year *"   value={form.year}   onChange={(v) => set("year", v)}   placeholder="2024" />
        </div>

        <div className="adm-grid2">
          <Field id="cm-cat" label="Category">
            <select id="cm-cat" value={form.category} onChange={(e) => set("category", e.target.value)} className="adm-input">
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>
          <TextField id="cm-score" label="Score (Optional)" value={form.score} onChange={(v) => set("score", v)} placeholder="e.g. 85%" />
        </div>

        <TextField id="cm-link" label="Verification Link" value={form.link} onChange={(v) => set("link", v)} placeholder="https://coursera.org/verify/..." />

        <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
          {[{ key: "verified", label: "Verified" }, { key: "featured", label: "Featured" }].map(({ key, label }) => (
            <div key={key} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Switch checked={!!form[key]} onChange={(v) => set(key, v)} label={label} />
              <span style={{ font: "500 12.5px/1 var(--sans)", color: "#aeb3ba" }}>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </Modal>
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
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/certificates`);
      setCerts(data.certificates || data);
    } catch {
      toast.error("Failed to fetch certificates.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCerts(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const deleteCert = async (id) => {
    if (!window.confirm("Delete this certificate?")) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/certificates/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      toast.success("Certificate deleted.");
      fetchCerts();
    } catch {
      toast.error("Delete failed.");
    }
  };

  return (
    <div>
      <PageHeader
        eyebrow="Content" icon={Award} title="Manage Certificates" sub={`${certs.length} certificate${certs.length !== 1 ? "s" : ""}`}
        action={<button type="button" onClick={() => setModal("add")} className="adm-btn adm-btn--primary"><Plus size={15} aria-hidden="true"/> ADD CERTIFICATE</button>}
      />

      {loading ? (
        <div className="adm-load"><Spinner size={28}/></div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="adm-card adm-table" style={{ "--cols": COLS }}>
            <div className="adm-row adm-row--head"><span>Certificate</span><span>Issuer</span><span>Category</span><span>Year</span><span>Status</span><span>Actions</span></div>
            {certs.length === 0 ? (
              <div className="adm-empty">No certificates yet. Click "Add Certificate".</div>
            ) : (
              <AnimatePresence>
                {certs.map((c) => (
                  <motion.div key={c._id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="adm-row">
                    <div style={{ minWidth: 0 }}>
                      <p className="adm-row__t">{c.title}</p>
                      {c.score && <span style={{ display: "inline-block", marginTop: 6 }}><Pill tone="green"><Star size={10} aria-hidden="true"/> {c.score}</Pill></span>}
                    </div>
                    <p className="adm-row__s adm-trunc" style={{ margin: 0, color: "#9a9fa8" }} title={c.issuer}>{c.issuer}</p>
                    <Pill tone={CAT_TONE[c.category]}>{c.category}</Pill>
                    <span style={{ font: "400 12px/1 var(--mono)", color: "#9a9fa8" }}>{c.year}</span>
                    <VerifiedPill verified={c.verified} />
                    <RowActions c={c} onEdit={setModal} onDelete={deleteCert} />
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>

          {/* Mobile cards */}
          <div className="adm-cards">
            {certs.length === 0 ? (
              <div className="adm-card adm-empty">No certificates yet. Tap "Add Certificate".</div>
            ) : certs.map((c) => (
              <div key={c._id} className="adm-card adm-cardrow">
                <div className="adm-cardrow__top">
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <p className="adm-row__t">{c.title}</p>
                    <p className="adm-row__s">{c.issuer} · {c.year}</p>
                  </div>
                  <VerifiedPill verified={c.verified} />
                </div>
                <div className="adm-chips" style={{ marginBottom: 12 }}>
                  <Pill tone={CAT_TONE[c.category]}>{c.category}</Pill>
                  {c.score && <Pill tone="green"><Star size={10} aria-hidden="true"/> {c.score}</Pill>}
                </div>
                <RowActions c={c} onEdit={setModal} onDelete={deleteCert} />
              </div>
            ))}
          </div>
        </>
      )}

      <AnimatePresence>
        {modal && (
          <CertModal cert={modal === "add" ? null : modal} token={token} onClose={() => setModal(null)} onSaved={fetchCerts} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ManageCertificates;