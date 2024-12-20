import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    businessType: '', // Updated field name
    businessEmail: '',
    openTime: '',
    closeTime: '',
    statusDateWise: {
      monday: { open: false, openTime: '', closeTime: '' },
      tuesday: { open: false, openTime: '', closeTime: '' },
      wednesday: { open: false, openTime: '', closeTime: '' },
      thursday: { open: false, openTime: '', closeTime: '' },
      friday: { open: false, openTime: '', closeTime: '' },
      saturday: { open: false, openTime: '', closeTime: '' },
      sunday: { open: false, openTime: '', closeTime: '' },
    },
    location: '',
  });

  const [isRegistered, setIsRegistered] = useState(false);
  const [error, setError] = useState('');
  const [isBusiness, setIsBusiness] = useState(false); // To toggle between user and business registration
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox') {
      setFormData({
        ...formData,
        statusDateWise: {
          ...formData.statusDateWise,
          [name]: { ...formData.statusDateWise[name], open: checked },
        },
      });
    } else if (name.includes('Time')) {
      const [day, timeType] = name.split('-');
      setFormData({
        ...formData,
        statusDateWise: {
          ...formData.statusDateWise,
          [day]: { ...formData.statusDateWise[day], [timeType]: value },
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleRoleChange = (e) => {
    const { value } = e.target;
    setIsBusiness(value === 'business');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear any previous errors

    try {
      const endpoint = isBusiness
        ? 'http://localhost:5000/api/businesses/signup' // Business signup endpoint
        : 'http://localhost:5000/api/users/signup'; // User signup endpoint

      const response = await axios.post(endpoint, formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Registration successful:', response.data);
      setIsRegistered(true); // Show success message

      // Redirect to the home page after successful registration
      navigate('/'); // You can change this to redirect to any route you like
    } catch (err) {
      console.error('Signup error:', err.response?.data?.message || err.message);
      setError(err.response?.data?.message || 'Failed to register'); // Show error message

      // Check if the error message is about existing user
      if (err.response?.data?.message === 'User already exists') {
        navigate('/login'); // Adjust the login route based on your routing
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black pt-16 pb-16">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 text-white p-8 rounded-lg shadow-lg w-full max-w-md transition-transform transform hover:scale-105"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-white">Signup</h2>

        {/* Role Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300">Select Role</label>
          <div className="flex items-center space-x-4 mt-2">
            <label className="inline-flex items-center text-sm">
              <input
                type="radio"
                name="role"
                value="user"
                checked={!isBusiness}
                onChange={handleRoleChange}
                className="text-blue-500"
              />
              <span className="ml-2">User</span>
            </label>
            <label className="inline-flex items-center text-sm">
              <input
                type="radio"
                name="role"
                value="business"
                checked={isBusiness}
                onChange={handleRoleChange}
                className="text-blue-500"
              />
              <span className="ml-2">Business</span>
            </label>
          </div>
        </div>

        {/* Common Fields for Both User and Business */}
        <div className="mb-6">
          <label htmlFor="name" className="block text-sm font-medium text-gray-300">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="mt-2 block w-full p-3 border border-gray-600 rounded-md shadow-sm bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all"
            placeholder="Enter your name"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="email" className="block text-sm font-medium text-gray-300">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="mt-2 block w-full p-3 border border-gray-600 rounded-md shadow-sm bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all"
            placeholder="Enter your email"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="password" className="block text-sm font-medium text-gray-300">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="mt-2 block w-full p-3 border border-gray-600 rounded-md shadow-sm bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all"
            placeholder="Enter your password"
          />
        </div>

        {/* Business Specific Fields */}
        {isBusiness && (
          <>
            <div className="mb-6">
              <label htmlFor="businessType" className="block text-sm font-medium text-gray-300">
                Business Type
              </label>
              <input
                type="text"
                id="businessType"
                name="businessType"
                value={formData.businessType}
                onChange={handleChange}
                className="mt-2 block w-full p-3 border border-gray-600 rounded-md shadow-sm bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all"
                placeholder="Enter your business type"
              />
            </div>

            <div className="mb-6">
              <label htmlFor="location" className="block text-sm font-medium text-gray-300">
                Location
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="mt-2 block w-full p-3 border border-gray-600 rounded-md shadow-sm bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all"
                placeholder="Enter your business location"
              />
            </div>
          </>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 focus:outline-none transition duration-200 ease-in-out"
        >
          Sign Up
        </button>

        {error && (
          <div className="mt-4 text-center text-red-500">
            <p>{error}</p>
          </div>
        )}

        {isRegistered && (
          <div className="mt-4 text-center">
            <p className="text-green-500 mb-2">Registration successful!</p>
            <button
              onClick={() => navigate('/')}
              className="w-full bg-gray-600 text-white p-3 rounded-md hover:bg-gray-700 focus:outline-none transition duration-200"
            >
              Go to Home
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default Signup;
