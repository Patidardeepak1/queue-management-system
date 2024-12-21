import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../config/config";

const SlotPage = () => {
  const { id } = useParams();
  const [selectedDay, setSelectedDay] = useState("monday");
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState("");
  const [confirmationCode, setConfirmationCode] = useState("");
  const [bookedSlots, setBookedSlots] = useState(new Set());
  const [slotToBook, setSlotToBook] = useState("");

  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");
  const userRole = localStorage.getItem("role");
  const canBookSlot = userRole === "user";

  useEffect(() => {
    const fetchSlots = async () => {
      setLoading(true);
      setError("");
      setStatusMessage("");
      setBookingSuccess("");
      setConfirmationCode("");
      setSlots([]);

      try {
        const response = await axios.get(
          `${BASE_URL}/api/booking/${id}/slots/${selectedDay}`
        );
        setSlots(response.data);
      } catch (err) {
        if (err.response && err.response.status === 404) {
          setStatusMessage(err.response.data.message);
        } else {
          setError("Failed to fetch slots. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSlots();
  }, [id, selectedDay]);
  const handleBookSlot = async (slot) => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
  
    if (!canBookSlot) {
      alert("You do not have permission to book a slot.");
      return;
    }
  
    setSlotToBook(slot);
  
    try {
      // Step 1: Create Razorpay order from backend  /:id/slots/:day/create-order
      const orderResponse = await axios.post(
        `${BASE_URL}/api/booking/${id}/slots/${selectedDay}/create-order`,
        { day: selectedDay, time: slot },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
  
      const { message } = orderResponse.data;
  
      if (message === "No payment required for this slot") {
        // Directly book the slot without payment if no payment is required
        const bookingResponse = await axios.post(
          `${BASE_URL}/api/booking/${id}/slots/book`,
          { day: selectedDay, time: slot },
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }
        );
  
        const { bookingMessage, confirmationCode } = bookingResponse.data;
        setBookingSuccess(bookingMessage || `Successfully booked slot: ${slot}`);
        setConfirmationCode(confirmationCode);
        setBookedSlots((prev) => new Set(prev).add(slot));
      } else {
        // Proceed with Razorpay payment if payment is required
        const { orderId, amount, currency, razorpayKey } = orderResponse.data;
        const options = {
          key: razorpayKey,
          amount: amount.toString(),
          currency: currency,
          name: "Slot Booking",
          description: `Booking slot for ${slot} on ${selectedDay}`,
          order_id: orderId,
          handler: async function (response) {
            // Step 3: Verify payment on backend
            try {
              const paymentVerification = await axios.post(
                `${BASE_URL}/api/booking/${id}/slots/${selectedDay}/verify-payment`,
                {
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_signature: response.razorpay_signature,
                  day: selectedDay,
                  time: slot,
                },
                {
                  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                }
              );
  
              const { message, confirmationCode } = paymentVerification.data;
              setBookingSuccess(message || `Successfully booked slot: ${slot}`);
              setConfirmationCode(confirmationCode);
              setBookedSlots((prev) => new Set(prev).add(slot));
            } catch (err) {
              setError("Payment verification failed. Please try again.");
            }
          },
          prefill: {
            name: localStorage.getItem("username") || "User",
            email: localStorage.getItem("email") || "user@example.com",
            contact: "1234567890",
          },
          theme: {
            color: "#3399cc",
          },
        };
  
        const rzp = new window.Razorpay(options);
        rzp.open();
      }
    } catch (err) {
      setError("Failed to initiate payment. Please try again.");
    }
  };
  

  return (
    <div className="bg-black min-h-screen py-12 px-6 text-white">
      <h2 className="text-4xl font-bold text-center mb-6">Available Slots</h2>

      <div className="text-center mb-6">
        <label className="text-lg mr-4">Select Day:</label>
        <select
          value={selectedDay}
          onChange={(e) => setSelectedDay(e.target.value)}
          className="px-3 py-2 rounded text-black"
        >
          {["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"].map((day) => (
            <option key={day} value={day}>
              {day.charAt(0).toUpperCase() + day.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {loading && <p className="text-center">Loading slots...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}
      {!loading && statusMessage && (
        <p className="text-center text-yellow-500">{statusMessage}</p>
      )}
      {bookingSuccess && (
        <div className="text-center">
          <p className="text-green-500">{bookingSuccess}</p>
          {confirmationCode && (
            <p className="text-green-400 font-bold">
              Your confirmation code is: {confirmationCode}
            </p>
          )}
        </div>
      )}
      {!loading && !statusMessage && slots.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {slots.map((slot) => (
            slot.status === false && (
              <button
                key={slot.time}
                onClick={() => handleBookSlot(slot.time)}
                className={`${
                  bookedSlots.has(slot.time)
                    ? "bg-gray-400 cursor-not-allowed opacity-50"
                    : "bg-blue-600"
                } text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition`}
                disabled={bookedSlots.has(slot.time)}
              >
                {slot.time}
              </button>
            )
          ))}
        </div>
      )}
    </div>
  );
};

export default SlotPage;
