// backend/src/routes/views.js
import express from "express";
import SiteStats from "../models/SiteStats.js";

const router = express.Router();

// ✅ Open to all, increment on hit
router.post("/home", async (req, res) => {
  try {
    const stats = await SiteStats.findOneAndUpdate(
      {}, 
      { $inc: { homeViews: 1 } },  // atomic increment
      { new: true, upsert: true }
    );
    res.json({ success: true, homeViews: stats.homeViews });
  } catch (err) {
    res.status(500).json({ error: "Failed to update views" });
  }
});

export default router;
