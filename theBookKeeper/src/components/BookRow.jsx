import React from "react";
import BookCard from "./BookCard";

function BookRow({ genre }) {
  return (
    <div id={genre.id} className="mb-4">
      <h2 className="text-white text-2xl font-bold mb-4">{genre.name}</h2>
      <div className="flex overflow-x-auto pb-4 -mx-2 scrollbar-hide">
        {genre.books.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </div>
  );
}

export default BookRow;
