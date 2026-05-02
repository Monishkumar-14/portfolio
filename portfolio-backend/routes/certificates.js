import express from "express";
import {
  getCertificates, createCertificate,
  updateCertificate, deleteCertificate,
} from "../controllers/certificateController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/",       getCertificates);                   // public
router.post("/",      protect, createCertificate);        // admin
router.put("/:id",    protect, updateCertificate);        // admin
router.delete("/:id", protect, deleteCertificate);        // admin

export default router;