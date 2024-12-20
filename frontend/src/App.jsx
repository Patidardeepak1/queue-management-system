// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Navbar from './componenets/Navbar';  // Import your Navbar
import Footer from './componenets/Footer';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Contact from './pages/Contact';
import Dashboard from './pages/Dashboard'; // Example protected page
import PrivateRoute from './componenets/PrivateRoute'; // Import PrivateRoute component
import BusinessDashboard from './pages/BusinessDashboard';
import { Navigate } from 'react-router-dom';  // Add this import
import BusinessList from './componenets/BusinessList';
import BusinessProfile from './componenets/BusinessProfile';
import SlotPage from './componenets/SlotPage';
import PaymentPage from './componenets/PaymentPage';

function App() {
  return (
    <Router>
      <div className="App">
        {/* Add the Navbar to all pages */}
        <Navbar />

        <Routes>
          {/* Define your routes here */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/businesses/type/:businessType" element={<BusinessList />} />
          <Route path="/business/:id" element={<BusinessProfile />} />
          <Route path="/business/:id/slots" element={<SlotPage />} />
          <Route path="/payment" element={<PaymentPage/>}/>
          <Route element={<PrivateRoute />}>
  {/* These paths are only accessed after redirect by PrivateRoute */}
  <Route 
    path="/dashboard" 
    element={localStorage.getItem('role') === 'user' ? <Dashboard /> : <Navigate to="/business-dashboard" />} 
  />
  <Route 
    path="/business-dashboard" 
    element={localStorage.getItem('role') === 'business' ? <BusinessDashboard /> : <Navigate to="/dashboard" />} 
  />
</Route>
        </Routes>
        <Footer/>
      </div>
    </Router>
  );
}

export default App;
