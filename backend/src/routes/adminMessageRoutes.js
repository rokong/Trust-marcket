//backend/src/routes/adminMessageRoutes.js
import express from "express";
import Message from "../models/Message.js";
import User from "../models/User.js";
import authMiddleware from "../middleware/authMiddleware.js";
import adminOnly from "../middleware/adminOnly.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| 🔹 1) Get all users who sent messages (Sorted by last message time)
|--------------------------------------------------------------------------
|  ➤ আগের সব কাজ same থাকবে
|  ➤ নতুন extra:  
|      ✔ কোন user last sms দিয়েছে → উপরে চলে আসবে  
|      ✔ lastMessageTime সহ user list পাওয়া যাবে  
|--------------------------------------------------------------------------
*/
router.get("/message-users", authMiddleware, adminOnly, async (req, res) => {
  try {
    const lastMessages = await Message.aggregate([
      {
        $group: {
          _id: "$userId",
          lastMessageTime: { $max: "$createdAt" },
          unreadCount: { $sum: { $cond: [{ $eq: ["$readByAdmin", false] }, 1, 0] } }
        },
      },
      { $sort: { lastMessageTime: -1 } },
    ]);

    const users = await Promise.all(
      lastMessages.map(async (msg) => {
        const user = await User.findById(msg._id).select("email name");
        return {
          _id: msg._id,
          email: user?.email || "Unknown",
          name: user?.name || "No Name",
          lastMessageTime: msg.lastMessageTime,
          unreadCount: msg.unreadCount
        };
      })
    );

    res.json(users);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to load users" });
  }
});

/*
|--------------------------------------------------------------------------
| 🔹 2) Get all messages of specific user (OLD feature same রাখা হয়েছে)
|--------------------------------------------------------------------------
*/
router.get("/messages/:userId", authMiddleware, adminOnly, async (req, res) => {
  try {
    const messages = await Message.find({ userId: req.params.userId }).sort({
      createdAt: 1,
    });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: "Failed to load messages" });
  }
});

// User list with last message & unread count
router.get("/message-users", async (req, res) => {
  const usersAgg = await Message.aggregate([
    { $group: {
        _id: "$userId",
        lastMessageTime: { $max: "$createdAt" },
        unreadCount: { $sum: { $cond: [{ $eq: ["$readByAdmin", false] }, 1, 0] } }
      }
    },
    { $sort: { lastMessageTime: -1 } }
  ]);

  const users = await Promise.all(usersAgg.map(async u => {
    const user = await User.findById(u._id).select("email name");
    return {
      _id: u._id,
      email: user?.email || "Unknown",
      name: user?.name || "No Name",
      lastMessageTime: u.lastMessageTime,
      unreadCount: u.unreadCount
    };
  }));
  res.json(users);
});

// Mark all messages as read for that user
router.post("/messages/mark-read/:userId", authMiddleware, adminOnly, async (req, res) => {
  const { userId } = req.params;
  await Message.updateMany(
    { userId, readByAdmin: false },
    { $set: { readByAdmin: true } }
  );
  res.json({ success: true });
});

// Admin send message to user
router.post("/messages/send", authMiddleware, adminOnly, async (req, res) => {
  try {
    const { userId, text, type } = req.body;

    const msg = await Message.create({
      userId,
      sender: "admin",
      text,
      type,
    });

    res.json(msg);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Admin message send failed" });
  }
});


// Get single user info by ID
router.get("/message-user/:userId", authMiddleware, adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select("name email");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
