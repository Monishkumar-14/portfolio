import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, Github, FolderOpen } from "lucide-react";
import axios  from "axios";
import toast  from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { Field, Modal, PageHeader, Pill, Spinner } from "./AdminUI";
import "./Admin.css";

const COLS = "minmax(0, 1fr) minmax(0, 1.2fr) 110px 100px 120px";
const CATEGORIES = ["Full Stack", "ML / AI", "DBMS", "Systems", "Other"];

const EMPTY = {
  title: "", description: "", techStack: "",
  githubLink: "", liveLink: "", category: "Full Stack", status: "Live",
  caseStudy: { problem: "", approach: "", challenge: "", outcome: "" },
};

const techList = (p) => (Array.isArray(p.techStack) ? p.techStack : p.techStack?.split(",") || []);

// Defined at module level: a component declared inside ProjectModal would remount (and lose focus) on every keystroke
const TextField = ({ id, label, value, onChange, placeholder, type = "text" }) => (
  <Field id={id} label={label}>
    <input id={id} type={type} value={value ?? ""} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="adm-input" />
  </Field>
);

const StatusPill = ({ status }) => <Pill tone={status === "Live" ? "green" : "amber"}>● {status}</Pill>;

const RowActions = ({ p, onEdit, onDelete }) => (
  <div className="adm-actions">
    {p.githubLink && (
      <a href={p.githubLink} target="_blank" rel="noreferrer" aria-label={`View ${p.title} on GitHub`} className="adm-iconbtn"><Github size={14}/></a>
    )}
    <button type="button" onClick={() => onEdit(p)} aria-label={`Edit ${p.title}`} className="adm-iconbtn adm-iconbtn--accent"><Pencil size={14}/></button>
    <button type="button" onClick={() => onDelete(p._id)} aria-label={`Delete ${p.title}`} className="adm-iconbtn adm-iconbtn--danger"><Trash2 size={14}/></button>
  </div>
);

// ── Modal ─────────────────────────────────────────────────────────
const ProjectModal = ({ project, onClose, onSaved, token }) => {
  const [form, setForm] = useState(() => {
    const base = project || EMPTY;
    // show an existing stack array as "React, Node.js" in the text field
    return { ...base, techStack: Array.isArray(base.techStack) ? base.techStack.join(", ") : base.techStack };
  });
  const [loading, setLoading] = useState(false);

  const set   = (k, v) => setForm((p) => ({ ...p, [k]: v }));
  const setCS = (k, v) => setForm((p) => ({ ...p, caseStudy: { ...p.caseStudy, [k]: v } }));

  const handleSave = async () => {
    if (loading) return;
    if (!form.title.trim() || !form.description.trim()) {
      toast.error("Title and description are required.");
      return;
    }
    setLoading(true);
    try {
      const payload = {
        ...form,
        techStack: typeof form.techStack === "string"
          ? form.techStack.split(",").map((t) => t.trim()).filter(Boolean)
          : form.techStack,
      };
      const instance = axios.create({
        baseURL: import.meta.env.VITE_API_URL,
        headers: { Authorization: `Bearer ${token}` },
      });
      if (project?._id) {
        await instance.put(`/api/projects/${project._id}`, payload);
        toast.success("Project updated!");
      } else {
        await instance.post("/api/projects", payload);
        toast.success("Project added!");
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
      title={project?._id ? "Edit Project" : "Add New Project"} subtitle="Fill in the details below" onClose={onClose} width={680}
      footer={<>
        <button type="button" onClick={onClose} className="adm-btn">Cancel</button>
        <button type="button" onClick={handleSave} disabled={loading} className="adm-btn adm-btn--primary">
          {loading ? <><Spinner size={14}/> SAVING...</> : (project?._id ? "UPDATE PROJECT" : "ADD PROJECT")}
        </button>
      </>}
    >
      <div className="adm-stack">
        <TextField id="pm-title" label="Project Title *" value={form.title} onChange={(v) => set("title", v)} placeholder="SpareChange" />

        <Field id="pm-desc" label="Description *">
          <textarea id="pm-desc" rows={3} value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="Brief project description..." className="adm-input" />
        </Field>

        <div className="adm-grid2">
          <TextField id="pm-gh"   label="GitHub URL" value={form.githubLink} onChange={(v) => set("githubLink", v)} placeholder="https://github.com/..." />
          <TextField id="pm-live" label="Live URL"   value={form.liveLink}   onChange={(v) => set("liveLink", v)}   placeholder="Optional" />
        </div>

        <TextField id="pm-tech" label="Tech Stack (comma separated)" value={form.techStack} onChange={(v) => set("techStack", v)} placeholder="React, Node.js, PostgreSQL" />

        <div className="adm-grid2">
          <Field id="pm-cat" label="Category">
            <select id="pm-cat" value={form.category} onChange={(e) => set("category", e.target.value)} className="adm-input">
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>
          <Field id="pm-status" label="Status">
            <select id="pm-status" value={form.status} onChange={(e) => set("status", e.target.value)} className="adm-input">
              <option value="Live">Live</option>
              <option value="Draft">Draft</option>
            </select>
          </Field>
        </div>

        <div>
          <p className="adm-sectionlabel">Case Study (Optional)</p>
          <div className="adm-grid2">
            {["problem", "approach", "challenge", "outcome"].map((f) => (
              <Field key={f} id={`pm-cs-${f}`} label={f}>
                <textarea id={`pm-cs-${f}`} rows={2} value={form.caseStudy?.[f] ?? ""} onChange={(e) => setCS(f, e.target.value)} placeholder={`${f}...`} className="adm-input" />
              </Field>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
};

// ── Main ──────────────────────────────────────────────────────────
const ManageProjects = () => {
  const { token }  = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [modal,    setModal]    = useState(null); // null | "add" | project obj

  const fetchProjects = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/projects`);
      setProjects(data.projects || data);
    } catch {
      toast.error("Failed to fetch projects.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProjects(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const deleteProject = async (id) => {
    if (!window.confirm("Delete this project?")) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/projects/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      toast.success("Project deleted.");
      fetchProjects();
    } catch {
      toast.error("Delete failed.");
    }
  };

  const clip = (s, n) => (s && s.length > n ? `${s.slice(0, n)}…` : s);

  return (
    <div>
      <PageHeader
        eyebrow="Content" icon={FolderOpen} title="Manage Projects" sub={`${projects.length} project${projects.length !== 1 ? "s" : ""}`}
        action={<button type="button" onClick={() => setModal("add")} className="adm-btn adm-btn--primary"><Plus size={15} aria-hidden="true"/> ADD PROJECT</button>}
      />

      {loading ? (
        <div className="adm-load"><Spinner size={28}/></div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="adm-card adm-table" style={{ "--cols": COLS }}>
            <div className="adm-row adm-row--head"><span>Project</span><span>Tech Stack</span><span>Category</span><span>Status</span><span>Actions</span></div>
            {projects.length === 0 ? (
              <div className="adm-empty">No projects yet. Click "Add Project" to get started.</div>
            ) : (
              <AnimatePresence>
                {projects.map((p) => (
                  <motion.div key={p._id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="adm-row">
                    <div style={{ minWidth: 0 }}>
                      <p className="adm-row__t">{p.title}</p>
                      <p className="adm-row__s">{clip(p.description, 60)}</p>
                    </div>
                    <div className="adm-chips">{techList(p).slice(0, 3).map((t) => <span key={t} className="adm-chip">{t.trim()}</span>)}</div>
                    <span style={{ font: "400 12px/1.3 var(--mono)", color: "#9a9fa8" }}>{p.category}</span>
                    <StatusPill status={p.status} />
                    <RowActions p={p} onEdit={setModal} onDelete={deleteProject} />
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>

          {/* Mobile cards */}
          <div className="adm-cards">
            {projects.length === 0 ? (
              <div className="adm-card adm-empty">No projects yet. Tap "Add Project" to get started.</div>
            ) : projects.map((p) => (
              <div key={p._id} className="adm-card adm-cardrow">
                <div className="adm-cardrow__top">
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <p className="adm-row__t">{p.title}</p>
                    <p className="adm-row__s">{clip(p.description, 90)}</p>
                  </div>
                  <StatusPill status={p.status} />
                </div>
                <div className="adm-chips" style={{ marginBottom: 12 }}>
                  {techList(p).slice(0, 3).map((t) => <span key={t} className="adm-chip">{t.trim()}</span>)}
                  <span className="adm-pill">{p.category}</span>
                </div>
                <RowActions p={p} onEdit={setModal} onDelete={deleteProject} />
              </div>
            ))}
          </div>
        </>
      )}

      <AnimatePresence>
        {modal && (
          <ProjectModal project={modal === "add" ? null : modal} token={token} onClose={() => setModal(null)} onSaved={fetchProjects} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ManageProjects;