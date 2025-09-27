import React, { useState, useEffect } from "react";
import {
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth, googleProvider } from "../firebase";
import { FiBookOpen, FiArrowRight } from "react-icons/fi";
import "../index.css";

function Login() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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
    <div className="min-h-screen w-screen bg-slate-50 dark:bg-slate-900 flex items-center place-items-center mx-auto justify-center p-4">
      <div className="max-w-md w-full align-center justify-center place-content-center">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="bg-blue-600 p-4 rounded-2xl shadow-lg">
              <FiBookOpen className="w-16 h-16 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-slate-800 dark:text-white mb-4">
            The BookKeeper
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-lg">
            Track, discover, and save your reading journey
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold text-slate-800 dark:text-white mb-2">
              Welcome Back
            </h2>
            <p className="text-slate-600 dark:text-slate-300">
              Sign in to continue your reading adventure
            </p>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500/30 p-4 rounded-lg mb-6">
              <p className="text-red-200 text-sm">{error}</p>
            </div>
          )}

          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Signing in...</span>
              </div>
            ) : (
              <>
                <span>Continue with Google</span>
                <FiArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <div className="mt-6 text-center">
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              By signing in, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="mt-12 grid grid-cols-1 gap-4 text-center">
          <div className="text-slate-600 dark:text-slate-300">
            <h3 className="font-semibold text-slate-800 dark:text-white mb-2">📚 Discover Books</h3>
            <p className="text-sm">Find your next favorite read from our curated collection</p>
          </div>
          <div className="text-slate-600 dark:text-slate-300">
            <h3 className="font-semibold text-slate-800 dark:text-white mb-2">📖 Track Progress</h3>
            <p className="text-sm">Keep track of books you've read and want to read</p>
          </div>
          <div className="text-slate-600 dark:text-slate-300">
            <h3 className="font-semibold text-slate-800 dark:text-white mb-2">⭐ Rate & Review</h3>
            <p className="text-sm">Share your thoughts and discover new recommendations</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
