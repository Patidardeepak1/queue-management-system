import Business from "../models/businessModel.js";
import Slot from "../models/slotModel.js";
import User from "../models/userModel.js";
import path from "path";
// Controller to fetch businesses by type
import BusinessImage from "../models/imageModel.js";
const getBusinessesByType = async (req, res) => {
  const { businessType } = req.params; // Get the business type from the URL parameter
  const businessTypeLower = businessType.toLowerCase(); // Convert to lowercase for consistency

  const validBusinessTypes = [
    "bank",
    "clinic",
    "theater",
    "restaurant",
    "hospital",
  ];

  try {
    let businesses;

    // Fetch businesses based on type or exclude predefined types for 'other'
    if (validBusinessTypes.includes(businessTypeLower)) {
      businesses = await Business.find({ businessType: businessTypeLower });
    } else if (businessTypeLower === "other") {
      businesses = await Business.find({
        businessType: { $nin: validBusinessTypes },
      });
    } else {
      businesses = [];
    }

    if (!businesses || businesses.length === 0) {
      return res
        .status(404)
        .json({ message: `No businesses found for type: ${businessType}` });
    }

    // Fetch and attach images for each business
    const businessesWithImages = await Promise.all(
      businesses.map(async (business) => {
        const image = await BusinessImage.findOne({ businessId: business._id }); // Find the image by businessId

        // Extract only the filename from the stored image path
        const filename = image
          ? path.basename(image.imageUrl)
          : "default-image.jpg";

        return {
          ...business.toObject(),
          imageUrl: filename, // Attach the filename only
        };
      })
    );

    res.json(businessesWithImages); // Return the combined data
  } catch (error) {
    console.error("Error fetching businesses:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// // Controller to fetch a single business by ID
// export const getBusinessById = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const business = await Business.findById(id); // Fetch the business by ID
//     if (!business) {
//       return res.status(404).json({ message: "Business not found" });
//     }
//     res.json(business); // Send the business details
//   } catch (error) {
//     console.error("Error fetching business by ID:", error);
//     res.status(500).json({ message: "Server Error" });
//   }
// };

export const getBusinessById = async (req, res) => {
  try {
    const { id } = req.params; // Get business ID from URL params

    // Fetch the business by ID
    const business = await Business.findById(id);
    if (!business) {
      return res.status(404).json({ message: "Business not found" });
    }

    // Fetch all images associated with the business
    const images = await BusinessImage.find({ businessId: business._id });

    // Extract the filenames from the stored image paths
    const imageUrls = images.map((image) => path.basename(image.imageUrl));

    // Attach the imageUrls to the business data
    const businessWithImages = {
      ...business.toObject(),
      imageUrls, // Add the array of image URLs to the response
    };

    // Send the combined business and images data as the response
    res.json(businessWithImages);
  } catch (error) {
    console.error("Error fetching business by ID:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getSlots = async (req, res) => {
  const { id, day } = req.params;

  // Validate day parameter (ensure it's a valid weekday)
  const validDays = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];

  if (!validDays.includes(day.toLowerCase())) {
    return res
      .status(400)
      .json({ message: "Invalid day provided. Please select a valid day." });
  }

  try {
    const businessData = await Business.findById(id); // Corrected the model name to Business

    if (!businessData) {
      return res.status(404).json({ message: "Business not found" });
    }

    // Check if the business is open on the requested day
    const dayStatus = businessData.statusDateWise[day.toLowerCase()];

    if (!dayStatus || !dayStatus.open) {
      return res
        .status(404)
        .json({ message: `The business is closed on ${day}.` });
    }

    // Get the available slots for the specific day (filter by status: false)
    const availableSlots = businessData.slots.filter(
      (slot) => slot.day === day.toLowerCase() && slot.status === false
    );

    // If no slots are available, return an appropriate message
    if (availableSlots.length === 0) {
      return res
        .status(404)
        .json({ message: `No available slots for ${day}.` });
    }

    // If slots are available, return them
    res.json(availableSlots);
  } catch (error) {
    console.error("Error fetching slots:", error);
    res
      .status(500)
      .json({ message: "Server Error: Unable to fetch slots at this time." });
  }
};

const generateBookingCode = () => {
  return Math.floor(100000 + Math.random() * 900000); // Generates a 6-digit booking code
};
export const bookSlot = async (req, res) => {
  const { id } = req.params; // Business ID
  const { day, time } = req.body; // Day and time from the request body
  const userId = req.userId; // Extracted from middleware (e.g., JWT auth)

  try {
    // Step 1: Find the business by ID
    const business = await Business.findById(id);
    if (!business) {
      return res.status(404).json({ message: "Business not found." });
    }

    // Step 2: Find the slot for the given day and time
    const slot = business.slots.find(
      (slot) => slot.day === day && slot.time === time
    );

    if (!slot) {
      return res
        .status(400)
        .json({ message: "Slot not found for the selected day and time." });
    }

    // Step 3: Check if the slot is already booked
    if (slot.status) {
      return res.status(400).json({ message: "Slot is already booked." });
    }

    // Step 4: Mark the slot as booked in the Business model
    slot.status = true;
    await business.save();

    // Step 5: Save the booking to the Slot model
    const bookingCode = generateBookingCode(); // Your logic to generate a booking code

    const newBooking = new Slot({
      businessId: id,
      day,
      slot: time, // Pass the specific time as the slot
      userId,
      bookingCode,
      reservationDate: slot.date, // Use the date from the business model's slot
    });

    await newBooking.save();

    res.status(200).json({
      message: "Slot booked successfully!",
      bookingCode: newBooking.bookingCode, // Return the booking code
    });
  } catch (error) {
    console.error("Error booking slot:", error);
    res.status(500).json({ message: "Server error while booking slot." });
  }
};

export { getBusinessesByType };
