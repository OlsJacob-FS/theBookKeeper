import React from "react";

function BookList({ genres }) {
  return (
    <div className="bg-slate-800/30 backdrop-blur-sm rounded-lg p-4 lg:p-6">
      <h2 className="text-white text-lg sm:text-xl font-bold mb-4 text-center lg:text-left">
        Discover by genre
      </h2>
      
      {/* Mobile: Grid layout */}
      <div className="lg:hidden grid grid-cols-2 gap-3">
        {genres.map((genre) => (
          <a
            key={genre.id}
            href={`#${genre.id}`}
            className="text-white hover:text-blue-400 hover:bg-blue-400/10 cursor-pointer p-2 rounded-lg transition-all duration-200 text-center text-sm font-medium"
          >
            {genre.name}
          </a>
        ))}
      </div>

      {/* Desktop: Vertical list */}
      <div className="hidden lg:block">
        <ul className="space-y-2">
          {genres.map((genre) => (
            <li key={genre.id}>
              <a
                href={`#${genre.id}`}
                className="text-white hover:text-blue-400 hover:bg-blue-400/10 cursor-pointer block p-2 rounded-lg transition-all duration-200 text-sm font-medium"
              >
                {genre.name}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default BookList;
