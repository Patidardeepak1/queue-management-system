import mongoose from "mongoose";

const slotSchema = new mongoose.Schema({
  businessId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Business",
    required: true,
  },
  day: {
    type: String,
    required: true,
  },
  slot: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  bookingCode: {
    type: String,
    required: true,
    unique: true, // Ensure the booking code is unique
  },
  bookedAt: {
    type: Date,
    default: Date.now, // Timestamp of when the booking was made
  },
  reservationDate: {
    type: Date, // This stores the specific date for the reservation
    required: true,
  },
});

export default mongoose.model("Slot", slotSchema);
