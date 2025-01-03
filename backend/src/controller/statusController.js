import User from "../models/userModel.js"; // Adjust the path as needed
import Business from "../models/businessModel.js"; // Adjust the path as needed

// Controller to fetch statistics
export const getStats = async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const businessCount = await Business.countDocuments();

    res.json({ userCount, businessCount });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch statistics", error });
  }
};
