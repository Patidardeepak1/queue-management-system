import { app } from '../config/firebase.js'; 
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import BASE_URL from '../config/config.js';
import React from 'react';
function OAuth() {
  const navigate = useNavigate();

  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);

      const result = await signInWithPopup(auth, provider);

      const res = await axios.post(`${BASE_URL}/api/users/auth/google`, {
        name: result.user.displayName,
        email: result.user.email,
      });

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role || 'user');

      navigate('/');
      window.location.reload();
    } catch (error) {
      console.log('Could not sign in with Google', error);
    }
  };

  return (
    <button
      onClick={handleGoogleClick}
      type="button"
      className="mt-4 w-full bg-red-600 text-white p-3 rounded-md hover:bg-red-700 transition duration-200"
    >
      Continue with Google
    </button>
  );
}

export default OAuth;
