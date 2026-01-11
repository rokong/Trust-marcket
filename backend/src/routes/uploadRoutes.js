// backend/src/routes/uploadRoutes.js
import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import Message from "../models/Message.js";

export default function uploadRoutes(io) {
  const router = express.Router();

  // ---------------- STORAGE ----------------
  const storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: "messages",
      resource_type: (req, file) =>
        file.mimetype.startsWith("video") ? "video" : "image",
    },
  });

  const upload = multer({ storage }); // <-- must be after storage

  // ---------------- ROUTE ----------------
  router.post("/message-media", upload.single("file"), async (req, res) => {
    try {
      const { userId, sender } = req.body;
      if (!req.file) return res.status(400).json({ message: "No file uploaded" });

      const type = req.file.mimetype.startsWith("video") ? "video" : "image";

      const msg = await Message.create({
        userId,
        sender,
        type,
        mediaUrl: req.file.path, // CloudinaryStorage path
      });

      io.to(userId.toString()).emit("receive_message", msg); // emit

      res.json(msg);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Upload failed", error: err.message });
    }
  });

  return router;
}
