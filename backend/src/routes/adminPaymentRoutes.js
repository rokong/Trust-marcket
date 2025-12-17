// backend/src/routes/adminPaymentRoutes.js
import express from "express";
import Payment from "../models/Payment.js";

const router = express.Router();

// Add new payment (Admin)
router.post("/api/admin/payment/add", async (req, res) => {
  try {
    const { trxID, price } = req.body;

    if (!trxID || !price ) {
      return res.status(400).json({ message: "trxID & price required" });
    }

    const payment = await Payment.create({ trxID, price: Number(price), paymentType });
    res.json({ message: "✅ Payment added as pending", payment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Already exists or server error" });
  }
});

// Get all payments (Admin)
router.get("/api/admin/payment/list", async (req, res) => {
  try {
    const payments = await Payment.find().sort({ createdAt: -1 });
    res.json(payments);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
