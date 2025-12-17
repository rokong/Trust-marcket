import express from "express";
import User from "../models/User.js";
import authMiddleware from "../middleware/authMiddleware.js";
import adminOnly from "../middleware/adminOnly.js";

const router = express.Router();

// 🔹 Get all registered users (Admin only)
router.get("/admin/users", authMiddleware, adminOnly, async (req, res) => {
  try {
    const users = await User.find({}, "_id name email createdAt")
      .sort({ createdAt: -1 });

    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to load users" });
  }
});

export default router;
