//backend/src/routes/adminMessageRoutes.js
import express from "express";
import Message from "../models/Message.js";
import User from "../models/User.js";
import authMiddleware from "../middleware/authMiddleware.js";
import adminOnly from "../middleware/adminOnly.js";

const router = express.Router();

/**
 * GET: Admin user list with last message + unread count
 */
router.get(
  "/message-users",
  authMiddleware,
  adminOnly,
  async (req, res) => {
    try {
      const lastMessages = await Message.aggregate([
        {
          $group: {
            _id: "$userId",
            lastMessageTime: { $max: "$createdAt" },
            unreadCount: {
              $sum: {
                $cond: [{ $eq: ["$readByAdmin", false] }, 1, 0],
              },
            },
          },
        },
        { $sort: { lastMessageTime: -1 } },
      ]);

      const users = await Promise.all(
        lastMessages.map(async (msg) => {
          const user = await User.findById(msg._id).select("name email");
          return {
            _id: msg._id,
            name: user?.name || "No Name",
            email: user?.email || "Unknown",
            lastMessageTime: msg.lastMessageTime,
            unreadCount: msg.unreadCount,
          };
        })
      );

      res.json(users);
    } catch (err) {
      console.error("message-users error:", err);
      res.status(500).json({ error: "Failed to load users" });
    }
  }
);

/**
 * GET: All messages of a specific user
 */
router.get(
  "/messages/:userId",
  authMiddleware,
  adminOnly,
  async (req, res) => {
    try {
      const messages = await Message.find({
        userId: req.params.userId,
      }).sort({ createdAt: 1 });

      res.json(messages);
    } catch (err) {
      console.error("load messages error:", err);
      res.status(500).json({ error: "Failed to load messages" });
    }
  }
);

/**
 * POST: Mark all messages as read by admin
 */
router.post(
  "/messages/mark-read/:userId",
  authMiddleware,
  adminOnly,
  async (req, res) => {
    try {
      await Message.updateMany(
        { userId: req.params.userId, readByAdmin: false },
        { $set: { readByAdmin: true } }
      );

      res.json({ success: true });
    } catch (err) {
      console.error("mark-read error:", err);
      res.status(500).json({ error: "Failed to mark messages as read" });
    }
  }
);

/**
 * POST: Admin sends message to user
 */
router.post(
  "/messages/send",
  authMiddleware,
  adminOnly,
  async (req, res) => {
    try {
      const { userId, text, type = "text" } = req.body;

      const msg = await Message.create({
        userId,
        sender: "admin",
        type,
        text,
        readByAdmin: true,
      });

      res.json(msg);
    } catch (err) {
      console.error("admin send error:", err);
      res.status(500).json({ error: "Admin message send failed" });
    }
  }
);

/**
 * GET: Single user info
 */
router.get(
  "/message-user/:userId",
  authMiddleware,
  adminOnly,
  async (req, res) => {
    try {
      const user = await User.findById(req.params.userId).select("name email");
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (err) {
      console.error("user info error:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

export default router;

