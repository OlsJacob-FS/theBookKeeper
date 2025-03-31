import React from "react";
import BookCard from "./BookCard";

function BookGrid({ searchTerm, searchResults }) {
  return (
    <div>
      <h2 className="text-white text-2xl font-bold mb-4">
        Search Results for "{searchTerm}"
      </h2>
      {searchResults.length > 0 ? (
        <div className="flex flex-wrap gap-4">
          {searchResults.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      ) : (
        <p className="text-white">
          No results found. Try a different search term.
        </p>
      )}
    </div>
  );
}

export default BookGrid;
