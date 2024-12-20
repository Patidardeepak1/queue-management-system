import express from "express";
import {
  createPaymentOrder,
  verifyPayment,
} from "../controller/paymentController.js";

const router = express.Router();

// Route to create payment order
router.post("/:id/slots/:day/create-order", createPaymentOrder);

// Route to verify payment after the user completes the transaction
router.post("/verify-payment", verifyPayment);

export default router;
