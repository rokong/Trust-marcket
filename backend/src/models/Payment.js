// backend/src/models/Payment.js
import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    trxID: { type: String, required: true, unique: true },
    price: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "verified"],
      default: "pending",
    },
  },
  { timestamps: true }
);

// TTL: Pending = 48h, Verified = 24h
paymentSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: 48 * 60 * 60, partialFilterExpression: { status: "pending" } }
);

paymentSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: 24 * 60 * 60, partialFilterExpression: { status: "verified" } }
);

export default mongoose.model("Payment", paymentSchema);
