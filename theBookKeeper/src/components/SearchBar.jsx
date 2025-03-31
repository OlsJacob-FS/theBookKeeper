import React from "react";
import { FaBookAtlas } from "react-icons/fa6";
import { IoMdClose } from "react-icons/io";

function SearchBar({
  searchTerm,
  setSearchTerm,
  handleSearch,
  showSearchResults,
  clearSearch,
}) {
  const handleClearText = () => {
    setSearchTerm("");
  };

  return (
    <div className="text-center">
      <h3 className="text-white text-3xl font-bold mb-6">
        Find your next adventure
      </h3>
      <form
        onSubmit={handleSearch}
        className="relative w-full max-w-xl mx-auto"
      >
        <div className="relative">
          <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-600">
            <FaBookAtlas />
          </span>
          <input
            type="text"
            className="w-full bg-white text-black py-3 px-4 rounded-full pl-12 pr-20"
            placeholder="Search by Title or Author"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              type="button"
              onClick={handleClearText}
              className="absolute right-24 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-700 focus:outline-none"
              aria-label="Clear search text"
            >
              <IoMdClose size={18} />
            </button>
          )}
          <button
            type="submit"
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white py-1 px-2 bg-blue-600 rounded-full focus:outline-none"
          >
            Search
          </button>
        </div>
        {showSearchResults && (
          <button
            type="button"
            onClick={clearSearch}
            className="mt-2 ml-2 px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-gray-700 focus:outline-none"
          >
            Back to Genres
          </button>
        )}
      </form>
    </div>
  );
}

export default SearchBar;
