// backend/src/routes/bkashRoutes.js
import express from "express";
import Payment from "../models/Payment.js";

const router = express.Router();

// User manual verification
router.post("/api/payment/verify", async (req, res) => {
  try {
    let { trxID, price } = req.body;

    if (!trxID || !price) {
      return res.status(400).json({ success: false, message: "trxID & price required" });
    }

    price = Number(price);
    if (isNaN(price)) {
      return res.status(400).json({ success: false, message: "Invalid price" });
    }

    const payment = await Payment.findOne({ trxID, price, status: "pending" });
    if (!payment) {
      return res.json({ success: false, message: "❌ Invalid trxID or amount" });
    }

    payment.status = "verified";
    await payment.save();

    res.json({ success: true, message: "✅ Payment Successful!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
