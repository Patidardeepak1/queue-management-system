import Business from "../models/businessModel.js";
import Slot from "../models/slotModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Register a business
const registerBusiness = async (req, res) => {
  try {
    const { name, email, password, businessType, location, statusDateWise } =
      req.body;

    // Check if the business already exists
    const existingBusiness = await Business.findOne({ email });
    if (existingBusiness) {
      return res.status(400).json({ message: "Business already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newBusiness = new Business({
      name,
      email,
      password: hashedPassword,
      businessType,
      location,
      statusDateWise,
      role: "business", // Ensure role is set to 'business' by default
    });

    // Save business
    await newBusiness.save();

    // Generate JWT with role included in the payload
    const token = jwt.sign(
      { _id: newBusiness._id, role: newBusiness.role }, // Include role in the token payload
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(201).json({ token, business: newBusiness });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

// Login Business
const loginBusiness = async (req, res) => {
  try {
    const { email, password } = req.body;

    const business = await Business.findOne({ email });
    if (!business) {
      return res.status(400).json({ message: "Business not found" });
    }

    // Compare the entered password with the stored password
    const isMatch = await bcrypt.compare(password, business.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT with role included in the payload
    const token = jwt.sign(
      { _id: business._id, role: business.role }, // Include role in the token payload
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      token,
      role: business.role, // Explicitly send role
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

// Controller to fetch business details
export const getBusinessDetails = async (req, res) => {
  try {
    const businessId = req.user._id; // Extract business ID from token

    // Fetch business details from the database
    const business = await Business.findById(businessId);

    if (!business) {
      return res.status(404).json({ message: "Business not found" });
    }

    res.status(200).json(business);
  } catch (error) {
    console.error("Error fetching business details:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Controller to update business information
export const updateBusinessInfo = async (req, res) => {
  try {
    const businessId = req.user._id; // Extract business ID from token
    const {
      name,
      businessType,
      location,
      statusDateWise,
      slotDuration,
      slotPayment,
    } = req.body;

    // Validate required fields
    if (!name || !location) {
      return res
        .status(400)
        .json({ message: "Business name and location are required." });
    }

    // Find the business associated with the logged-in user
    const business = await Business.findById(businessId);

    if (!business) {
      return res.status(404).json({ message: "Business not found" });
    }

    // Update business details
    business.name = name;
    business.businessType = businessType || business.businessType; // Optional
    business.location = location;
    business.statusDateWise = statusDateWise || business.statusDateWise; // Optional
    business.slotDuration = slotDuration || business.slotDuration; // Optional
    business.slotPayment = slotPayment || business.slotPayment;
    // Save updated business info to the database
    const updatedBusiness = await business.save();

    res.status(200).json({
      message: "Business information updated successfully.",
      updatedBusiness,
    });
  } catch (error) {
    console.error("Error updating business details:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Controller to fetch bookings for a specific business
export const getBusinessBookings = async (req, res) => {
  try {
    // Get businessId from the logged-in user's business or from query params
    // From the protect middleware, assuming the user object is attached
    const businessId = req.user._id; // Assuming the user's business ID is stored

    // Fetch the bookings from the Slot model for the specific business
    const bookings = await Slot.find({ businessId })
      .populate("userId", "name") // Populate user info (name) from the User model
      .select("reservationDate slot bookingCode userId") // Select necessary fields
      .sort({ reservationDate: 1 }); // Sort by reservation date (ascending)

    if (!bookings || bookings.length === 0) {
      return res
        .status(404)
        .json({ message: "No bookings found for this business." });
    }

    // Send the bookings as the response
    res.status(200).json(bookings);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Server error. Could not fetch bookings." });
  }
};

export { registerBusiness, loginBusiness };
