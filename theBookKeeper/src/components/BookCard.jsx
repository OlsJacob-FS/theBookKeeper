import React from "react";
import { Link } from "react-router-dom";

function BookCard({ book }) {
  return (
    <Link to={`/book/${book.id}`} className="px-2 flex-none w-28 sm:w-32">
      <div className="px-2 flex-none w-28 sm:w-32">
        <div
          className="bg-red-900 aspect-[2/3] rounded-md shadow-md hover:shadow-lg transition-all cursor-pointer"
          style={{
            backgroundImage: book.volumeInfo.imageLinks?.thumbnail
              ? `url(${book.volumeInfo.imageLinks.thumbnail})`
              : undefined,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="opacity-0 hover:opacity-100 h-full w-full bg-black/70 text-white p-2 transition-opacity duration-300 flex items-end">
            <p className="text-xs font-medium">{book.volumeInfo.title}</p>
          </div>
        </div>
        <p className="text-white text-xs mt-1 truncate">
          {book.volumeInfo.authors?.[0] || "Unknown Author"}
        </p>
      </div>
    </Link>
  );
}

export default BookCard;
