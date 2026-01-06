import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "trust-marcket", // Cloudinary folder
    format: async (req, file) => file.mimetype.split("/")[1], // jpg, png, mp4 etc
    public_id: (req, file) => Date.now() + "-" + file.originalname,
  },
});

export const parser = multer({ storage });
export default cloudinary;
