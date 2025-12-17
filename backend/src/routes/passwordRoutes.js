import express from "express";
import { sendResetCode, verifyResetCode, resetPassword } from "../controllers/passwordController.js";

const router = express.Router();

router.post("/forgot-password", sendResetCode);
router.post("/verify-code", verifyResetCode);
router.post("/reset-password", resetPassword);

export default router;
