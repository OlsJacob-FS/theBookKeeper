import React from "react";
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
export default function Footer({ showLinks = true }) {
  const navigate = useNavigate();
  const auth = getAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("authToken");
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };
  return (
    <div className=" bg-gray-400 p-4">
      <div className="container ml-10 items-center flex w-screen">
        <p>Jacob Ols @2025</p>
        {showLinks && (
          <div className="mx-auto flex items-center space-x-6 p-4 ">
            <a
              href="/dashboard"
              className="text-white hover:text-blue-300 transition"
            >
              Dashboard
            </a>
            <a
              href="/bookshelf"
              className="text-white hover:text-blue-300 transition"
            >
              Bookshelf
            </a>
            <a
              href="/profile"
              className="text-white hover:text-blue-300 transition"
            >
              Profile
            </a>
            <button
              onClick={handleLogout}
              className="text-white hover:text-blue-300 transition border-hidden focus:outline-none"
            >
              Sign Out
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
