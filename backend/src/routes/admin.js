// backend/src/routes/admin.js
import express from "express";
import Post from "../models/Post.js";
import Message from "../models/Message.js";
import User from "../models/User.js";
import SiteStats from "../models/SiteStats.js";

import authMiddleware from "../middleware/authMiddleware.js";
import adminOnly from "../middleware/adminOnly.js";

const router = express.Router();

/* -----------------------------------------------------------
   DELETE POST (Already had)
----------------------------------------------------------- */
router.delete("/reject/:id", authMiddleware, adminOnly, async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: "Post deleted!" });
  } catch (error) {
    res.status(500).json({ message: "Delete failed" });
  }
});

// 🔐 Admin stats (PROTECTED)
router.get("/stats", authMiddleware, adminOnly, async (req, res) => {
  try {
    const stats = await SiteStats.findOne({});
    res.json({ homeViews: stats?.homeViews || 0 });
  } catch (err) {
    res.status(500).json({ error: "Failed to load stats" });
  }
});

export default router;
