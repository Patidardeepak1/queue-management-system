// src/pages/ContactUs.jsx
import React from 'react';

const Contact = () => {
  return (
    <div className="bg-black min-h-screen flex justify-center items-center text-white">
      <main className="max-w-3xl mx-auto p-6">
        <h1 className="text-4xl font-bold text-center mb-8">Contact Us</h1>
        <p className="text-lg text-center mb-12">
          Feel free to reach out to us through any of the following channels. We’d love to hear from you!
        </p>

        <div className="bg-gray-800 p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-center mb-6">Our Contact Information</h2>
          
          {/* Email Section */}
          <div className="mb-6">
            <h3 className="text-xl font-medium">Email</h3>
            <p className="text-lg mt-2">
              For inquiries, support, or any other questions, please reach out to us at:
              <a href="mailto:support@yourwebsite.com" className="text-blue-500 hover:underline">
                support@queuemanagmentsystem.com
              </a>
            </p>
          </div>

          {/* Social Media Section */}
          <div className="mb-6">
            <h3 className="text-xl font-medium">Follow Us</h3>
            <p className="text-lg mt-2">Stay connected with us on our social media platforms:</p>
            <div className="flex justify-center mt-4 space-x-6">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                <i className="fab fa-facebook-f text-2xl">facebook</i>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-600">
                <i className="fab fa-twitter text-2xl">Twitter</i>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:text-pink-800">
                <i className="fab fa-instagram text-2xl">Instagram</i>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-900">
                <i className="fab fa-linkedin-in text-2xl">Linkedin</i>
              </a>
            </div>
          </div>

          {/* Website Section */}
          <div className="mb-6">
            <h3 className="text-xl font-medium">Website</h3>
            <p className="text-lg mt-2">
              Visit our website for more information about our services and updates:
              <a href="https://www.queuemanagmentsystem.com" className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">
                www.queuemanagmentsystem.com
              </a>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Contact;
