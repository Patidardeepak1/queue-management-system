import User from "../models/userModel.js";
import Slot from "../models/slotModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
// Signup Controller
export const signupUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res
      .status(201)
      .json({ message: "User created successfully", user: newUser });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//login controoler

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Ensure email and password are provided
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "10h",
    });

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

//get user

// Get User Details
export const getUserDetails = async (req, res) => {
  try {
    const user = await User.findById(req.userId); // `req.userId` will be set by the authentication middleware
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update user information
export const updateUserInfo = async (req, res) => {
  // console.log("Update user info request received"); // Debug log
  //console.log("UserId:", req.userId); // Check extracted userId
  //console.log("Request body:", req.body);
  const { name, email } = req.body;
  const userId = req.userId; // Extracted from token in the middleware

  if (!name || !email) {
    return res.status(400).json({ message: "Name and email are required" });
  }

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update the user information
    user.name = name;
    user.email = email;
    await user.save();

    res.status(200).json({ message: "User information updated successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while updating user information" });
  }
};

// Update user password
export const updatePassword = async (req, res) => {
  const { password } = req.body;
  const userId = req.userId; // Extracted from token in the middleware

  if (!password) {
    return res.status(400).json({ message: "Password is required" });
  }

  if (password.length < 6) {
    return res
      .status(400)
      .json({ message: "Password must be at least 6 characters long" });
  }

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while updating the password" });
  }
};

export const getUserSlots = async (req, res) => {
  try {
    const userId = req.userId; // Use the userId from the authenticateUser middleware

    const slots = await Slot.find({ userId })
      .populate("businessId", "name") // Populate business name
      .sort({ reservationDate: 1 }); // Sort by booking time (most recent first)

    if (!slots || slots.length === 0) {
      return res.status(404).json({ message: "No slots found for this user." });
    }

    res.json(slots);
  } catch (error) {
    console.error("Error fetching user slots:", error.message);
    res.status(500).json({ message: "Server error while fetching slots." });
  }
};
