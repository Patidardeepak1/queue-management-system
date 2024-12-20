import express from "express";
import {
  registerBusiness,
  loginBusiness,
  getBusinessDetails,
  updateBusinessInfo,
  getBusinessBookings,
} from "../controller/businessController.js";

import authenticateBusinessToken from "../middleware/validateMiddleware.js";
import { uploadImages, upload } from "../controller/imageController.js";

const router = express.Router();

// Business sign-up route
router.post("/signup", registerBusiness);

// Business login route
router.post("/login", loginBusiness);

// Route to fetch business details
router.get("/business", authenticateBusinessToken, getBusinessDetails);

// Route to update business details
router.put("/update", authenticateBusinessToken, updateBusinessInfo);

// Route to fetch business bookings
router.get(
  "/business-bookings",
  authenticateBusinessToken,
  getBusinessBookings
);
//upload images
router.post("/upload-images", authenticateBusinessToken, upload, uploadImages);

export default router;
