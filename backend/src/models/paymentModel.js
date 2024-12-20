import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User model
      required: true,
    },
    businessId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Business", // Reference to the Business model
      required: true,
    },
    slotTime: {
      type: String, // Slot time (e.g., "9:00 AM")
      required: true,
    },
    bookingDate: {
      type: Date, // Specific date of booking
      required: true,
    },
    amount: {
      type: Number, // Payment amount
      required: true,
    },
    currency: {
      type: String, // Payment currency (e.g., "INR")
      default: "INR",
    },
    razorpayOrderId: {
      type: String, // Razorpay Order ID
      required: true,
    },
    razorpayPaymentId: {
      type: String, // Razorpay Payment ID
    },
    razorpaySignature: {
      type: String, // Razorpay Signature
    },
    status: {
      type: String, // Payment status (e.g., "Pending", "Success", "Failed")
      enum: ["Pending", "Success", "Failed"],
      default: "Pending",
    },
    createdAt: {
      type: Date, // Timestamp of the payment
      default: Date.now,
    },
  },
  { timestamps: true } // Automatically add createdAt and updatedAt fields
);

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;
