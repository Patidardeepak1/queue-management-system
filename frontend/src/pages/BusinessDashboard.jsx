import React, { useState, useEffect } from "react";
import axios from "axios";
import BASE_URL from "../config/config";
const BusinessDashboard = () => {
  const [businessInfo, setBusinessInfo] = useState({
    name: "",
    email: "",
    businessType: "",
    location: "",
    statusDateWise: {},
  });
  const [newBusinessName, setNewBusinessName] = useState("");
  const [newBusinessType, setNewBusinessType] = useState("");
  const [newLocation, setNewLocation] = useState("");
  const [newStatusDateWise, setNewStatusDateWise] = useState({});
  const [slotDuration, setSlotDuration] = useState(30); // Default slot duration
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [uploadError, setUploadError] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [slotPayment, setSlotPayment] = useState(0); // Default to 0


  // Fetch business data from backend
  useEffect(() => {
    const fetchBusinessData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${BASE_URL}/api/businesses/business`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setBusinessInfo(response.data);
        setNewBusinessName(response.data.name);
        setNewBusinessType(response.data.businessType);
        setNewLocation(response.data.location);
        setNewStatusDateWise(response.data.statusDateWise);
        setSlotDuration(response.data.slotDuration || 30); // Set initial slot duration if available
        setSlotPayment(response.data.slotPayment)
        setLoading(false);
      } catch (error) {
        setError("Error fetching business data.");
        setLoading(false);
      }
    };

    fetchBusinessData();
  }, []);

  // Fetch bookings made by customers from the backend
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${BASE_URL}/api/businesses/business-bookings`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.data.length === 0) {
          setBookings("No bookings found for this business.");
        } else {
          setBookings(response.data); // Assuming the response contains bookings
        }
        setLoading(false);
      } catch (error) {
        //setError("Error fetching bookings.");
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  // Handle form submission for image upload
 
  const handleImageUpload = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    const formData = new FormData();
  
    // Append each selected image to the form data
    selectedImages.forEach((image) => {
      formData.append('images', image); // 'images' is the field name expected by the backend
    });
  
    try {
      // Retrieve token from localStorage
      const token = localStorage.getItem('token'); // Ensure the key matches how you store the token
  
      if (!token) {
        throw new Error('Authentication token is missing. Please log in again.');
      }
  
      // Send the POST request with axios
      const response = await axios.post(
        `${BASE_URL}/api/businesses/upload-images`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data', // Required for file uploads
            Authorization: `Bearer ${token}`, // Add the token to headers
          },
        }
      );
  
      // Handle the successful response
      console.log('Images uploaded:', response.data.imageUrls);
      // Update the UI (e.g., display uploaded image URLs or a success message)
    } catch (error) {
      // Handle errors gracefully
      if (error.response) {
        // Backend error
        setUploadError(error.response.data.message || 'Error uploading images');
      } else {
        // Other errors (e.g., network issues)
        setUploadError('Error uploading images');
      }
      console.error('Image upload error:', error);
    }
  
    setIsUploading(false);
  };
  

  // Handle updating business info and slots
  const handleUpdateBusinessInfo = async () => {
    if (!newBusinessName || !newLocation) {
      setError("Business name and location are required.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${BASE_URL}/api/businesses/update`,
        {
          name: newBusinessName,
          businessType: newBusinessType,
          location: newLocation,
          statusDateWise: newStatusDateWise,
          slotDuration, // Include slot duration in the update
          slotPayment
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setBusinessInfo({
        ...businessInfo,
        name: newBusinessName,
        businessType: newBusinessType,
        location: newLocation,
        statusDateWise: newStatusDateWise,
        slotDuration, // Update slot duration as well
        slotPayment
      });
      setIsEditing(false);
      setError("");
    } catch (error) {
      setError("Error updating business details.");
    }
  };

  const handleDayChange = (day, type, value) => {
    setNewStatusDateWise((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [type]: value,
      },
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-200">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 p-4 sm:p-6">
      <div className="max-w-xl mx-auto bg-gray-800 shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-100">Business Information</h2>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-gray-400">Business Name</label>
            <input
              type="text"
              value={isEditing ? newBusinessName : businessInfo.name}
              onChange={(e) => setNewBusinessName(e.target.value)}
              disabled={!isEditing}
              className={`w-full p-2 border rounded-md ${
                isEditing
                  ? "border-gray-500 bg-gray-700 text-gray-200"
                  : "bg-gray-800 text-gray-400"
              }`}
            />
          </div>
          <div>
            <label className="block text-gray-400">Business Type</label>
            <input
              type="text"
              value={isEditing ? newBusinessType : businessInfo.businessType}
              onChange={(e) => setNewBusinessType(e.target.value)}
              disabled={!isEditing}
              className={`w-full p-2 border rounded-md ${
                isEditing
                  ? "border-gray-500 bg-gray-700 text-gray-200"
                  : "bg-gray-800 text-gray-400"
              }`}
            />
          </div>
          <div>
            <label className="block text-gray-400">Location</label>
            <input
              type="text"
              value={isEditing ? newLocation : businessInfo.location}
              onChange={(e) => setNewLocation(e.target.value)}
              disabled={!isEditing}
              className={`w-full p-2 border rounded-md ${
                isEditing
                  ? "border-gray-500 bg-gray-700 text-gray-200"
                  : "bg-gray-800 text-gray-400"
              }`}
            />
          </div>
        </div>
        <div>
      <label className="block text-gray-400">Upload Images</label>
      <form onSubmit={handleImageUpload} className="space-y-4 mt-4" encType="multipart/form-data">
          <div className="flex flex-col">
            <label htmlFor="images" className="text-gray-400">Select Images</label>
            <input
              type="file"
              accept="image/*"
              name="images"
              id="images"
              multiple // Allow multiple files selection
              onChange={(e) => setSelectedImages(Array.from(e.target.files))}
              className="w-full p-2 border rounded-md"
            />
          </div>

          {uploadError && <p className="text-red-500 mt-2">{uploadError}</p>}
          
          <button
            type="submit"
            disabled={isUploading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md mt-4 disabled:bg-gray-400"
          >
            {isUploading ? 'Uploading...' : 'Upload Images'}
          </button>
        </form>
    </div>
        <h3 className="text-xl font-bold mt-6 text-gray-100">Business Hours</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          {Object.keys(businessInfo.statusDateWise).map((day) => (
            <div key={day} className="space-y-2">
              <label className="block text-gray-400">
                {day.charAt(0).toUpperCase() + day.slice(1)}
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={newStatusDateWise[day]?.open || businessInfo.statusDateWise[day]?.open}
                  onChange={() =>
                    handleDayChange(day, "open", !businessInfo.statusDateWise[day]?.open)
                  }
                  disabled={!isEditing}
                />
                {isEditing && (
                  <>
                    <input
                      type="time"
                      value={newStatusDateWise[day]?.openTime || businessInfo.statusDateWise[day]?.openTime}
                      onChange={(e) => handleDayChange(day, "openTime", e.target.value)}
                      className="p-2 border rounded-md bg-gray-700 text-gray-200"
                      disabled={!newStatusDateWise[day]?.open}
                    />
                    <input
                      type="time"
                      value={newStatusDateWise[day]?.closeTime || businessInfo.statusDateWise[day]?.closeTime}
                      onChange={(e) => handleDayChange(day, "closeTime", e.target.value)}
                      className="p-2 border rounded-md bg-gray-700 text-gray-200"
                      disabled={!newStatusDateWise[day]?.open}
                    />
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <label className="block text-gray-400">Slot Duration (minutes          )</label>
          <input
            type="number"
            value={slotDuration}
            onChange={(e) => setSlotDuration(parseInt(e.target.value, 10))}
            disabled={!isEditing}
            className={`w-full p-2 border rounded-md ${
              isEditing
                ? "border-gray-500 bg-gray-700 text-gray-200"
                : "bg-gray-800 text-gray-400"
            }`}
          />
        </div>
        <div className="mt-6">
  <label className="block text-gray-400">Payment for 1 Slot</label>
  <input
    type="number"
    value={slotPayment}
    onChange={(e) => setSlotPayment(parseFloat(e.target.value))}
    disabled={!isEditing}
    className={`w-full p-2 border rounded-md ${
      isEditing
        ? "border-gray-500 bg-gray-700 text-gray-200"
        : "bg-gray-800 text-gray-400"
        }`}
      />
     </div>


       
        <div className="flex justify-end space-x-4 mt-6">
          {isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-gray-600 text-gray-200 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateBusinessInfo}
                className="px-4 py-2 bg-blue-600 text-gray-200 rounded-md"
              >
                Save
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-green-600 text-gray-200 rounded-md"
            >
              Edit
            </button>
          )}
        </div>
      </div>

      <div className="max-w-xl mx-auto mt-8 bg-gray-800 shadow-md rounded-lg p-6">
        <h3 className="text-2xl font-bold mb-4 text-gray-100">Bookings</h3>
        {Array.isArray(bookings) ? (
        <div className="space-y-4">
        {Array.isArray(bookings) && bookings.length > 0 ? (
          bookings.map((booking, index) => (
            <div
              key={index}
              className="p-4 bg-gray-700 rounded-md shadow-md text-gray-300"
            >
              <p><strong>Customer Name:</strong> {booking.userId?.name || "Not Provided"}</p>
              <p><strong>Date:</strong> {new Date(booking.reservationDate).toLocaleDateString() || "Not Provided"}</p>
              <p><strong>Time:</strong> {booking.slot || "Not Provided"}</p>
              <p><strong>Booking Code:</strong> {booking.bookingCode || "Not Provided"}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-400">No bookings available.</p>
        )}
      </div>
      
        ) : (
          <p className="text-gray-400">{bookings}</p>
        )}
         {error && (
          <div className="text-red-500 mt-4">
            {error}
          </div>
        )}

      </div>
    </div>
  );
};

export default BusinessDashboard;

