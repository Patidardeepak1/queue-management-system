import multer from "multer";
import path from "path";
import BusinessImage from "../models/imageModel.js";

// Configure multer for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Directory where files will be stored
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Unique filename
  },
});

// Set up multer for multiple images
export const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Invalid file type"), false); // Only allow images
    }
    cb(null, true);
  },
}).array("images", 10); // Accept up to 10 images with the "images" field name

// Upload Images Controller
export const uploadImages = async (req, res) => {
  try {
    // Extract the business ID from the authenticated user's token
    const businessId = req.user._id;

    // Log the incoming files and business ID
    // console.log("Business ID:", businessId);
    //console.log("Uploaded files:", req.files);

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const imageUrls = [];

    for (const file of req.files) {
      const image = new BusinessImage({
        businessId, // Use the authenticated business ID
        imageUrl: `/uploads/${file.filename}`,
      });

      await image.save();
      imageUrls.push(image.imageUrl);
    }

    res.status(200).json({
      message: "Images uploaded successfully",
      imageUrls,
    });
  } catch (error) {
    //  console.error("Image upload error:", error);
    res.status(500).json({ message: "Error uploading images" });
  }
};
