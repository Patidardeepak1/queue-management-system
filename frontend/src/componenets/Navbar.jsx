import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  const navigate = useNavigate();

  // Check if the user is logged in by verifying the JWT token in localStorage
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decode JWT token
      setUserInfo({ name: decodedToken.name, email: decodedToken.email });
    } else {
      setIsLoggedIn(false);
    }
  }, []);


  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setIsLoggedIn(false);
    navigate('/login');
  };

  const handleLinkClick = () => {
    // Close the menu when a link is clicked
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-gray-900 text-white px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Left Side: Logo */}
        <div className="flex items-center">
          <img
            src="..\src\assets\logo.jpg" // Replace with your logo URL
            alt="Logo"
            className="h-10 w-10 mr-2"
          />
          <span className="text-xl font-semibold">Queue Management System</span>
        </div>

        {/* Hamburger Menu for Mobile */}
        <div className="md:hidden">
          <button onClick={toggleMenu} className="focus:outline-none">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </div>

      

        {/* Right Side: Navigation Links */}
        <div className="hidden md:flex md:flex-row space-x-6">
          <Link to="/" className="hover:text-yellow-300">
            Home
          </Link>
          <Link to="/about" className="hover:text-yellow-300">
            About
          </Link>

          {isLoggedIn ? (
            <div className="flex items-center space-x-4">
              <Link to="/dashboard" className="flex items-center">
                <img
                  src="https://via.placeholder.com/30" // Replace with a profile icon URL
                  alt="Profile"
                  className="h-8 w-8 rounded-full"
                />
              </Link>
              <button onClick={handleLogout} className="hover:text-yellow-300">
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="hover:text-yellow-300">
                Login
              </Link>
              <Link to="/signup" className="hover:text-yellow-300">
                Signup
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Dropdown Menu for Mobile (Hamburger Menu) */}
      {isMenuOpen && (
        <div className="absolute bg-transparent top-16 left-0 right-0 z-10 md:hidden">
          <div className="bg-gray-800 text-white py-4 px-6 flex flex-col space-y-4">
            <Link to="/" className="hover:text-yellow-300" onClick={handleLinkClick}>
              Home
            </Link>
            <Link to="/about" className="hover:text-yellow-300" onClick={handleLinkClick}>
              About
            </Link>
            {isLoggedIn ? (
              <>
                <Link to="/dashboard" className="hover:text-yellow-300" onClick={handleLinkClick}>
                  Dashboard
                </Link>
                <button onClick={handleLogout} className="hover:text-yellow-300">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-yellow-300" onClick={handleLinkClick}>
                  Login
                </Link>
                <Link to="/signup" className="hover:text-yellow-300" onClick={handleLinkClick}>
                  Signup
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
