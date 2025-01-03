import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../config/config";

function Footer() {
  const [stats, setStats] = useState({ userCount: 0, businessCount: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/stats`);
        setStats(response.data);
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      }
    };

    fetchStats();
  }, []);

  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="max-w-7xl mx-auto px-3 text-center">
        {/* Links Section */}
        <div className="flex flex-col items-center space-y-4 mb-6">
          <div className="flex space-x-6">
            <Link
              to="/about"
              className="text-sm text-gray-300 hover:text-yellow-400 transition duration-300"
            >
              About
            </Link>
            <Link
              to="/contact"
              className="text-sm text-gray-300 hover:text-yellow-400 transition duration-300"
            >
              Contact
            </Link>
            <Link
              to="/privacy-policy"
              className="text-sm text-gray-300 hover:text-yellow-400 transition duration-300"
            >
              Privacy Policy
            </Link>
          </div>
        </div>

        {/* Stats Section */}
        <div className="text-sm text-gray-300 mb-6">
          <p>
            Users:{" "}
            <span className="text-yellow-400 font-semibold">
              {stats.userCount}
            </span>{" "}
            | Businesses:{" "}
            <span className="text-yellow-400 font-semibold">
              {stats.businessCount}
            </span>
          </p>
        </div>

        {/* Bottom Section */}
        <div className=" border-gray-600 pt-3 text-center text-xs text-gray-400">
          <p>&copy; 2024 Queue Management System. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
