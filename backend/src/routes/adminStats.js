// backend/src/routes/adminStats.js
import express from "express";
import SiteStats from "../models/SiteStats.js";
import authMiddleware from "../middleware/authMiddleware.js";
import adminOnly from "../middleware/adminOnly.js";

const router = express.Router();

// GET /api/admin/stats
router.get("/stats", authMiddleware, adminOnly, async (req, res) => {
  try {
    const stats = await SiteStats.findOne({});
    res.json({ homeViews: stats?.homeViews || 0 });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

export default router;
