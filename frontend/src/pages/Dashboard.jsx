import React, { useState, useEffect } from "react";
import axios from "axios";
import BASE_URL from "../config/config";
const Dashboard = () => {
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
  });
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const [bookedSlots, setBookedSlots] = useState([]); // State for booked slots

  // Fetch user data and booked slots from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        // Fetch user information
        const userResponse = await axios.get(
          `${BASE_URL}/api/users/user`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setUserInfo(userResponse.data);
        setNewName(userResponse.data.name);
        setNewEmail(userResponse.data.email);

        // Fetch booked slots
        const slotsResponse = await axios.get(
          `${BASE_URL}/api/users/user-slots`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setBookedSlots(slotsResponse.data);
        setLoading(false);
      } catch (error) {
        setError("Error fetching user data or slots.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Update user information
  const handleUpdateUserInfo = async () => {
    if (!newName || !newEmail) {
      setError("Name and email are required.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${BASE_URL}/api/users/update`,
        { name: newName, email: newEmail },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUserInfo({ name: newName, email: newEmail });
      setIsEditing(false);
      setError("");
    } catch (error) {
      setError("Error updating user details.");
    }
  };

  // Update user password
  const handleUpdatePassword = async () => {
    if (!password) {
      setError("Password is required.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${BASE_URL}/api/users/update-password`,
        { password },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setPassword("");
      setError("");
    } catch (error) {
      setError("Error updating password.");
    }
  };

  // Reminder for upcoming slots
  useEffect(() => {
    const remindUser = () => {
      const now = new Date();
      bookedSlots.forEach((slot) => {
        const slotTime = new Date(slot.bookedAt);
        if (slotTime - now <= 3600000 && slotTime > now) {
          alert(`Reminder: You have a booking at ${slot.slot} on ${slot.day}.`);
        }
      });
    };

    const reminderInterval = setInterval(remindUser, 60000); // Check every minute
    return () => clearInterval(reminderInterval); // Cleanup on unmount
  }, [bookedSlots]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-200">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 p-6">
      <div className="max-w-xl mx-auto bg-gray-800 shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-100">
          Profile Information
        </h2>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-gray-400">Name</label>
            <input
              type="text"
              value={isEditing ? newName : userInfo.name}
              onChange={(e) => setNewName(e.target.value)}
              disabled={!isEditing}
              className={`w-full p-2 border rounded-md ${
                isEditing
                  ? "border-gray-500 bg-gray-700 text-gray-200"
                  : "bg-gray-800 text-gray-400"
              }`}
            />
          </div>
          <div>
            <label className="block text-gray-400">Email</label>
            <input
              type="email"
              value={isEditing ? newEmail : userInfo.email}
              onChange={(e) => setNewEmail(e.target.value)}
              disabled={!isEditing}
              className={`w-full p-2 border rounded-md ${
                isEditing
                  ? "border-gray-500 bg-gray-700 text-gray-200"
                  : "bg-gray-800 text-gray-400"
              }`}
            />
          </div>
        </div>
        <div className="mt-4 flex space-x-4">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md"
          >
            {isEditing ? "Cancel" : "Edit Info"}
          </button>
          {isEditing && (
            <button
              onClick={handleUpdateUserInfo}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md"
            >
              Save Changes
            </button>
          )}
        </div>

        <h3 className="text-xl font-bold mt-6 text-gray-100">Change Password</h3>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border border-gray-500 rounded-md my-4 bg-gray-700 text-gray-200"
          placeholder="Enter new password"
        />
        <button
          onClick={handleUpdatePassword}
          className="bg-purple-700 hover:bg-purple-800 text-white px-4 py-2 rounded-md"
        >
          Update Password
        </button>

        <h3 className="text-xl font-bold mt-6 text-gray-100">Booked Slots</h3>
        {bookedSlots.length === 0 ? (
          <p className="text-gray-400">No slots booked yet.</p>
        ) : (
          <ul className="mt-4 space-y-4">
            {bookedSlots.map((slot) => (
              <li key={slot._id} className="bg-gray-700 p-4 rounded-md shadow">
                <div className="flex justify-between">
                  <div>
                    <p className="text-gray-200 font-bold">
                      Business: {slot.businessId?.name || "N/A"}
                    </p>
                    <p className="text-gray-400">Day: {slot.day}</p>
                    <p className="text-gray-400">Time: {slot.slot}</p>
                    <p className="text-gray-400">Date: {new Date(slot.reservationDate).toLocaleDateString()}</p>
                    <p className="text-gray-400">Booking Code: {slot.bookingCode}</p>
                  </div>
                  <div className="text-right text-gray-400">
                    <p>Booked At:</p>
                    <p>{new Date(slot.bookedAt).toLocaleString()}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
