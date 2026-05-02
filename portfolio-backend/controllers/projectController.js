import Project from "../models/Project.js";

// GET /api/projects  (public)
export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ order: 1, createdAt: -1 });
    return res.json({ success: true, count: projects.length, projects });
  } catch (err) {
    return res.status(500).json({ message: "Server error." });
  }
};

// GET /api/projects/:id  (public)
export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found." });
    return res.json({ success: true, project });
  } catch {
    return res.status(500).json({ message: "Server error." });
  }
};

// POST /api/projects  (admin)
export const createProject = async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title?.trim() || !description?.trim())
      return res.status(400).json({ message: "Title and description required." });

    const project = await Project.create(req.body);
    return res.status(201).json({ success: true, project });
  } catch (err) {
    return res.status(500).json({ message: "Server error." });
  }
};

// PUT /api/projects/:id  (admin)
export const updateProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    if (!project) return res.status(404).json({ message: "Project not found." });
    return res.json({ success: true, project });
  } catch {
    return res.status(500).json({ message: "Server error." });
  }
};

// DELETE /api/projects/:id  (admin)
export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found." });
    return res.json({ success: true, message: "Project deleted." });
  } catch {
    return res.status(500).json({ message: "Server error." });
  }
};