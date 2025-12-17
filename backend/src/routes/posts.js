// backend/src/routes/posts.js
import express from "express"; 
import multer from "multer";
import fs from "fs";
import mongoose from "mongoose";
import auth from "../middleware/authMiddleware.js";
import Post from "../models/Post.js";
import User from "../models/User.js";

const router = express.Router();

// ------------------ Multer Setup ------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "uploads/";
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname.replace(/\s+/g, "-");
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// ------------------ GET All Posts ------------------
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load posts" });
  }
});

// ------------------ GET My Posts ------------------
router.get("/my-posts", auth, async (req, res) => {
  try {
    const posts = await Post.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load your posts" });
  }
});

// ------------------ GET Single Post ------------------
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load post" });
  }
});

// ------------------ CREATE POST ------------------
router.post(
  "/create",
  auth,
  upload.fields([
    { name: "images", maxCount: 20 },
    { name: "videos", maxCount: 5 },
  ]),
  async (req, res) => {
    try {
      const { title, description, price, category, phone } = req.body;
      const images = req.files?.images?.map(f => f.filename) || [];
      const videos = req.files?.videos?.map(f => f.filename) || [];

      const newPost = new Post({
        title,
        description,
        price,
        category,
        phone,
        images,
        videos,
        user: new mongoose.Types.ObjectId(req.user.id),
      });

      await newPost.save();
      res.json({ success: true, message: "Post created successfully", post: newPost });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to create post" });
    }
  }
);

// ------------------ UPDATE POST (Owner only) ------------------
router.put(
  "/:id",
  auth,
  upload.fields([
    { name: "images", maxCount: 20 },
    { name: "videos", maxCount: 5 },
  ]),
  async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      if (!post) return res.status(404).json({ message: "Post not found" });

      if (post.user.toString() !== req.user.id) {
        return res.status(403).json({ message: "Not authorized" });
      }

      const { title, description, price, category, phone } = req.body;

      post.title = title;
      post.description = description;
      post.price = price;
      post.category = category;
      post.phone = phone;

      if (req.files?.images) post.images.push(...req.files.images.map(f => f.filename));
      if (req.files?.videos) post.videos.push(...req.files.videos.map(f => f.filename));

      await post.save();
      res.json({ success: true, post });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to update post" });
    }
  }
);

// ------------------ DELETE POST (Owner or Admin) ------------------
router.delete("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    // Owner or Admin check
    if (post.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    await post.deleteOne();
    res.json({ success: true, message: "Post deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete post" });
  }
});

// ------------------ FAVORITE / UNFAVORITE POST ------------------
router.post("/favorite/:id", auth, async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const user = await User.findById(req.user.id);
    if (!user.favorites) user.favorites = [];

    const already = user.favorites.some(p => p.toString() === postId.toString());

    if (already) {
      user.favorites = user.favorites.filter(p => p.toString() !== postId.toString());
      await user.save();
      return res.json({ success: true, message: "Removed from favorites" });
    }

    user.favorites.push(postId);
    await user.save();
    res.json({ success: true, message: "Added to favorites" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update favorites" });
  }
});

// ------------------ GET Favorite Posts ------------------
router.get("/favorites/:id", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("favorites");
    res.json({ success: true, favorites: user.favorites });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load favorites" });
  }
});

export default router;
