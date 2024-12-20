import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [isBusiness, setIsBusiness] = useState(false); // New state for role selection
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleRoleChange = (e) => {
    const { value } = e.target;
    setIsBusiness(value === 'business'); // Toggle between user and business login
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear any previous error

    // Set the endpoint based on the selected role
    const endpoint = isBusiness
      ? 'http://localhost:5000/api/businesses/login' // Business login endpoint
      : 'http://localhost:5000/api/users/login'; // User login endpoint

    try {
      const response = await axios.post(endpoint, formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

     
      const { token, role  } = response.data;

      // Save token and role to localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("role", role||'user');
      // Redirect to the home page
      navigate('/'); 

      // Trigger a page refresh to ensure Navbar updates with the new login state
      window.location.reload(); // Reload page to reflect login state

    } catch (err) {
      // Set error message from the response or use a fallback
      setError(err.response?.data?.message || 'Failed to login');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black pt-16 pb-16">
      <form onSubmit={handleSubmit} className="bg-gray-800 text-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-white">Login</h2>

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
          <label htmlFor="email" className="block text-sm font-medium text-gray-300">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="mt-2 block w-full p-3 border border-gray-600 rounded-md shadow-sm bg-gray-700"
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
            className="mt-2 block w-full p-3 border border-gray-600 rounded-md shadow-sm bg-gray-700"
            placeholder="Enter your password"
          />
        </div>

        <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700">
          Login
        </button>

        {error && (
          <div className="mt-4 text-center text-red-500">
            <p>{error}</p>
          </div>
        )}
      </form>
    </div>
  );
};

export default Login;
