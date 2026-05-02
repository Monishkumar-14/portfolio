import Certificate from "../models/Certificate.js";

// GET /api/certificates  (public)
export const getCertificates = async (req, res) => {
  try {
    const certs = await Certificate.find().sort({ order: 1, year: -1 });
    return res.json({ success: true, count: certs.length, certificates: certs });
  } catch {
    return res.status(500).json({ message: "Server error." });
  }
};

// POST /api/certificates  (admin)
export const createCertificate = async (req, res) => {
  try {
    const { title, issuer, year } = req.body;
    if (!title?.trim() || !issuer?.trim() || !year?.trim())
      return res.status(400).json({ message: "Title, issuer and year required." });

    const cert = await Certificate.create(req.body);
    return res.status(201).json({ success: true, certificate: cert });
  } catch {
    return res.status(500).json({ message: "Server error." });
  }
};

// PUT /api/certificates/:id  (admin)
export const updateCertificate = async (req, res) => {
  try {
    const cert = await Certificate.findByIdAndUpdate(
      req.params.id, req.body, { new: true, runValidators: true }
    );
    if (!cert) return res.status(404).json({ message: "Certificate not found." });
    return res.json({ success: true, certificate: cert });
  } catch {
    return res.status(500).json({ message: "Server error." });
  }
};

// DELETE /api/certificates/:id  (admin)
export const deleteCertificate = async (req, res) => {
  try {
    await Certificate.findByIdAndDelete(req.params.id);
    return res.json({ success: true, message: "Certificate deleted." });
  } catch {
    return res.status(500).json({ message: "Server error." });
  }
};