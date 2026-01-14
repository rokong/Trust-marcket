// backend/index.js
import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import http from "http";
import { Server as IOServer } from "socket.io";
import passport from "passport";
import { initPassport } from "./src/config/passport.js";

import postsRoutes from "./src/routes/posts.js";
import authRoutes from "./src/routes/auth.js";
import messageRoutes from "./src/routes/messageRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";
import adminMessageRoutes from "./src/routes/adminMessageRoutes.js";
import adminRoutes from "./src/routes/admin.js";
import adminUserRoutes from "./src/routes/adminUserRoutes.js";
import bkashRoutes from "./src/routes/bkashRoutes.js";
import adminPaymentRoutes from "./src/routes/adminPaymentRoutes.js";
import uploadRoutes from "./src/routes/uploadRoutes.js";
import kycRoutes from "./src/routes/kyc.js";
import Message from "./src/models/Message.js";
import adminKycRoutes from "./src/routes/adminKyc.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ---------- MIDDLEWARE ----------
app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());

initPassport();                // Google strategy register
app.use(passport.initialize()); 

// ---------- HTTP + SOCKET ----------
const server = http.createServer(app);
const io = new IOServer(server, { cors: { origin: "*" } });

io.on("connection", (socket) => {
  socket.on("join", (userId) => socket.join(userId));

  socket.on("send_message", async (data) => {
    try {
      if (data.type === "image" || data.type === "video") return;

      const msg = await Message.create({
        userId: data.userId,
        sender: data.sender,
        type: data.type,
        
        postId: data.postId ?? null,
        postTitle: data.postTitle ?? null,
        postDescription: data.postDescription ?? null,
        postPrice: data.postPrice ?? null,
      });

      io.to(data.userId.toString()).emit("receive_message", msg);
    } catch (err) {
      console.error(err);
    }
  });
});

// ---------- ROUTES ----------
app.use("/api/upload", uploadRoutes(io));
app.use("/api/posts", postsRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminMessageRoutes);
app.use("/admin", adminRoutes);
app.use("/api", adminUserRoutes);
app.use("/api", adminPaymentRoutes);
app.use("/api", bkashRoutes);
app.use("/api/kyc", kycRoutes);
app.use("/api/admin", adminKycRoutes);

app.get("/api/health", (_, res) => res.json({ ok: true }));

// ---------- START (ONCE) ----------
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    server.listen(PORT, () => {
      console.log("Server running on", PORT);
    });
  })
  .catch(console.error);
