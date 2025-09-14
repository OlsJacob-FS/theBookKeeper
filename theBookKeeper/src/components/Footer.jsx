import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Footer({ showLinks = true }) {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };
  return (
    <footer className="bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 mt-auto">
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-slate-600 dark:text-slate-300">
            <p>&copy; 2025 Jacob Ols. All rights reserved.</p>
          </div>
          
          {showLinks && (
            <div className="flex items-center space-x-8">
              <a
                href="/dashboard"
                className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-white transition-colors duration-200"
              >
                Dashboard
              </a>
              <a
                href="/bookshelf"
                className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-white transition-colors duration-200"
              >
                Bookshelf
              </a>
              <a
                href="/profile"
                className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-white transition-colors duration-200"
              >
                Profile
              </a>
              <button
                onClick={handleLogout}
                className="text-red-500 hover:text-red-600 transition-colors duration-200 focus:outline-none"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}
