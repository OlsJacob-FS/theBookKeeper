import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";

import BookshelfView from "../components/bookShelf/BookShelfView";
import { loadBookshelves } from "../components/bookShelf/ShelfLoader";
import { createBookHandlers } from "../components/bookShelf/BookCollection";
import {
  shelfId,
  recommendedBooks,
} from "../components/bookShelf/ShelfConstants";

function BookShelf() {
  const [bookshelves, setBookshelves] = useState([]);
  const [shelfBooks, setShelfBooks] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setActionMessage] = useState(null);
  const [sessionExpired, setSessionExpired] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("googleBooksToken");
    if (token) {
      handleLoadBookshelves(token);
    } else {
      setSessionExpired(true);
      setLoading(false);
      setError("Your session has expired. Please log in again.");
    }
  }, []);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setActionMessage(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleLoadBookshelves = (token) => {
    loadBookshelves(
      token,
      shelfId,
      (fetchedShelves) => {
        setBookshelves(fetchedShelves);
      },
      (shelfId, books) => {
        setShelfBooks((prev) => ({
          ...prev,
          [shelfId]: books,
        }));

        setBookshelves((prevShelves) =>
          prevShelves.map((shelf) =>
            shelf.id.toString() === shelfId
              ? { ...shelf, volumeCount: books.length }
              : shelf
          )
        );
      },
      (errorMessage) => {
        if (
          errorMessage.includes("authorization") ||
          errorMessage.includes("token") ||
          errorMessage.includes("expired") ||
          errorMessage.includes("login")
        ) {
          setSessionExpired(true);
        }
        setError(errorMessage);
      },
      () => {
        setLoading(false);
      }
    );
  };

  const getShelfName = (shelfId) => {
    const shelf = bookshelves.find((s) => s.id.toString() === shelfId);
    return shelf ? shelf.title : "collection";
  };

  const reloadPage = () => {
    window.location.reload();
  };

  const handleLogout = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
      localStorage.removeItem("authToken");
      localStorage.removeItem("googleBooksToken");
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const redirectToLogin = () => {
    handleLogout();
  };

  const token = localStorage.getItem("googleBooksToken");
  const {
    handleAddToHaveRead,
    handleAddToReadingNow,
    handleAddToToRead,
    handleAddToFavorites,
    handleRemoveBook,
  } = createBookHandlers(
    shelfBooks,
    token,
    setActionMessage,
    setActionMessage,
    reloadPage
  );

  if (sessionExpired) {
    return (
      <div className="min-h-screen w-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="bg-white dark:bg-slate-800 p-8 rounded-xl w-full max-w-md text-center shadow-2xl border border-slate-200 dark:border-slate-700">
          <h2 className="text-2xl text-slate-800 dark:text-white font-bold mb-4">
            Session Expired
          </h2>
          <p className="text-slate-600 dark:text-slate-300 mb-6">
            Your session has expired or you are not logged in. Please log in
            again to access your bookshelf.
          </p>
          <button
            onClick={redirectToLogin}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-full focus:outline-none"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <BookshelfView
      bookshelves={bookshelves}
      shelfBooks={shelfBooks}
      loading={loading}
      error={error}
      message={message}
      handleAddToFavorites={handleAddToFavorites}
      handleAddToToRead={handleAddToToRead}
      handleAddToHaveRead={handleAddToHaveRead}
      handleAddToReadingNow={handleAddToReadingNow}
      handleRemoveBook={handleRemoveBook}
      navigate={navigate}
      recommendedBooks={recommendedBooks}
    />
  );
}

export default BookShelf;
