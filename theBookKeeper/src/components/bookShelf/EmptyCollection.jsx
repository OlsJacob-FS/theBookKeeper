import React from "react";
import { Link } from "react-router-dom";

const EmptyCollection = () => {
  return (
    <div className="text-white text-center p-8 bg-gray-700/70 rounded-lg shadow-lg">
      <p className="text-xl mb-4">Your collection is empty</p>
      <p className="text-gray-300 mb-6">
        Add books to your Google Books library to see them here
      </p>
      <Link
        to="/"
        className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded inline-block"
      >
        Discover Books
      </Link>
    </div>
  );
};

export default EmptyCollection;
