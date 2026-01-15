//backend/src/models/Post.js
import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    category: {
      type: String,
      default: "others",
    },

    phone: {
      type: String,
      required: true,
    },

    // 🟦 UNLIMITED IMAGES
    images: {
      type: [String], // array of filenames
      default: [],
    },

    // 🟥 MAX 5 VIDEOS
    videos: {
      type: [String],
      default: [],
      validate: {
        validator: function (value) {
          return value.length <= 5;
        },
        message: "You can upload maximum 5 videos!",
      },
    },

    // ⭐ Favorite System (Users who liked)
    favorites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    // 🟩 Message / Chat option
    allowMessages: {
      type: Boolean,
      default: true,
    },

    status: {
      type: String,
      default: "public", // auto public
    },
  },
  { timestamps: true }
);

export default mongoose.model("Post", postSchema);
