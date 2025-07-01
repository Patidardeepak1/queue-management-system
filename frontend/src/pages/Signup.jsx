import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import BASE_URL from '../config/config';
import OAuth from '../componenets/OAuth'; 

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    businessType: '',
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
  const [isBusiness, setIsBusiness] = useState(false);
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
    setError('');

    try {
      const endpoint = isBusiness
        ? `${BASE_URL}/api/businesses/signup`
        : `${BASE_URL}/api/users/signup`;

      const response = await axios.post(endpoint, formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      setIsRegistered(true);
      navigate('/');
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to register';
      setError(message);

      if (message === 'User already exists') {
        navigate('/login');
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

        {/* Common Fields */}
        <div className="mb-6">
          <label htmlFor="name" className="block text-sm font-medium text-gray-300">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="mt-2 block w-full p-3 bg-gray-700 border border-gray-600 rounded-md"
            placeholder="Enter your name"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="mt-2 block w-full p-3 bg-gray-700 border border-gray-600 rounded-md"
            placeholder="Enter your email"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="password" className="block text-sm font-medium text-gray-300">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="mt-2 block w-full p-3 bg-gray-700 border border-gray-600 rounded-md"
            placeholder="Enter your password"
          />
        </div>

        {/* Business Specific Fields */}
        {isBusiness && (
          <>
            <div className="mb-6">
              <label htmlFor="businessType" className="block text-sm font-medium text-gray-300">Business Type</label>
              <input
                type="text"
                id="businessType"
                name="businessType"
                value={formData.businessType}
                onChange={handleChange}
                className="mt-2 block w-full p-3 bg-gray-700 border border-gray-600 rounded-md"
                placeholder="Enter business type"
              />
            </div>

            <div className="mb-6">
              <label htmlFor="location" className="block text-sm font-medium text-gray-300">Location</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="mt-2 block w-full p-3 bg-gray-700 border border-gray-600 rounded-md"
                placeholder="Enter location"
              />
            </div>
          </>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 transition duration-200"
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
              className="w-full bg-gray-600 text-white p-3 rounded-md hover:bg-gray-700"
            >
              Go to Home
            </button>
          </div>
        )}

        {/* OR separator */}
        {!isBusiness && (
          <>
            <div className="flex items-center my-6">
              <div className="flex-grow h-px bg-gray-500"></div>
              <span className="mx-4 text-gray-400">or</span>
              <div className="flex-grow h-px bg-gray-500"></div>
            </div>
            <OAuth />
          </>
        )}
      </form>
    </div>
  );
};

export default Signup;
