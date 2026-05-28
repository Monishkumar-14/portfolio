import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, Github, X } from "lucide-react";
import axios  from "axios";
import toast  from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

// ── Helpers ───────────────────────────────────────────────────────

const EMPTY = {
  title: "", description: "", techStack: "",
  githubLink: "", liveLink: "", category: "Full Stack", status: "Live",
  caseStudy: { problem: "", approach: "", challenge: "", outcome: "" },
};

// ── Modal ─────────────────────────────────────────────────────────
const ProjectModal = ({ project, onClose, onSaved, token }) => {
  const [form,    setForm]    = useState(project || EMPTY);
  const [loading, setLoading] = useState(false);

  const set    = (k, v) => setForm((p) => ({ ...p, [k]: v }));
  const setCS  = (k, v) => setForm((p) => ({
    ...p, caseStudy: { ...p.caseStudy, [k]: v },
  }));

  const handleSave = async () => {
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

  const Input = ({ label, k, type = "text", placeholder }) => (
    <div>
      <label className="block text-[10px] font-semibold uppercase
        tracking-[1.5px] text-white/30 mb-1.5">
        {label}
      </label>
      <input
        type={type}
        value={form[k] ?? ""}
        onChange={(e) => set(k, e.target.value)}
        placeholder={placeholder}
        className="glass-input w-full px-4 py-2.5 text-sm"
      />
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1,    y: 0  }}
        exit={{ scale: 0.95,    y: 20 }}
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto
          glass-card p-8 relative"
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-lg font-extrabold">
              {project?._id ? "Edit Project" : "Add New Project"}
            </h2>
            <p className="text-xs text-white/35 mt-1">
              Fill in the details below
            </p>
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
          <Input label="Project Title *" k="title" placeholder="SpareChange"/>

          <div>
            <label className="block text-[10px] font-semibold uppercase
              tracking-[1.5px] text-white/30 mb-1.5">
              Description *
            </label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="Brief project description..."
              className="glass-input w-full px-4 py-2.5 text-sm resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input label="GitHub URL"  k="githubLink" placeholder="https://github.com/..."/>
            <Input label="Live URL"    k="liveLink"   placeholder="Optional"/>
          </div>

          <Input label="Tech Stack (comma separated)" k="techStack"
            placeholder="React, Node.js, PostgreSQL"/>

          <div className="grid grid-cols-2 gap-4">
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
                {["Full Stack","ML / AI","DBMS","Systems","Other"].map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-semibold uppercase
                tracking-[1.5px] text-white/30 mb-1.5">
                Status
              </label>
              <select
                value={form.status}
                onChange={(e) => set("status", e.target.value)}
                className="glass-input w-full px-4 py-2.5 text-sm"
              >
                <option value="Live">Live</option>
                <option value="Draft">Draft</option>
              </select>
            </div>
          </div>

          {/* Case Study */}
          <div className="pt-2">
            <p className="text-[10px] font-semibold uppercase tracking-[2px]
              text-white/28 mb-3">
              Case Study (Optional)
            </p>
            <div className="grid grid-cols-2 gap-3">
              {["problem","approach","challenge","outcome"].map((f) => (
                <div key={f}>
                  <label className="block text-[10px] font-semibold uppercase
                    tracking-[1px] text-white/28 mb-1.5 capitalize">
                    {f}
                  </label>
                  <textarea
                    rows={2}
                    value={form.caseStudy?.[f] ?? ""}
                    onChange={(e) => setCS(f, e.target.value)}
                    placeholder={`${f}...`}
                    className="glass-input w-full px-3 py-2 text-xs resize-none"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 mt-6">
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
              btn-primary-glass disabled:opacity-50 flex items-center gap-2"
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
              project?._id ? "Update Project" : "Add Project"
            )}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
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
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/projects`
      );
      setProjects(data.projects || data);
    } catch {
      toast.error("Failed to fetch projects.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProjects(); }, []);

  const deleteProject = async (id) => {
    if (!window.confirm("Delete this project?")) return;
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/projects/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Project deleted.");
      fetchProjects();
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
            Manage Projects
          </h1>
          <p className="text-xs text-white/35 mt-1">
            {projects.length} project{projects.length !== 1 ? "s" : ""}
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => setModal("add")}
          className="flex items-center gap-2 px-5 py-2.5 rounded-[12px]
            text-sm font-bold btn-primary-glass"
        >
          <Plus size={15}/> Add Project
        </motion.button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center py-20 text-white/30 text-sm">
          Loading projects...
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block glass-card overflow-hidden">
          {/* Head */}
          <div className="grid px-5 py-3 border-b border-white/7
            text-[10px] font-semibold uppercase tracking-[1.5px]
            text-white/28"
            style={{ gridTemplateColumns: "1fr 1.2fr 100px 90px 90px" }}>
            <span>Project</span>
            <span>Tech Stack</span>
            <span>Category</span>
            <span>Status</span>
            <span>Actions</span>
          </div>

          {projects.length === 0 ? (
            <div className="text-center py-14 text-white/30 text-sm">
              No projects yet. Click "+ Add Project" to get started.
            </div>
          ) : (
            <AnimatePresence>
              {projects.map((p, i) => (
                <motion.div
                  key={p._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1,  y: 0  }}
                  exit={{ opacity: 0,      y: -10 }}
                  transition={{ delay: i * 0.05 }}
                  className="grid px-5 py-4 border-b border-white/5
                    hover:bg-white/3 transition-colors items-center"
                  style={{ gridTemplateColumns: "1fr 1.2fr 100px 90px 90px" }}
                >
                  {/* Title */}
                  <div>
                    <p className="text-sm font-bold text-white">{p.title}</p>
                    <p className="text-[11px] text-white/35 mt-0.5">
                      {p.description?.slice(0, 48)}...
                    </p>
                  </div>

                  {/* Tech */}
                  <div className="flex flex-wrap gap-1">
                    {(Array.isArray(p.techStack)
                      ? p.techStack
                      : p.techStack?.split(",") || []
                    ).slice(0, 3).map((t) => (
                      <span key={t}
                        className="px-2 py-0.5 rounded-full text-[9px]
                          font-mono bg-white/6 border border-white/9
                          text-white/40">
                        {t.trim()}
                      </span>
                    ))}
                  </div>

                  {/* Category */}
                  <span className="text-xs text-white/45">{p.category}</span>

                  {/* Status */}
                  <span className={`inline-flex px-2.5 py-1 rounded-full
                    text-[10px] font-semibold w-fit
                    ${p.status === "Live"
                      ? "bg-green-500/12 border border-green-500/25 text-green-400"
                      : "bg-amber-500/12 border border-amber-500/25 text-amber-400"
                    }`}>
                    ● {p.status}
                  </span>

                  {/* Actions */}
                  <div className="flex gap-2">
                    {p.githubLink && (
                      <a href={p.githubLink} target="_blank" rel="noreferrer"
                        aria-label={`View ${p.title} on GitHub`}
                        className="w-7 h-7 rounded-[8px] bg-white/6
                          border border-white/10 flex items-center justify-center
                          text-white/40 hover:text-white hover:bg-white/12
                          transition-all">
                        <Github size={12}/>
                      </a>
                    )}
                    <button
                      onClick={() => setModal(p)}
                      aria-label={`Edit ${p.title}`}
                      className="w-7 h-7 rounded-[8px] bg-violet-500/12
                        border border-violet-500/25 flex items-center
                        justify-center text-violet-400
                        hover:bg-violet-500/25 transition-all">
                      <Pencil size={12}/>
                    </button>
                    <button
                      onClick={() => deleteProject(p._id)}
                      aria-label={`Delete ${p.title}`}
                      className="w-7 h-7 rounded-[8px] bg-red-500/10
                        border border-red-500/22 flex items-center
                        justify-center text-red-400
                        hover:bg-red-500/20 transition-all">
                      <Trash2 size={12}/>
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        {/* Mobile card layout */}
        <div className="md:hidden flex flex-col gap-3">
          {projects.length === 0 ? (
            <div className="text-center py-14 text-white/30 text-sm">
              No projects yet. Click "+ Add Project" to get started.
            </div>
          ) : (
            projects.map((p) => (
              <div key={p._id} className="glass-card p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-white truncate">{p.title}</p>
                    <p className="text-[11px] text-white/35 mt-0.5 line-clamp-2">
                      {p.description?.slice(0, 80)}...
                    </p>
                  </div>
                  <span className={`inline-flex px-2.5 py-1 rounded-full
                    text-[10px] font-semibold flex-shrink-0 ml-2
                    ${p.status === "Live"
                      ? "bg-green-500/12 border border-green-500/25 text-green-400"
                      : "bg-amber-500/12 border border-amber-500/25 text-amber-400"
                    }`}>
                    ● {p.status}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1 mb-3">
                  {(Array.isArray(p.techStack)
                    ? p.techStack
                    : p.techStack?.split(",") || []
                  ).slice(0, 3).map((t) => (
                    <span key={t}
                      className="px-2 py-0.5 rounded-full text-[9px]
                        font-mono bg-white/6 border border-white/9
                        text-white/40">
                      {t.trim()}
                    </span>
                  ))}
                  <span className="px-2 py-0.5 rounded-full text-[9px]
                    font-mono bg-white/4 border border-white/8 text-white/30">
                    {p.category}
                  </span>
                </div>
                <div className="flex gap-2">
                  {p.githubLink && (
                    <a href={p.githubLink} target="_blank" rel="noreferrer"
                      aria-label={`View ${p.title} on GitHub`}
                      className="w-7 h-7 rounded-[8px] bg-white/6
                        border border-white/10 flex items-center justify-center
                        text-white/40 hover:text-white hover:bg-white/12
                        transition-all">
                      <Github size={12}/>
                    </a>
                  )}
                  <button
                    onClick={() => setModal(p)}
                    aria-label={`Edit ${p.title}`}
                    className="w-7 h-7 rounded-[8px] bg-violet-500/12
                      border border-violet-500/25 flex items-center
                      justify-center text-violet-400
                      hover:bg-violet-500/25 transition-all">
                    <Pencil size={12}/>
                  </button>
                  <button
                    onClick={() => deleteProject(p._id)}
                    aria-label={`Delete ${p.title}`}
                    className="w-7 h-7 rounded-[8px] bg-red-500/10
                      border border-red-500/22 flex items-center
                      justify-center text-red-400
                      hover:bg-red-500/20 transition-all">
                    <Trash2 size={12}/>
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
          <ProjectModal
            project={modal === "add" ? null : modal}
            token={token}
            onClose={() => setModal(null)}
            onSaved={fetchProjects}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ManageProjects;