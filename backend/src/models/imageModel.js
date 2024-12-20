import mongoose from "mongoose";

// Define the BusinessImage schema
const businessImageSchema = new mongoose.Schema(
  {
    businessId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Business", // Reference to the Business model
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Create the model
const BusinessImage = mongoose.model("BusinessImage", businessImageSchema);

export default BusinessImage;
