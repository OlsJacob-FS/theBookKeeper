import React, { useState } from "react";
import { getAuth, signOut } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";

function NavBar({ showLinks = true }) {
  const navigate = useNavigate();
  const auth = getAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("authToken");
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="bg-gray-400 p-4 fixed top-0 left-0 w-full z-50">
      <div className="container mx-auto flex items-center justify-between">
        <div className="left-2">
          {showLinks === false && (
            <img src="images/logo.png" alt="logo" className="w-56 h-12" />
          )}
          {/* <Link to="/dashboard"> */}
        </div>
        {showLinks && (
          <>
            <div className="left-2">
              <Link to="/dashboard">
                <img src="images/logo.png" alt="logo" className="w-56 h-12" />
              </Link>
            </div>
            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-6 ml-auto">
              <Link
                to="/dashboard"
                className="text-white hover:text-blue-300 transition"
              >
                Dashboard
              </Link>
              <Link
                to="/bookshelf"
                className="text-white hover:text-blue-300 transition"
              >
                Bookshelf
              </Link>
              <Link
                to="/profile"
                className="text-white hover:text-blue-300 transition"
              >
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="text-white hover:text-blue-300 transition border-none focus:outline-none"
              >
                Sign Out
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={toggleMenu}
                className="text-white focus:outline-none"
                aria-label="Toggle menu"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {menuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>
          </>
        )}
      </div>

      {/* Mobile Menu Dropdown */}
      {showLinks && menuOpen && (
        <div className="md:hidden absolute right-0 mt-4 bg-gray-400 p-4 rounded-bl-lg shadow-lg">
          <div className="flex flex-col space-y-4">
            <Link
              to="/dashboard"
              className="text-white hover:text-blue-300 transition"
              onClick={() => setMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              to="/bookshelf"
              className="text-white hover:text-blue-300 transition"
              onClick={() => setMenuOpen(false)}
            >
              Bookshelf
            </Link>
            <Link
              to="/profile"
              className="text-white hover:text-blue-300 transition"
              onClick={() => setMenuOpen(false)}
            >
              Profile
            </Link>
            <button
              onClick={() => {
                handleLogout();
                setMenuOpen(false);
              }}
              className="text-white hover:text-blue-300 transition border-none focus:outline-none text-left"
            >
              Sign Out
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

export default NavBar;
