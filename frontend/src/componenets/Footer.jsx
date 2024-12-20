// src/components/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="max-w-7xl mx-auto text-center">
        {/* Top Section: Links */}
        <div className="mb-4">
          <div className="flex justify-center space-x-6">
            <Link to="/about" className="hover:text-yellow-300">
              About
            </Link>
            <Link to="/contact" className="hover:text-yellow-300">
              Contact
            </Link>
            <Link to="/privacy-policy" className="hover:text-yellow-300">
              Privacy Policy
            </Link>
          </div>
        </div>

        {/* Bottom Section: Copyright */}
        <div className="text-sm text-gray-400">
          <p>&copy; 2024 Queue Management System. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
