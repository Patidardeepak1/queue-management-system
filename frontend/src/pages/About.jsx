import React from 'react';

function About() {
  return (
    <div className="min-h-screen bg-black text-white px-6 py-12">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-6">About Queue Management System</h1>
        <p className="text-lg text-center mb-12">
          Welcome to the Queue Management System! Our goal is to streamline queue management and enhance user experience by providing real-time updates and user-friendly interfaces.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Features Section */}
          <div className="bg-gray-800 p-6 rounded-md shadow-md hover:scale-105 transition-transform">
            <h2 className="text-2xl font-semibold mb-4">Features</h2>
            <ul className="list-disc list-inside text-gray-300">
              <li>Real-time queue monitoring</li>
              <li>Dynamic scheduling and updates</li>
              <li>Customizable user profiles</li>
              <li>Admin controls for efficient management</li>
              <li>Seamless integration with other systems</li>
            </ul>
          </div>

          {/* Mission Section */}
          <div className="bg-gray-800 p-6 rounded-md shadow-md hover:scale-105 transition-transform">
            <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
            <p className="text-gray-300">
              Our mission is to reduce waiting times and improve efficiency by leveraging modern technology and user-centric designs. We aim to provide a system that simplifies operations for businesses and improves satisfaction for users.
            </p>
          </div>
        </div>

        {/* Team Section */}
        <div className="bg-gray-800 p-6 rounded-md shadow-md mt-12">
          <h2 className="text-2xl font-semibold mb-4 text-center">Meet Our Team</h2>
          <p className="text-gray-300 text-center">
            Our dedicated team of developers, designers, and project managers work tirelessly to deliver a top-notch solution tailored to your needs.
          </p>
        </div>
      </div>
    </div>
  );
}

export default About;
