import React from "react";
import BookItem from "./BookItem";

const BookRow = ({
  shelf,
  books,
  onAddToFavorites,
  onAddToToRead,
  onAddToHaveRead,
  onAddToReadingNow,
  onRemoveBook,
  isFavoritesShelf,
  isToReadShelf,
  isReadingNowShelf,
  isHaveReadShelf,
  isBooksForYouShelf,
  navigate,
}) => {
  return (
    <div className="mb-8">
      <h2 className="text-white text-2xl font-bold mb-2">{shelf.title}</h2>

      <div className="rounded-lg p-4 shadow-lg">
        <div className="overflow-x-auto pb-2">
          <div className="flex -mx-2">
            {books.map((book) => (
              <BookItem
                key={book.id}
                book={book}
                shelfId={shelf.id}
                onAddToFavorites={onAddToFavorites}
                onAddToToRead={onAddToToRead}
                onAddToHaveRead={onAddToHaveRead}
                onAddToReadingNow={onAddToReadingNow}
                onRemoveBook={onRemoveBook}
                isFavoritesShelf={isFavoritesShelf}
                isToReadShelf={isToReadShelf}
                isReadingNowShelf={isReadingNowShelf}
                isHaveReadShelf={isHaveReadShelf}
                isBooksForYouShelf={isBooksForYouShelf}
                navigate={navigate}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookRow;
