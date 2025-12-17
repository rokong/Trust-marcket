// backend/index.js
import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import http from "http";


import postsRoutes from "./src/routes/posts.js";
import authRoutes from "./src/routes/auth.js";
import messageRoutes from "./src/routes/messageRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";
import adminMessageRoutes from "./src/routes/adminMessageRoutes.js";
import adminRoutes from "./src/routes/admin.js";
import adminUserRoutes from "./src/routes/adminUserRoutes.js";
import bkashRoutes from "./src/routes/bkashRoutes.js";
import adminPaymentRoutes from "./src/routes/adminPaymentRoutes.js";

import Message from "./src/models/Message.js"; // আপনার মেসেজ মডেল

dotenv.config();
const app = express();

// -------------------- MIDDLEWARE --------------------
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// -------------------- ROUTES --------------------
app.use("/api/posts", postsRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminMessageRoutes);
app.use("/admin", adminRoutes);
app.use("/api", adminUserRoutes);
app.use("/api", bkashRoutes);
app.use("/api", adminPaymentRoutes);

// -------------------- CREATE HTTP SERVER --------------------
const PORT = process.env.PORT || 5000;
const server = http.createServer(app);


// -------------------- MONGO + START SERVER --------------------
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    server.listen(PORT, () => console.log(`Server running on ${PORT}`));
    console.log("MongoDB connected");
  })
  .catch((err) => console.log(err));
