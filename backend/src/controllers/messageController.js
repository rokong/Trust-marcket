import Message from "../models/Message.js";
import User from "../models/User.js";

// Get all users who messaged admin
export const getAllUsers = async (req, res) => {
  try {
    const senderIds = await Message.distinct("senderId");
    const users = await User.find({ _id: { $in: senderIds } }).select("name email");
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get messages of a user
export const getUserMessages = async (req, res) => {
  try {
    const { userId } = req.params;
    const messages = await Message.find({ senderId: userId }).sort({ createdAt: 1 });
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Save message
export const saveMessage = async (req, res) => {
  try {
    const { senderId, sender, message, isAdmin } = req.body;
    const newMsg = await Message.create({ senderId, sender, message, isAdmin });
    res.status(201).json(newMsg);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
