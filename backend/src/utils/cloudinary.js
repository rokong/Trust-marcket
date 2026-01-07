//backend/src/utils/cloudinary.js
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const ext = file.originalname.split(".").pop();
    return {
      folder: "trust-marcket",
      public_id: Date.now() + "-" + file.originalname,
      resource_type: file.mimetype.startsWith("video") ? "video" : "image",
      format: ext, // force original extension
    };
  },
});

export const parser = multer({ storage });
export default cloudinary;
