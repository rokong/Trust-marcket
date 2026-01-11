// backend/src/routes/uploadRoutes.js
import express from "express";
import Message from "../models/Message.js";
import { parser } from "../utils/cloudinary.js";

const upload = parser;

export default function uploadRoutes(io) {
  const router = express.Router();

  router.post("/message-media", upload.single("file"), async (req, res) => {
    try {
      const { userId, sender } = req.body;
      if (!req.file) return res.status(400).json({ message: "No file uploaded" });

      const type = req.file.mimetype.startsWith("video") ? "video" : "image";

      const msg = await Message.create({
        userId,
        sender,
        type,
        mediaUrl: req.file.path, // cloudinary URL
      });

      // ✅ ONLY ONE EMIT (source of truth)
      io.to(userId.toString()).emit("receive_message", msg);

      res.json(msg);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Upload failed" });
    }
  });

  return router;
}
