import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { Helmet } from "react-helmet-async";
import { 
  FiBook, 
  FiHeart, 
  FiClock, 
  FiCheckCircle, 
  FiBookOpen,
  FiSearch,
  FiPlus,
} from "react-icons/fi";

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
  const [activeShelf, setActiveShelf] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
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

  // Get total book count across all shelves
  const getTotalBooks = () => {
    return Object.values(shelfBooks).reduce((total, books) => total + books.length, 0);
  };

  // Get reading statistics
  const getReadingStats = () => {
    const haveRead = shelfBooks[shelfId.haveRead]?.length || 0;
    const readingNow = shelfBooks[shelfId.readingNow]?.length || 0;
    const toRead = shelfBooks[shelfId.toRead]?.length || 0;
    const favorites = shelfBooks[shelfId.favorites]?.length || 0;
    
    return { haveRead, readingNow, toRead, favorites };
  };

  // Filter books based on search term and active shelf
  const getFilteredBooks = () => {
    let allBooks = [];
    
    if (activeShelf === 'all') {
      Object.values(shelfBooks).forEach(books => {
        allBooks = [...allBooks, ...books];
      });
    } else {
      allBooks = shelfBooks[activeShelf] || [];
    }
    
    if (searchTerm) {
      allBooks = allBooks.filter(book => {
        // Safe title handling
        let title = '';
        if (typeof book.volumeInfo?.title === 'string') {
          title = book.volumeInfo.title;
        } else if (typeof book.volumeInfo?.title === 'object' && book.volumeInfo?.title?.text) {
          title = book.volumeInfo.title.text;
        }
        
        // Safe authors handling
        let authors = '';
        if (Array.isArray(book.volumeInfo?.authors)) {
          authors = book.volumeInfo.authors.map(author => {
            if (typeof author === 'string') {
              return author;
            } else if (typeof author === 'object' && author !== null) {
              return author.name || author.text || '';
            }
            return '';
          }).join(' ');
        }
        
        return title.toLowerCase().includes(searchTerm.toLowerCase()) ||
               authors.toLowerCase().includes(searchTerm.toLowerCase());
      });
    }
    
    return allBooks;
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
  const stats = getReadingStats();
  const filteredBooks = getFilteredBooks();

  // Create handlers with current shelfBooks state
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
    <>
      <Helmet>
        <title>My Bookshelf | The Bookkeeper</title>
        <meta name="description" content="Manage your personal book collection, track reading progress, and organize your favorite books." />
      </Helmet>
      
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Clean Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  My Bookshelf
                </h1>
                <p className="mt-1 text-gray-600 dark:text-gray-400">
                  {getTotalBooks()} books in your collection
                </p>
              </div>
              
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-sm"
              >
                <FiPlus className="w-5 h-5 mr-2" />
                Add Books
              </button>
            </div>
          </div>

          {/* Simple Search Bar */}
          <div className="mb-8">
            <div className="relative max-w-md">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search your books..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
              />
            </div>
          </div>

          {/* Quick Stats */}
          <div className="mb-8">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="text-2xl font-bold text-blue-600">{stats.haveRead}</div>
                <div className="text-sm text-gray-500">Books Read</div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="text-2xl font-bold text-green-600">{stats.readingNow}</div>
                <div className="text-sm text-gray-500">Currently Reading</div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="text-2xl font-bold text-orange-600">{stats.toRead}</div>
                <div className="text-sm text-gray-500">Want to Read</div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="text-2xl font-bold text-red-600">{stats.favorites}</div>
                <div className="text-sm text-gray-500">Favorites</div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400">Loading your collection...</p>
              </div>
            </div>
          ) : error ? (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
              <div className="flex items-center">
                <div className="text-red-600 dark:text-red-400">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-red-800 dark:text-red-200 font-medium">Error</h3>
                  <p className="text-red-700 dark:text-red-300 mt-1">{error}</p>
                </div>
              </div>
            </div>
          ) : filteredBooks.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                <FiBook className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                {searchTerm ? 'No books found' : 'Your collection is empty'}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {searchTerm 
                  ? `No books match "${searchTerm}". Try adjusting your search.`
                  : 'Start building your collection by adding books from our recommendations.'
                }
              </p>
              {!searchTerm && (
                <button
                  onClick={() => navigate('/dashboard')}
                  className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  <FiPlus className="w-5 h-5 mr-2" />
                  Discover Books
                </button>
              )}
            </div>
          ) : (
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
              filteredBooks={filteredBooks}
              viewMode={viewMode}
              activeShelf={activeShelf}
            />
          )}

          {/* Toast Messages */}
          {message && (
            <div className="fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50">
              {message}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default BookShelf;
