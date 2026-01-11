// backend/src/routes/kyc.js
import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import User from "../models/User.js";

const router = express.Router();

// Submit or Resubmit KYC
router.post("/submit", authMiddleware, async (req, res) => {
  const { nidFront, nidBack, selfie } = req.body;

  if (!nidFront || !nidBack || !selfie) {
    return res.status(400).json({ message: "All files required" });
  }

  await User.findByIdAndUpdate(req.user.id, {
    $set: {
      "kyc.front": nidFront,
      "kyc.back": nidBack,
      "kyc.selfie": selfie,
      "kyc.status": "pending",
      "kyc.rejectionReason": null,
    },
  });

  res.json({ message: "KYC submitted, pending review" });
});

export default router;
