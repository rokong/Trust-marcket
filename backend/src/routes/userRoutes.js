// backend/src/routes/userRoutes.js
import express from "express";
import User from "../models/User.js";

const router = express.Router();

// Get user by ID
router.get("/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Set / Update user name
router.post("/set-name", async (req, res) => {
  try {
    const { userId, name } = req.body;
    if (!userId || !name)
      return res.status(400).json({ error: "Missing fields" });

    const user = await User.findByIdAndUpdate(
      userId,
      { name },
      { new: true }
    );

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
