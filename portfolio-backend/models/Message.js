import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
  {
    name:    { type: String, required: true, trim: true },
    email:   { type: String, required: true, trim: true, lowercase: true },
    subject: { type: String, default: "General Enquiry", trim: true },
    message: { type: String, required: true, trim: true },
    read:    { type: Boolean, default: false },
    repliedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

export default mongoose.model("Message", MessageSchema);