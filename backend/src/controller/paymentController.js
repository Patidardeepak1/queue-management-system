import Razorpay from "razorpay";
import Business from "../models/businessModel.js"; // Business model for slotPayment info
import Payment from "../models/paymentModel.js"; // Payment model
import crypto from "crypto"; // For signature verification

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: "rzp_test_H7yV1g1Y1sRwPp", // Replace with your Razorpay Key ID
  key_secret: "rf9lBg8g3qRG8OYmn8DkQOSj", // Replace with your Razorpay Secret Key
});
export const createPaymentOrder = async (req, res) => {
  const { id } = req.params; // Business ID
  const { day, time } = req.body; // Day and time from the request body
  const userId = req.userId;
  try {
    // Step 1: Fetch business details to get slot payment info
    const business = await Business.findById(id);
    if (!business) {
      return res.status(404).json({ message: "Business not found" });
    }

    // Step 2: Find the slot for the given time
    const slot = business.slots.find((slot) => slot.time === time);
    if (!slot) {
      return res
        .status(400)
        .json({ message: "Slot not found for the selected time." });
    }

    const slotPayment = business.slotPayment; // Slot payment amount

    // Step 3: Check if payment is required
    if (slotPayment <= 0) {
      return res
        .status(200)
        .json({ message: "No payment required for this slot" });
    }

    // Step 4: Prepare Razorpay order options
    const orderOptions = {
      amount: slotPayment * 100, // Amount in paise (Razorpay requires paise)
      currency: "INR",
      receipt: `order_rcptid_${new Date().getTime()}`, // Unique receipt ID
    };

    // Step 5: Create Razorpay order
    const order = await razorpay.orders.create(orderOptions);
    if (!order) {
      return res.status(500).json({ message: "Error creating Razorpay order" });
    }

    // Step 6: Save initial payment record in the database
    const paymentRecord = new Payment({
      userId,
      businessId: id,
      slotTime: slot.time,
      bookingDate: slot.date, // Use the slot date from the business model
      amount: slotPayment,
      razorpayOrderId: order.id,
      status: "Pending",
    });

    await paymentRecord.save();

    // Send order details back to the client
    res.status(200).json({
      message: "Payment created successfully. Please complete the payment.",
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      bookingDate: slot.date, // Return the slot date as booking date
      razorpayKey: "rzp_test_H7yV1g1Y1sRwPp",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error. Please try again." });
  }
};

// // Controller to verify payment (after the user completes the payment)
// export const verifyPayment = async (req, res) => {
//   try {
//     //const { paymentDetails, orderId } = req.body; // Payment details and Razorpay order ID
//     const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
//       req.body;

//     // Retrieve the payment record
//     const paymentRecord = await Payment.findOne({
//       razorpayOrderId: razorpay_order_id,
//     });

//     if (!paymentRecord) {
//       return res.status(404).json({ message: "Payment record not found" });
//     }

//     // Verify payment signature using Razorpay
//     const generatedSignature = crypto
//       .createHmac("sha256", razorpay.key_secret)
//       .update(`${razorpay_order_id}|${razorpay_payment_id}`)
//       .digest("hex");

//     if (generatedSignature !== razorpay_signature) {
//       paymentRecord.status = "Failed";
//       await paymentRecord.save();
//       return res.status(400).json({ message: "Payment verification failed" });
//     }

//     // Update payment record upon successful verification
//     paymentRecord.razorpayPaymentId = razorpay_payment_id;
//     paymentRecord.razorpaySignature = razorpay_signature;
//     paymentRecord.status = "Success";
//     await paymentRecord.save();

//     res.status(200).json({
//       message: "Payment successful! Slot booked.",
//       bookingDate: paymentRecord.bookingDate,
//       slotTime: paymentRecord.slotTime,
//     });
//   } catch (error) {
//     console.error(error);
//     res
//       .status(500)
//       .json({ message: "Payment verification failed. Please try again." });
//   }
// };

import Slot from "../models/slotModel.js"; // Slot model

const generateBookingCode = () => {
  return Math.floor(100000 + Math.random() * 900000); // Generates a 6-digit booking code
};

export const verifyPayment = async (req, res) => {
  const {
    razorpay_payment_id,
    razorpay_order_id,
    razorpay_signature,
    time,
    day,
  } = req.body;
  const { id } = req.params;

  try {
    // Step 1: Verify the Razorpay payment signature
    const generatedSignature = crypto
      .createHmac("sha256", razorpay.key_secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Payment verification failed" });
    }

    // Step 2: Find the business by ID
    const business = await Business.findById(id);
    if (!business) {
      return res.status(404).json({ message: "Business not found" });
    }

    // Step 3: Find the slot for the given day and time
    const slot = business.slots.find(
      (slot) => slot.day === day && slot.time === time
    );
    if (!slot) {
      return res
        .status(400)
        .json({ message: "Slot not found for the selected day and time" });
    }

    // Step 4: Check if the slot is already booked
    if (slot.status) {
      return res.status(400).json({ message: "Slot is already booked" });
    }

    // Step 5: Mark the slot as booked
    slot.status = true;
    await business.save();

    // Step 6: Generate a booking code and save the booking
    const bookingCode = generateBookingCode(); // Generate a booking code

    const newBooking = new Slot({
      businessId: id,
      day,
      slot: time,
      userId: req.userId, // User ID from JWT auth
      bookingCode,
      reservationDate: slot.date,
    });

    await newBooking.save();

    // Step 7: Respond with booking confirmation
    res.status(200).json({
      message: "Slot booked successfully!",
      bookingCode: newBooking.bookingCode, // Return the booking code
    });
  } catch (error) {
    console.error("Error verifying payment and booking slot:", error);
    res
      .status(500)
      .json({ message: "Error verifying payment and booking slot" });
  }
};
