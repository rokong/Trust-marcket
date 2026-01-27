// backend/src/routes/views.js
import express from "express";
import SiteStats from "../models/SiteStats.js";

const router = express.Router();

router.post("/views/home", async (req, res) => {
  try {
    let stats = await SiteStats.findOne();

    if (!stats) {
      stats = await SiteStats.create({ homeViews: 1 });
    } else {
      stats.homeViews += 1;
      await stats.save();
    }

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to update views" });
  }
});

export default router;

