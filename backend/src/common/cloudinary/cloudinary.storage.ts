import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";

export const CloudinaryUpload = new CloudinaryStorage({
  cloudinary,
});
