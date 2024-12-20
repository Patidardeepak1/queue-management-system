import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';  // Import axios
import { Link } from 'react-router-dom';

const BusinessList = () => {
  const { businessType } = useParams();  // Get the business type from the URL parameter
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch the businesses based on the business type using axios
  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/booking/type/${businessType}`);
        setBusinesses(response.data);  // Set the businesses data
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching businesses:", error);
      } finally {
        setLoading(false);  // Set loading to false after the request is completed
      }
    };

    fetchBusinesses();
  }, [businessType]);

  if (loading) {
    return <p className="text-center text-white">Loading...</p>;
  }

  return (
    <div className="bg-black min-h-screen py-12 px-6 text-white">
      {/* Heading Section */}
      <h2 className="text-5xl font-bold text-center mb-12 text-white">Businesses: {businessType}</h2>
      
      {/* Grid for business cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {businesses.map((business) => (
          <Link key={business._id} to={`/business/${business._id}`}>
            <div className="relative bg-white rounded-lg overflow-hidden shadow-lg transform transition-all hover:scale-105 hover:shadow-2xl duration-300">
              {/* Image Section */}
              <div className="w-full h-48 relative">
                <img
                  src={`http://localhost:5000/uploads/${business.imageUrl}`}
                  alt={`${business.name} Slot Booking`}
                  className="w-full h-full object-cover transition-all duration-300 transform hover:scale-110"
                />
              </div>
              
              {/* Text Section with Transparency */}
              <div className="p-6 bg-white bg-opacity-70 absolute bottom-0 w-full transition-all duration-300 hover:bg-opacity-90 z-10">
                <h4 className="text-xl font-semibold text-gray-800 mb-2">{business.name}</h4>
                <p className="text-gray-600">Location: {business.location}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Call to Action Section */}
      <div className="mt-12 text-center">
        <h3 className="text-2xl font-semibold mb-4">Explore More Businesses</h3>
        <p className="text-lg mb-6">Find more options to manage your appointments and bookings efficiently.</p>
        <a
          href="/"
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 transform hover:scale-105"
        >
          Explore Now
        </a>
      </div>
    </div>
  );
};

export default BusinessList;
