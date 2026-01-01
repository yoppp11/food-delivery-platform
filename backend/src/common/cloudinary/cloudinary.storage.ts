import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinary.provider";

export const CloudinaryStorageService = new CloudinaryStorage({
  cloudinary,
});
