import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'lovecastle',  // Specify folder
    allowed_formats: ['jpg', 'png', 'jpeg'], // Allowed file types
  },
});

const upload = multer({ storage });

export default upload;
