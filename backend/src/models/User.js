// backend/src/models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "admin", "guest"], default: "user" },

  // 🔥 KYC FIELD
  kyc: {
    front: String,
    back: String,
    selfie: String,
    status: { type: String, enum: ["pending", "verified", "rejected"], default: null },
    reason: String,
    verifiedAt: Date,
  }
}, { timestamps: true });

export default mongoose.models.User || mongoose.model("User", userSchema);
