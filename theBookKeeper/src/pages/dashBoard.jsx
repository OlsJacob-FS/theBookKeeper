import React, { useState, useEffect } from "react";
import BookList from "../components/BookList";
import SearchBar from "../components/SearchBar";
import BookRow from "../components/BookRow";
import BookGrid from "../components/BookGrid";
import LoadScreen from "../components/LoadScreen";
import { fetchBooksByGenre, searchBooks } from "../components/BookFetch";
import { Helmet } from "react-helmet-async";

function Dashboard() {
  const [genres, setGenres] = useState([
    { id: "fantasy", name: "Fantasy", books: [] },
    { id: "romance", name: "Romance", books: [] },
    { id: "mystery", name: "Mystery", books: [] },
    { id: "horror", name: "Horror", books: [] },
    { id: "manga", name: "Manga", books: [] },
  ]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);

  useEffect(() => {
    const loadAllBooks = async () => {
      setLoading(true);
      try {
        // Process all genres concurrently
        const bookPromises = genres.map((genre) => fetchBooksByGenre(genre.id));
        const booksResults = await Promise.all(bookPromises);

        const updatedGenres = genres.map((genre, index) => ({
          ...genre,
          books: booksResults[index],
        }));

        // Update state once with all fetched books
        setGenres(updatedGenres);
      } catch (error) {
        console.error("Error fetching books:", error);
      } finally {
        setLoading(false);
      }
    };

    loadAllBooks();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setIsSearching(true);
    setShowSearchResults(true);

    try {
      const results = await searchBooks(searchTerm);
      setSearchResults(results);
    } catch (error) {
      console.error("Error searching books:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
    setShowSearchResults(false);
  };

  return (
    <>
      <Helmet>
        <title>
          The Bookkeeper | Track, Discover, and Save Your Reading Journey
        </title>
        <meta
          name="description"
          content="Discover new reads, manage your TBR list, and track your favorite books with The Bookkeeper — your ultimate digital book collection."
        />
        <meta
          name="keywords"
          content="book tracker, reading list app, fantasy book organizer, digital bookshelf, manage books online"
        />
        <meta name="author" content="The Bookkeeper Team" />
        <meta
          property="og:title"
          content="The Bookkeeper | Track, Discover, and Save Your Reading Journey"
        />
        <meta
          property="og:description"
          content="Discover new reads, manage your TBR list, and track your favorite books with The Bookkeeper."
        />
        <meta property="og:type" content="website" />
      </Helmet>
      <div className="w-screen min-h-screen bg-gradient-to-br from-black via-blue-900 to-cyan-800">
        <div className="w-full min-h-screen bg-black/40 p-6">
          <div className="flex flex-wrap flex-col-reverse md:flex-row">
            {!showSearchResults && (
              <div className="w-full md:w-1/4 p-2 md:p-6">
                <BookList genres={genres} />
              </div>
            )}

            <div
              className={`w-full ${
                !showSearchResults ? "md:w-2/4" : ""
              } p-2 md:p-6`}
            >
              <SearchBar
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                handleSearch={handleSearch}
                showSearchResults={showSearchResults}
                clearSearch={clearSearch}
              />
            </div>
          </div>

          {/* Book rows */}
          <div className="mt-8 space-y-12">
            {loading && !showSearchResults ? (
              <LoadScreen message="Loading books..." />
            ) : isSearching ? (
              <LoadScreen message="Searching books..." />
            ) : showSearchResults ? (
              <BookGrid searchTerm={searchTerm} searchResults={searchResults} />
            ) : (
              genres.map((genre) => <BookRow key={genre.id} genre={genre} />)
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
