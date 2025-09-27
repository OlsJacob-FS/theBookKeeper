import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { FiMenu, FiX, FiBookOpen, FiUser, FiHome } from "react-icons/fi";

function NavBar({ showLinks = true }) {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 p-5 fixed top-0 left-0 w-full z-50 shadow-lg">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center">
          {showLinks === false ? (
            <img src="/images/logo.png" alt="The BookKeeper" className="w-48 h-10" />
          ) : (
            <Link to="/dashboard" className="flex items-center space-x-2">
              <img src="/images/logo.png" alt="The BookKeeper" className="w-48 h-10" />
            </Link>
          )}
        </div>
        
        {showLinks && (
          <>
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <Link
                to="/dashboard"
                className="flex items-center space-x-2 text-slate-600 dark:text-slate-200 hover:text-blue-600 dark:hover:text-white transition-colors duration-200 font-medium"
              >
                <FiHome className="w-4 h-4" />
                <span>Dashboard</span>
              </Link>
              <Link
                to="/bookshelf"
                className="flex items-center space-x-2 text-slate-600 dark:text-slate-200 hover:text-blue-600 dark:hover:text-white transition-colors duration-200 font-medium"
              >
                <FiBookOpen className="w-4 h-4" />
                <span>Bookshelf</span>
              </Link>
              <Link
                to="/profile"
                className="flex items-center space-x-2 text-slate-600 dark:text-slate-200 hover:text-blue-600 dark:hover:text-white transition-colors duration-200 font-medium"
              >
                <FiUser className="w-4 h-4" />
                <span>Profile</span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-3 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 px-4 py-3 rounded-lg transition-colors duration-200 text-left"
              >
                Sign Out
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={toggleMenu}
                className="text-slate-600 dark:text-slate-200 hover:text-blue-600 dark:hover:text-white focus:outline-none p-2"
                aria-label="Toggle menu"
              >
                {menuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
              </button>
            </div>
          </>
        )}
      </div>

      {/* Mobile Menu Dropdown */}
      {showLinks && menuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 shadow-lg">
          <div className="flex flex-col space-y-1 p-4">
            <Link
              to="/dashboard"
              className="flex items-center space-x-3 text-slate-600 dark:text-slate-200 hover:text-blue-600 dark:hover:text-white hover:bg-blue-50 dark:hover:bg-slate-700 px-4 py-3 rounded-lg transition-colors duration-200"
              onClick={() => setMenuOpen(false)}
            >
              <FiHome className="w-5 h-5" />
              <span>Dashboard</span>
            </Link>
            <Link
              to="/bookshelf"
              className="flex items-center space-x-3 text-slate-600 dark:text-slate-200 hover:text-blue-600 dark:hover:text-white hover:bg-blue-50 dark:hover:bg-slate-700 px-4 py-3 rounded-lg transition-colors duration-200"
              onClick={() => setMenuOpen(false)}
            >
              <FiBookOpen className="w-5 h-5" />
              <span>Bookshelf</span>
            </Link>
            <Link
              to="/profile"
              className="flex items-center space-x-3 text-slate-600 dark:text-slate-200 hover:text-blue-600 dark:hover:text-white hover:bg-blue-50 dark:hover:bg-slate-700 px-4 py-3 rounded-lg transition-colors duration-200"
              onClick={() => setMenuOpen(false)}
            >
              <FiUser className="w-5 h-5" />
              <span>Profile</span>
            </Link>
            <button
              onClick={() => {
                handleLogout();
                setMenuOpen(false);
              }}
              className="flex items-center space-x-3 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 px-4 py-3 rounded-lg transition-colors duration-200 text-left"
            >
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

export default NavBar;
