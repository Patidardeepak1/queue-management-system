import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const BusinessProfile = () => {
  const { id } = useParams(); // Get business id from URL params
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(''); // Handle fetch errors
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login status
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0); // Track the current image index
  const [imageInterval, setImageInterval] = useState(null); // Store the interval for auto-changing images

  // Check login status
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  // Fetch business details
  useEffect(() => {
    const fetchBusinessDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/booking/${id}`);
        setBusiness(response.data);
      } catch (err) {
        console.error('Error fetching business details:', err);
        setError('Failed to load business details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchBusinessDetails();
  }, [id]);

  // Handle the image change interval
  useEffect(() => {
    if (business && business.imageUrls && business.imageUrls.length > 0) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % business.imageUrls.length);
      }, 3000); // Change image every 3 seconds

      setImageInterval(interval);

      return () => clearInterval(interval); // Clean up the interval when component is unmounted or business changes
    }
  }, [business]);

  const handleLoginRedirect = () => {
    navigate('/login'); // Redirect to login page
  };

  if (loading) return <p className="text-center text-white">Loading...</p>;

  if (error) return <p className="text-center text-red-500">{error}</p>;

  if (!business) return <p className="text-center text-red-500">Business not found.</p>;

  return (
    <div className="bg-black min-h-screen py-12 px-6 text-white">
      <h2 className="text-5xl font-bold text-center mb-8">{business.name}</h2>
      <p className="text-center text-lg mb-4">{business.location}</p>
      <p className="text-center text-gray-300 mb-12">Email: {business.email}</p>

      {/* Image Carousel */}
      <div className="relative mb-12">
        <h3 className="text-2xl font-semibold mb-4 text-center">Business Images</h3>
        <div className="relative w-full h-64 overflow-hidden">
          <div
            className="absolute inset-0 flex transition-all duration-500"
            style={{
              transform: `translateX(-${currentImageIndex * 100}%)`,
            }}
          >
            {business.imageUrls && business.imageUrls.length > 0 ? (
              business.imageUrls.map((imageUrl, index) => (
                <div key={index} className="w-full flex-shrink-0">
                  <img
                    src={`http://localhost:5000/uploads/${imageUrl}`}
                    alt={`Business Image ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg shadow-lg"
                  />
                </div>
              ))
            ) : (
              <p className="text-gray-500">No images uploaded by the business.</p>
            )}
          </div>
        </div>
      </div>

      {/* Day-wise Status and Timings */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(business.statusDateWise).map(([day, status]) => (
          <div
            key={day}
            className={`p-4 rounded-lg shadow-md ${status.open ? 'bg-green-600' : 'bg-gray-700'}`}
          >
            <h4 className="text-2xl font-semibold mb-2 capitalize">{day}</h4>
            {status.open ? (
              <p>
                Open: {status.openTime} - {status.closeTime}
              </p>
            ) : (
              <p>Closed</p>
            )}
          </div>
        ))}
      </div>

      {/* Call to Action for Slot Booking */}
      <div className="text-center mt-12">
        <h3 className="text-2xl font-semibold mb-4">Check Available Slots</h3>
        <p className="text-lg mb-6">Manage and book slots for this business efficiently.</p>

        {isLoggedIn ? (
          <a
            href={`/business/${id}/slots`}
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 transform hover:scale-105"
          >
            View Slots
          </a>
        ) : (
          <button
            onClick={handleLoginRedirect}
            className="inline-block px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition duration-300 transform hover:scale-105"
          >
            Login to View Slots
          </button>
        )}
      </div>
    </div>
  );
};

export default BusinessProfile;
