// backend/src/routes/posts.js
import express from "express";
import mongoose from "mongoose";
import auth from "../middleware/authMiddleware.js";
import Post from "../models/Post.js";
import User from "../models/User.js";
import { parser } from "../utils/cloudinary.js";

const router = express.Router();

// ------------------ GET All Posts (with filter) ------------------
router.get("/", async (req, res) => {
  try {
    const { category, search, limit = 20 } = req.query;

    let query = {};

    // category filter
    if (category && category !== "all") {
      query.category = category;
    }

    // search by title
    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    const posts = await Post.find(query)
      .sort({ createdAt: -1 })
      .limit(Number(limit));

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
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid post id" });
    }

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load post" });
  }
});

// ------------------ CREATE POST (Cloudinary) ------------------
router.post(
  "/create",
  auth,
  parser.fields([
    { name: "images", maxCount: 20 },
    { name: "videos", maxCount: 5 },
  ]),
  async (req, res) => {
    try {
      const { title, description, price, category, phone } = req.body;

      const images = req.files?.images?.map((f) => f.path) || [];
      const videos = req.files?.videos?.map((f) => f.path) || [];

      const newPost = await Post.create({
        title,
        description,
        price,
        category,
        phone,
        images, // Cloudinary URLs
        videos, // Cloudinary URLs
        user: req.user.id,
      });

      res.json({ success: true, post: newPost });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to create post" });
    }
  }
);

// ------------------ UPDATE POST (Owner only, Cloudinary) ------------------
router.put(
  "/:id",
  auth,
  parser.fields([
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

      post.title = title ?? post.title;
      post.description = description ?? post.description;
      post.price = price ?? post.price;
      post.category = category ?? post.category;
      post.phone = phone ?? post.phone;

      if (req.files?.images) {
        post.images.push(...req.files.images.map((f) => f.path));
      }

      if (req.files?.videos) {
        post.videos.push(...req.files.videos.map((f) => f.path));
      }

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

// ------------------ FAVORITE / UNFAVORITE ------------------
router.post("/favorite/:id", auth, async (req, res) => {
  try {
    const postId = req.params.id;

    const user = await User.findById(req.user.id);
    if (!user.favorites) user.favorites = [];

    const exists = user.favorites.some(
      (p) => p.toString() === postId.toString()
    );

    if (exists) {
      user.favorites = user.favorites.filter(
        (p) => p.toString() !== postId.toString()
      );
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
