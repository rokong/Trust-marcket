import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.dfynopg2e,
  api_key: process.env.793559664986765,
  api_secret: process.env.MHGjDS1N8V7nhM0DU65eWacroO8,
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
