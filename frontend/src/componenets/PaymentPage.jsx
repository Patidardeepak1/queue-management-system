import React, { useState } from 'react';
import axios from 'axios';

const PaymentPage = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [amount, setAmount] = useState(5); // Example amount in INR (100 INR = 10000 paise)

  const initiatePayment = async () => {
    setIsProcessing(true);
    setError("");

    try {
      // Step 1: Create Razorpay order
      const response = await axios.post("http://localhost:5000/api/payment/create-order", {
        amount,
      });

      const { id, currency, amount: orderAmount } = response.data;

      // Step 2: Initiate Razorpay payment
      const options = {
        key: "your-razorpay-key-id", // Replace with your Razorpay Key ID
        amount: orderAmount,
        currency: currency,
        name: "Payment for Slot Booking", // You can replace this with your application name
        description: "Payment for booking a slot",
        order_id: id,
        handler: function (response) {
          // This function is triggered when the payment is successful
          console.log(response);
          setSuccessMessage("Payment Successful!");
        },
        prefill: {
          name: "Customer Name", // Optional: Pre-fill customer name
          email: "customer@example.com", // Optional: Pre-fill customer email
        },
        theme: {
          color: "#528ff0",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open(); // Open Razorpay checkout window

      // Handle Razorpay checkout failure
      rzp.on("payment.failed", function (response) {
        setError("Payment Failed. Please try again.");
      });
    } catch (err) {
      console.error("Error initiating payment:", err);
      setError("Error occurred while initiating payment.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
  <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg max-w-lg w-full">
    <h1 className="text-2xl font-bold mb-4 text-center">Make Payment</h1>
    <p className="text-gray-300 text-center mb-6">
      Total amount to be paid: <span className="text-green-400 font-semibold">₹{amount}</span>
    </p>

    {isProcessing && <p className="text-yellow-400 text-center mb-4">Processing payment...</p>}
    {error && <p className="text-red-500 text-center mb-4">{error}</p>}
    {successMessage && <p className="text-green-400 text-center mb-4">{successMessage}</p>}

    <button
      onClick={initiatePayment}
      className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition duration-300"
      disabled={isProcessing}
    >
      {isProcessing ? "Processing..." : "Pay Now"}
    </button>
  </div>
</div>

  );
};

export default PaymentPage;
