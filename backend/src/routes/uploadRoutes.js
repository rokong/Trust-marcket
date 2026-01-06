// backend/src/routes/uploadRoutes.js
import express from "express";
import multer from "multer";
import Message from "../models/Message.js";
import { parser } from "../utils/cloudinary.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

export default function uploadRoutes(io) {
  router.post("/message-media", parser.single("file"), async (req, res) => {
    try {
      const { userId, sender } = req.body;

      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const type = req.file.mimetype.startsWith("video") ? "video" : "image";

      const msg = await Message.create({
        userId,
        sender,
        type,
        mediaUrl: req.file.path, // Cloudinary URL
      });

      io.to(userId.toString()).emit("receive_message", msg);

      res.json(msg);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Upload failed" });
    }
  });

  return router;
}
