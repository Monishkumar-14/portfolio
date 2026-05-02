import express from "express";
import {
  getProjects, getProjectById,
  createProject, updateProject, deleteProject,
} from "../controllers/projectController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/",     getProjects);               // public
router.get("/:id",  getProjectById);            // public
router.post("/",    protect, createProject);    // admin
router.put("/:id",  protect, updateProject);    // admin
router.delete("/:id", protect, deleteProject);  // admin

export default router;