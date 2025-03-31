import React from "react";
import { useState, useEffect } from "react";
import {
  signInWithPopup,
  onAuthStateChanged,
  GoogleAuthProvider,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth, googleProvider } from "../firebase";
import "../index.css";

function Login() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);

      if (currentUser) {
        navigate("/dashboard");
      }
    });

    // Clean up subscription
    return () => unsubscribe();
  }, [navigate]);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);

    try {
      // Add Google Books API scope to the provider
      googleProvider.addScope("https://www.googleapis.com/auth/books");

      const result = await signInWithPopup(auth, googleProvider);

      // Get the user credentials including the ID token
      const user = result.user;
      const idToken = await user.getIdToken();

      // Get and store the Google OAuth access token that has the Books API scope
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const googleAccessToken = credential.accessToken;
      localStorage.setItem("googleBooksToken", googleAccessToken);

      // Send the token to your backend for verification and user creation/update
      const API_URL = import.meta.env.VITE_API_URL;

      const response = await fetch(`${API_URL}/auth/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
      });
      if (!response.ok) {
        throw new Error("Backend verification failed");
      }

      localStorage.setItem("authToken", idToken);
      navigate("/dashboard");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-amber-900 via-slate-800 to-emerald-900">
      <div className="flex flex-col items-center justify-center text-center min-h-screen w-screen mx-auto p-4">
        <div className="border border-black  p-6 md:p-12 lg:p-24 rounded-xl shadow-md w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg mx-auto">
          <h5 className="text-2xl sm:text-3xl md:text-4xl text-white font-bold mb-6 md:mb-10">
            Log in to find your next adventure
          </h5>
          {error && (
            <div className="bg-red-500/40 p-3 rounded mb-4 text-white">
              <p>{error}</p>
            </div>
          )}
          <button
            className="bg-blue-300 hover:bg-blue-400 text-black text-lg sm:text-xl font-bold py-2 px-6 rounded-full focus:outline-none transition-colors"
            onClick={handleGoogleLogin}
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign in with Google"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
