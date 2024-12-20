// // src/components/PrivateRoute.jsx
// import React from 'react';
// import { Navigate, Outlet } from 'react-router-dom';

// const PrivateRoute = () => {
//   // Check if the user is logged in (check token in localStorage or state)
//   const isLoggedIn = localStorage.getItem('token') ? true : false;

//   // If not logged in, redirect to the login page
//   if (!isLoggedIn) {
//     return <Navigate to="/login" />;
//   }

//   // If logged in, render the protected route's component
//   return <Outlet />;
// };

// export default PrivateRoute;

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
  // Check if the user is logged in by verifying the token
  const token = localStorage.getItem('token');
  const isLoggedIn = !!token;

  // Fetch the user's role, defaulting to "user" if not found
  const userRole = localStorage.getItem('role') || 'user';

  // If not logged in, redirect to the login page
  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  // If logged in, render the nested routes
  return <Outlet />;
};

export default PrivateRoute;






