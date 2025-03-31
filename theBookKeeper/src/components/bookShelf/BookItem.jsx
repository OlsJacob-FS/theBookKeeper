import React from "react";

const BookItem = ({
  book,
  shelfId,
  onAddToFavorites,
  onAddToToRead,
  onAddToReadingNow,
  onAddToHaveRead,
  onRemoveBook,
  isFavoritesShelf,
  isToReadShelf,
  isReadingNowShelf,
  isHaveReadShelf,
  isBooksForYouShelf,
  navigate,
}) => {
  const handleBookClick = () => {
    navigate(`/book/${book.id}`);
  };

  const handlePreviewBook = (e) => {
    e.stopPropagation();
    const url =
      book.accessInfo?.webReaderLink ||
      `https://books.google.com/books?id=${book.id}`;
    window.open(url, "_blank");
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    onRemoveBook(book.id, shelfId);
  };

  const handleAddToFavorites = (e) => {
    e.stopPropagation();
    onAddToFavorites(book.id);
  };

  const handleAddToToRead = (e) => {
    e.stopPropagation();
    onAddToToRead(book.id);
  };

  const handleAddToReadingNow = (e) => {
    e.stopPropagation();
    onAddToReadingNow(book.id);
  };

  const handleAddToHaveRead = (e) => {
    e.stopPropagation();
    onAddToHaveRead(book.id);
  };

  const canRemove = !isBooksForYouShelf;

  return (
    <div className="flex-shrink-0 px-2">
      <div
        className="aspect-[2/3] w-28 rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity shadow-md"
        onClick={handleBookClick}
        style={{
          backgroundImage: book.volumeInfo.imageLinks?.thumbnail
            ? `url(${book.volumeInfo.imageLinks.thumbnail.replace(
                "http:",
                "https:"
              )})`
            : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="opacity-0 hover:opacity-100 h-full w-full bg-black/70 text-white p-2 transition-opacity duration-300 flex items-end">
          <p className="text-xs font-medium">{book.volumeInfo.title}</p>
        </div>
      </div>

      <div className="flex mt-2 space-x-1">
        <button
          onClick={handlePreviewBook}
          className="bg-blue-600 px-2 py-1 rounded text-xs text-white hover:bg-blue-700"
        >
          Preview
        </button>
        {canRemove && (
          <button
            onClick={handleRemove}
            className="bg-blue-600 px-2 py-1 rounded text-xs text-white hover:bg-blue-700"
          >
            Remove
          </button>
        )}
      </div>

      <div className="flex flex-col space-y-1 mt-1">
        {!isReadingNowShelf && (
          <button
            onClick={handleAddToReadingNow}
            className="bg-blue-600 w-full px-2 py-1 rounded text-xs text-white hover:bg-blue-700"
          >
            Reading Now
          </button>
        )}

        {!isToReadShelf && (
          <button
            onClick={handleAddToToRead}
            className="bg-blue-600 w-full px-2 py-1 rounded text-xs text-white hover:bg-blue-700"
          >
            To Read
          </button>
        )}

        {!isFavoritesShelf && (
          <button
            onClick={handleAddToFavorites}
            className="bg-blue-600 w-full px-2 py-1 rounded text-xs text-white hover:bg-blue-700"
          >
            Add to favorites
          </button>
        )}

        {!isHaveReadShelf && (
          <button
            onClick={handleAddToHaveRead}
            className="bg-blue-600 w-full px-2 py-1 rounded text-xs text-white hover:bg-blue-700"
          >
            Have Read
          </button>
        )}
      </div>
    </div>
  );
};

export default BookItem;
