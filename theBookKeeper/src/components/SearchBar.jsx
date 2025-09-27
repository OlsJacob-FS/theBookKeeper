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
      <h3 className="text-white text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">
        Find your next adventure
      </h3>
      <form
        onSubmit={handleSearch}
        className="relative w-full max-w-md sm:max-w-lg lg:max-w-xl mx-auto"
      >
        <div className="relative">
          <span className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-600">
            <FaBookAtlas className="w-4 h-4 sm:w-5 sm:h-5" />
          </span>
          <input
            type="text"
            className="w-full bg-white text-black py-2 sm:py-3 px-3 sm:px-4 rounded-full pl-10 sm:pl-12 pr-16 sm:pr-20 text-sm sm:text-base"
            placeholder="Search by Title or Author"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              type="button"
              onClick={handleClearText}
              className="absolute right-12 sm:right-16 lg:right-20 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-700 focus:outline-none"
              aria-label="Clear search text"
            >
              <IoMdClose size={16} className="sm:w-5 sm:h-5" />
            </button>
          )}
          <button
            type="submit"
            className="absolute right-2 sm:right-3 lg:right-4 top-1/2 transform -translate-y-1/2 text-white py-1 px-2 sm:px-3 bg-blue-600 rounded-full focus:outline-none text-xs sm:text-sm"
          >
            Search
          </button>
        </div>
        {showSearchResults && (
          <button
            type="button"
            onClick={clearSearch}
            className="mt-3 sm:mt-4 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 focus:outline-none text-sm sm:text-base"
          >
            Back to Genres
          </button>
        )}
      </form>
    </div>
  );
}

export default SearchBar;
