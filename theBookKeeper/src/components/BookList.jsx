import React from "react";

function BookList({ genres }) {
  return (
    <div className="rounded-lg w-full text-center sm:text-left">
      <h2 className="text-xl text-white font-bold mb-4">Discover by genre</h2>
      <div className="flex flex-wrap justify-center sm:justify-start">
        <div className="w-full sm:w-1/2 flex justify-center sm:justify-start">
          <ul className="space-y-2 text-lg font-bold">
            {genres.slice(0, 5).map((genre) => (
              <li
                key={genre.id}
                className="text-white hover:text-blue-400 cursor-pointer"
              >
                <a href={`#${genre.id}`}>{genre.name}</a>
              </li>
            ))}
          </ul>
        </div>
        {genres.length > 5 && (
          <div className="w-full sm:w-1/2 flex justify-center sm:justify-start mt-4 sm:mt-0">
            <ul className="space-y-2 text-lg font-bold">
              {genres.slice(5, 10).map((genre) => (
                <li
                  key={genre.id}
                  className="text-white hover:text-blue-400 cursor-pointer"
                >
                  <a href={`#${genre.id}`}>{genre.name}</a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default BookList;
