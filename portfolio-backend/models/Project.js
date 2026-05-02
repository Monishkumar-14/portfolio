import mongoose from "mongoose";

const CaseStudySchema = new mongoose.Schema({
  problem:   { type: String, default: "" },
  approach:  { type: String, default: "" },
  challenge: { type: String, default: "" },
  outcome:   { type: String, default: "" },
}, { _id: false });

const ProjectSchema = new mongoose.Schema(
  {
    title:       { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    techStack:   [{ type: String, trim: true }],
    githubLink:  { type: String, default: "", trim: true },
    liveLink:    { type: String, default: "", trim: true },
    category:    {
      type: String,
      enum: ["Full Stack", "ML / AI", "DBMS", "Systems", "Other"],
      default: "Full Stack",
    },
    status:      { type: String, enum: ["Live", "Draft"], default: "Live" },
    featured:    { type: Boolean, default: false },
    order:       { type: Number,  default: 0 },
    images:      [{ type: String }],
    caseStudy:   { type: CaseStudySchema, default: () => ({}) },
  },
  { timestamps: true }
);

export default mongoose.model("Project", ProjectSchema);