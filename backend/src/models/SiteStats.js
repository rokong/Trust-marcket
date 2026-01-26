// src/models/SiteStats.js
import mongoose from "mongoose";

const siteStatsSchema = new mongoose.Schema({
  homeViews: { type: Number, default: 0 },
});

export default mongoose.model("SiteStats", siteStatsSchema);
