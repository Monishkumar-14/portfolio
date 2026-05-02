import mongoose from "mongoose";

const CertificateSchema = new mongoose.Schema(
  {
    title:    { type: String, required: true, trim: true },
    issuer:   { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ["Cloud", "Security", "ML / Data", "DSA", "Programming", "Other"],
      default: "Other",
    },
    year:     { type: String, required: true },
    score:    { type: String, default: null },
    link:     { type: String, default: "" },
    image:    { type: String, default: "" },
    verified: { type: Boolean, default: false },
    featured: { type: Boolean, default: false },
    order:    { type: Number,  default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Certificate", CertificateSchema);