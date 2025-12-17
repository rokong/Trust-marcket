//backend/src/models/Message.js 
import mongoose from "mongoose"; 
const messageSchema = new mongoose.Schema({ 
  sender: { type: String, enum: ["user", "admin"], required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: '24h' },
  readByAdmin: { type: Boolean, default: false }, // unread flag 
  postId: { type: String, default: null },  // ADD
  // 👇 ADD THIS
  type: {
    type: String,
    enum: ["text", "shared_post"],
    default: "text",
  },
  postTitle: {
    type: String,
    default: null,
  },
  postDescription: {
    type: String,
    default: null,
  },
  postPrice: {
    type: Number,
    default: null,
  },
});


export default mongoose.model("Message", messageSchema);

