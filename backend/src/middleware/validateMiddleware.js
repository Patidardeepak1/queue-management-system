// Import required modules
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

// Load environment variables from the .env file
dotenv.config();

// Middleware to validate signup data
export const validateSignup = (req, res, next) => {
  const { name, email, password } = req.body;

  // Check if all required fields are provided
  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Check if the password meets the minimum length requirement
  if (password.length < 6) {
    return res
      .status(400)
      .json({ message: "Password must be at least 6 characters long" });
  }

  // Proceed to the next middleware or route handler if validation passes
  next();
};

// Middleware to authenticate a user using a JWT token
export const authenticateUser = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", ""); // Extract the token from the Authorization header
  //console.log("Token received:", token); // Debug: Log the received token

  if (!token) {
    // If no token is provided, return a 401 (Unauthorized) response
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    // Verify the token using the secret key from the environment variables
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log("Decoded payload:", decoded); // Debug: Log the decoded token payload

    // Attach the decoded userId to the request object for downstream handlers
    req.userId = decoded.userId;
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    // console.error("JWT Verification Error:", error.message); // Debug: Log the verification error
    // Return a 401 (Unauthorized) response if the token is invalid or expired
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
// Middleware to authenticate businesses
const authenticateBusinessToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1]; // Extract token

  if (!token) {
    return res.status(401).json({ message: "Token is required" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }

    // Ensure the user has a "business" role
    if (decoded.role !== "business") {
      return res.status(403).json({ message: "Access denied: not a business" });
    }

    req.user = decoded; // Attach user info (e.g., `businessId`) to the request
    next();
  });
};

export default authenticateBusinessToken;
