import express from "express";
import {
  signupUser,
  loginUser,
  getUserDetails,
  updatePassword,
  updateUserInfo,
  getUserSlots,
} from "../controller/userController.js";
import {
  validateSignup,
  authenticateUser,
} from "../middleware/validateMiddleware.js";

const router = express.Router();

// Signup Route
router.post("/signup", validateSignup, signupUser);

//login Route
router.post("/login", loginUser);

//get user
router.get("/user", authenticateUser, getUserDetails);

// Route to update user information
router.put("/update", authenticateUser, updateUserInfo);

// Route to update user password
router.put("/update-password", authenticateUser, updatePassword);

//fectching slots of particular user
router.get("/user-slots", authenticateUser, getUserSlots);

export default router;
