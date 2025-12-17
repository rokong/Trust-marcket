import express from "express";
import {
  sendResetCode,
  verifyResetCode,
  resetPassword,
} from "../controllers/passwordController.js";

const router = express.Router();

// 🔹 POST /api/auth/forgot-password → Send reset code
router.post("/forgot-password", sendResetCode);

// 🔹 POST /api/auth/verify-code → Verify code
router.post("/verify-code", verifyResetCode);

// 🔹 POST /api/auth/reset-password → Reset password
router.post("/reset-password", resetPassword);

export default router;
