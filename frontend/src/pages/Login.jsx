import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import BASE_URL from '../config/config';
import OAuth from '../componenets/OAuth'; // Import the OAuth component

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [isBusiness, setIsBusiness] = useState(false);
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
    setIsBusiness(value === 'business');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const endpoint = isBusiness
      ? `${BASE_URL}/api/businesses/login`
      : `${BASE_URL}/api/users/login`;

    try {
      const response = await axios.post(endpoint, formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const { token, role } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('role', role || 'user');

      navigate('/');
      window.location.reload();
    } catch (err) {
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

        {/* Email */}
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

        {/* Password */}
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

        {/* Submit Button */}
        <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 transition duration-200">
          Login
        </button>

        {/* Error Message */}
        {error && (
          <div className="mt-4 text-center text-red-500">
            <p>{error}</p>
          </div>
        )}

       {/* Google Sign-in for User only */}
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

export default Login;
