import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion'; // Import framer-motion for animations

const Home = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleBusinessClick = (businessType) => {
    navigate(`/businesses/type/${businessType.toLowerCase()}`);
  };

  return (
    <div className="bg-black min-h-screen flex flex-col justify-center items-center text-white">
      <main className="flex-grow p-6 text-center">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl font-bold tracking-tight mb-6">
            Welcome to Queue Management System
          </h1>
          <p className="mt-4 text-xl">
            Efficiently manage your queues and appointments with our platform.
            Book slots, receive real-time updates, and save time!
          </p>

          <div className="mt-12">
            <h2 className="text-3xl font-semibold mb-6">Featured Businesses</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { name: 'Hospital', img: '/hospital.jpg', desc: 'Book your appointment at nearby hospitals with real-time queue updates.' },
                { name: 'Restaurant', img: '/restaurant.jpg', desc: 'Reserve a table at your favorite restaurant without the wait.' },
                { name: 'Theater', img: '/theater1.jpg', desc: 'Book tickets and grab your seat at the theater for an enjoyable experience.' },
                { name: 'Clinic', img: '/clinic.jpg', desc: 'Get your appointment at the clinic without waiting in long queues.' },
                { name: 'Bank', img: '/bank.jpg', desc: 'Book a slot at your local bank for quick and efficient services.' },
                { name: 'Other', img: '/other.jpg', desc: 'Book a slot at your local services for efficient handling of various tasks.' },
              ].map((business, index) => (
                <motion.div
                  key={index}
                  className="bg-white rounded-lg overflow-hidden shadow-lg cursor-pointer"
                  onClick={() => handleBusinessClick(business.name)}
                  whileHover={{ scale: 1.05, y: -10 }} // Framer Motion hover effect
                  whileTap={{ scale: 0.95 }} // Framer Motion tap effect
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <img
                    src={business.img}
                    alt={`${business.name} Slot Booking`}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h4 className="text-xl font-semibold">{business.name}</h4>
                    <p className="text-gray-700 mt-2">{business.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="mt-12">
            <h3 className="text-2xl font-semibold mb-4">Get Started</h3>
            <p className="mt-4 text-lg">
              Start using our queue management system today and avoid long wait
              times.
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
