import express from "express";
import {
  bookSlot,
  getBusinessById,
  getBusinessesByType,
  getSlots,
} from "../controller/bookingController.js";
import { authenticateUser } from "../middleware/validateMiddleware.js";
import {
  createPaymentOrder,
  verifyPayment,
} from "../controller/paymentController.js";

const router = express.Router();

router.get("/type/:businessType", getBusinessesByType);

// Route to get a single business by ID
router.get("/:id", getBusinessById);

// GET: Fetch available slots for a specific day
router.get("/:id/slots/:day", getSlots);

// POST: Book a slot
router.post("/:id/slots/book", authenticateUser, bookSlot);

// Route to create payment order
router.post(
  "/:id/slots/:day/create-order",
  authenticateUser,
  createPaymentOrder
);

// Route to verify payment after the user completes the transaction
router.post("/:id/slots/:day/verify-payment", authenticateUser, verifyPayment);

export default router;
