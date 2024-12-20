import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();  // Use useNavigate instead of history

  // Check if the user is logged in by looking for a token in localStorage
  const token = localStorage.getItem('token');  // Token indicates user is logged in

  const handleBusinessClick = (businessType) => {
    // Redirect to the businesses page filtered by business type in lowercase
    navigate(`/businesses/type/${businessType.toLowerCase()}`);
  };
  

  return (
    <div className="bg-black min-h-screen flex flex-col justify-center items-center text-white">
      {/* Main Content Section */}
      <main className="flex-grow p-6 text-center">
        <div className="max-w-7xl mx-auto">
          {/* Heading */}
          <h1 className="text-5xl font-bold tracking-tight mb-6">Welcome to Queue Management System</h1>
          <p className="mt-4 text-xl">
            Efficiently manage your queues and appointments with our platform. Book slots, receive real-time updates, and save time!
          </p>

          {/* Featured Businesses Section */}
          <div className="mt-12">
            <h2 className="text-3xl font-semibold mb-6">Featured Businesses</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Business 1: Hospital */}
              <div
                className="bg-white rounded-lg overflow-hidden shadow-lg cursor-pointer"
                onClick={() => handleBusinessClick("Hospital")}
              >
                <img
                  src="/hospital.jpg"
                  alt="Hospital Slot Booking"
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h4 className="text-xl font-semibold">Hospital</h4>
                  <p className="text-gray-700 mt-2">Book your appointment at nearby hospitals with real-time queue updates.</p>
                </div>
              </div>

              {/* Business 2: Restaurant */}
              <div
                className="bg-white rounded-lg overflow-hidden shadow-lg cursor-pointer"
                onClick={() => handleBusinessClick("Restaurant")}
              >
                <img
                  src="/restaurant.jpg"
                  alt="Restaurant Slot Booking"
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h4 className="text-xl font-semibold">Restaurant</h4>
                  <p className="text-gray-700 mt-2">Reserve a table at your favorite restaurant without the wait.</p>
                </div>
              </div>

              {/* Business 3: Theater */}
              <div
                className="bg-white rounded-lg overflow-hidden shadow-lg cursor-pointer"
                onClick={() => handleBusinessClick("Theater")}
              >
                <img
                  src="/theater1.jpg"
                  alt="Theater Slot Booking"
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h4 className="text-xl font-semibold">Theater</h4>
                  <p className="text-gray-700 mt-2">Book tickets and grab your seat at the theater for an enjoyable experience.</p>
                </div>
              </div>

              {/* Business 4: Clinic */}
              <div
                className="bg-white rounded-lg overflow-hidden shadow-lg cursor-pointer"
                onClick={() => handleBusinessClick("Clinic")}
              >
                <img
                  src="/clinic.jpg"
                  alt="Clinic Slot Booking"
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h4 className="text-xl font-semibold">Clinic</h4>
                  <p className="text-gray-700 mt-2">Get your appointment at the clinic without waiting in long queues.</p>
                </div>
              </div>

              {/* Business 5: Bank */}
              <div
                className="bg-white rounded-lg overflow-hidden shadow-lg cursor-pointer"
                onClick={() => handleBusinessClick("Bank")}
              >
                <img
                  src="/bank.jpg"
                  alt="Bank Slot Booking"
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h4 className="text-xl font-semibold">Bank</h4>
                  <p className="text-gray-700 mt-2">Book a slot at your local bank for quick and efficient services.</p>
                </div>
              </div>
              {/* Business 5: Other */}
<div
  className="bg-white rounded-lg overflow-hidden shadow-lg cursor-pointer"
  onClick={() => handleBusinessClick("Other")}
>
  <img
    src="/other.jpg"
    alt="Other Slot Booking"
    className="w-full h-48 object-cover"
  />
  <div className="p-4">
    <h4 className="text-xl font-semibold">Other</h4>
    <p className="text-gray-700 mt-2">Book a slot at your local services for quick and efficient handling of various tasks.</p>
  </div>
</div>

           
            </div>
          </div>
          

          {/* Call to Action Section */}
          <div className="mt-12">
            <h3 className="text-2xl font-semibold mb-4">Get Started</h3>
            <p className="mt-4 text-lg">
              Start using our queue management system today and avoid long wait times.
            </p>
            <div className="mt-6">
              {!token && (
                <a
                  href="/signup"
                  className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 transform hover:scale-105"
                >
                  Sign Up Now
                </a>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
