//backend/src/routes/adminUserRoutes.js
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

// ✅ DELETE user (ADMIN ONLY)
router.delete("/admin/users/:id", authMiddleware, adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 🔒 Optional safety: verified user delete block
    if (user.kyc?.status === "verified") {
      return res
        .status(403)
        .json({ message: "Verified user cannot be deleted" });
    }

    await user.deleteOne();
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete user" });
  }
});

export default router;
