// backend/src/routes/views.js
import express from "express";
import SiteStats from "../models/SiteStats.js";

const router = express.Router();

// Increment home page view
router.post("/home", async (req, res) => {
  try {
    let stats = await SiteStats.findOne({});
    if (!stats) {
      stats = new SiteStats({ homeViews: 1 });
    } else {
      stats.homeViews += 1;
    }
    await stats.save();
    res.json({ homeViews: stats.homeViews });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to increment home views" });
  }
});

export default router;
