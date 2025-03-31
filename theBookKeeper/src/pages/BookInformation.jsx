import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

function BookInformation() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setActionMessage] = useState(null);
  const API_KEY = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY;

  // Google Books shelf IDs
  const TO_READ_SHELF_ID = "2";
  const HAVE_READ_SHELF_ID = "4";

  useEffect(() => {
    const fetchBookDetails = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `https://www.googleapis.com/books/v1/volumes/${id}`,
          {
            params: {
              key: API_KEY,
            },
          }
        );
        setBook(response.data);
      } catch (error) {
        console.error("Error fetching book details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [id, API_KEY]);
  console.log("Book details", book);

  function cleanDescription(description) {
    if (!description) return "No description available.";

    // Remove HTML tags
    let cleanText = description.replace(/<[^>]*>/g, "");

    // Remove special characters, but keep basic punctuation
    cleanText = cleanText.replace(/[^a-zA-Z0-9\s.,!?'-]/g, "");

    // Remove extra whitespace
    cleanText = cleanText.replace(/\s+/g, " ").trim();

    return cleanText;
  }

  const addBookToShelf = async (shelfId, shelfName) => {
    // Get the Google token from localStorage
    const token = localStorage.getItem("googleBooksToken");

    if (!token) {
      setActionMessage({
        type: "error",
        text: "Google Books access token not found. Please log in again.",
      });
      return;
    }

    try {
      setActionLoading(true);
      setActionMessage(null);

      console.log(
        `Adding book ${id} to ${shelfName} (Shelf ID: ${shelfId})...`
      );

      await axios.post(
        `https://www.googleapis.com/books/v1/mylibrary/bookshelves/${shelfId}/addVolume`,
        null, // No request body
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            volumeId: id,
          },
        }
      );

      setActionMessage({
        type: "success",
        text: `Book added to ${shelfName} successfully!`,
      });
      console.log(`Book added to ${shelfName} successfully`);
    } catch (error) {
      console.error(`Error adding book to ${shelfName}:`, error);
      let errorMessage = `Failed to add book to ${shelfName}.`;

      if (error.response?.data?.error?.message) {
        // If the book is already in the collection
        if (error.response.data.error.message.includes("already exists")) {
          errorMessage = `This book is already in your ${shelfName} collection.`;
        } else {
          errorMessage += ` ${error.response.data.error.message}`;
        }
      }

      setActionMessage({
        type: "error",
        text: errorMessage,
      });

      // If authentication error
      if (
        error.response &&
        (error.response.status === 401 || error.response.status === 403)
      ) {
        console.error("Authentication error, token might be expired");
        localStorage.removeItem("googleBooksToken");
        setActionMessage({
          type: "error",
          text: "Your Google Books session has expired. Please log out and log in again.",
        });
      }
    } finally {
      setActionLoading(false);

      // Clear success message after 5 seconds
      if (message?.type === "success") {
        setTimeout(() => setActionMessage(null), 5000);
      }
    }
  };

  const handleAddToToRead = () => {
    addBookToShelf(TO_READ_SHELF_ID, "To Read");
  };

  const handleAddToHaveRead = () => {
    addBookToShelf(HAVE_READ_SHELF_ID, "Have Read");
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 w-screen min-h-screen">
      <div className="bg-black/60">
        <div className="container mx-auto p-4 min-h-screen w-screen">
          {loading && <div className="text-center text-white">Loading...</div>}
          {book && (
            <div className="bg-black/40 p-8 rounded-xl shadow-md max-w-4xl mx-auto">
              {message && (
                <div
                  className={`mb-4 p-3 rounded ${
                    message.type === "success"
                      ? "bg-green-500/40 text-white"
                      : "bg-red-500/40 text-white"
                  }`}
                >
                  {message.text}
                </div>
              )}

              <div className="flex flex-col md:flex-row">
                {book.volumeInfo.imageLinks && (
                  <img
                    src={book.volumeInfo.imageLinks.thumbnail.replace(
                      "http:",
                      "https:"
                    )}
                    alt={book.volumeInfo.title}
                    className="w-48 h-56 mb-4 md:mb-0 mr-4"
                  />
                )}

                <div className="text-white">
                  <h1 className="text-3xl font-bold mb-4">
                    Title: {book.volumeInfo.title}
                  </h1>
                  <p className="text-lg font-semibold mb-4">
                    Author(s):{" "}
                    {book.volumeInfo.authors
                      ? book.volumeInfo.authors.join(", ")
                      : "Unknown"}
                  </p>
                  <p className="text-lg font-semibold mb-4">
                    Published: {book.volumeInfo.publishedDate || "Unknown"}
                  </p>

                  <p className="text-lg font-semibold mb-4">
                    Description: {cleanDescription(book.volumeInfo.description)}
                  </p>

                  <div className="flex flex-col md:flex-row justify-between items-center mt-4">
                    <div className="place-content-start">
                      <Link
                        to={book.volumeInfo.previewLink}
                        target="_blank"
                        className="text-blue-500 underline mt-4"
                      >
                        View on Google Books
                      </Link>
                    </div>
                    <div className="flex flex-col space-y-2 md:space-y-0 md:flex-row md:space-x-2 mt-4 md:mt-0">
                      <button
                        className="bg-blue-600 w-40 rounded-full py-2 text-white hover:bg-blue-700 disabled:opacity-50"
                        onClick={handleAddToToRead}
                        disabled={actionLoading}
                      >
                        {actionLoading ? "Adding..." : "Add to To Read"}
                      </button>
                      <button
                        className="bg-blue-600 w-40 rounded-full py-2 text-white hover:bg-green-700 disabled:opacity-50"
                        onClick={handleAddToHaveRead}
                        disabled={actionLoading}
                      >
                        Add to Have Read
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BookInformation;
