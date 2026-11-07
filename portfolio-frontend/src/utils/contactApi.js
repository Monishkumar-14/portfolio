/* Shared contact helpers — the SAME endpoint, payload shape and validation rules as Contact.jsx:
   POST ${VITE_API_URL}/api/messages  { name, email, subject, message }
   (Contact.jsx can import these too; it is left untouched here.) */
import axios from "axios";

export const MAX_MESSAGE_LENGTH = 2000; // same limit as the Contact form textarea
export const SUBJECT_SUGGESTIONS = ["Job Opportunity", "Collaboration", "Freelance", "Open Source", "General Inquiry"];

export const validators = {
  name: (v) => (v.trim().length >= 2 ? (v.trim().length <= 80 ? null : "Please keep your name under 80 characters") : "Please enter your name (at least 2 characters)"),
  email: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) && v.trim().length <= 254 ? null : "That doesn't look like a valid email address"),
  subject: (v) => (v.trim().length >= 2 ? (v.trim().length <= 120 ? null : "Please keep the subject under 120 characters") : "Please enter a subject (at least 2 characters)"),
  message: (v) => (v.trim().length >= 10 ? (v.length <= MAX_MESSAGE_LENGTH ? null : `Please keep the message under ${MAX_MESSAGE_LENGTH} characters`) : "Please write at least 10 characters"),
};

const API = import.meta.env.VITE_API_URL || "";

/** Resolves only when the backend answers 2xx (axios rejects everything else). */
export const submitContactMessage = ({ name, email, subject, message }) =>
  axios.post(`${API}/api/messages`, {
    name: name.trim(), email: email.trim(), subject: subject.trim(), message: message.trim(),
  });

export const contactErrorDetail = (err) =>
  err?.response?.data?.message || (err?.request ? "Couldn't reach the server." : null);