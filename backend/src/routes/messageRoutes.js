// backend/src/routes/messageRoutes.js
import express from "express";
import Message from "../models/Message.js";
import authMiddleware from "../middleware/authMiddleware.js"; // user auth
const router = express.Router();

// User / Admin send message
router.post("/send", authMiddleware, async (req, res) => {
  try {
    const { text, userId, type, postId, postPrice, postDescription, postTitle } = req.body; // <-- type & postId add
    const sender = req.user.isAdmin ? "admin" : "user";

    const msg = await Message.create({
      userId: userId || req.user.id,
      sender,
      text,
      postId,   // ⭐ added
      type,
      postTitle: postTitle || null,
      postDescription: postDescription || null,
      postPrice: postPrice || null,
    });

    
    
    res.json(msg);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Message send failed" });
  }
});

// Get messages by userId
router.get("/:userId", authMiddleware, async (req, res) => {
  try {
    const messages = await Message.find({ userId: req.params.userId }).sort({
      createdAt: 1,
    });
    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});


export default router;
