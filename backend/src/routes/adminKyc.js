//backend/src/routes/adminKyc.js
import express from "express";
import User from "../models/User.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// simple admin guard
const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin only" });
  }
  next();
};

// Get pending KYC users
router.get("/kyc/pending", authMiddleware, isAdmin, async (req, res) => {
  const users = await User.find({ "kyc.status": "pending" }).select(
    "name email kyc"
  );
  res.json(users);
});

// Review KYC
router.post("/kyc/review", authMiddleware, isAdmin, async (req, res) => {
  const { userId, decision, reason } = req.body;

  if (!["verified", "rejected"].includes(decision)) {
    return res.status(400).json({ message: "Invalid decision" });
  }

  const update =
    decision === "verified"
      ? {
          "kyc.status": "verified",
          "kyc.verifiedAt": new Date(),
        }
      : {
          "kyc.status": "rejected",
          "kyc.rejectionReason": reason || "Invalid documents",
        };

  await User.findByIdAndUpdate(userId, { $set: update });

  res.json({ message: "KYC updated" });
});

export default router;
