import React from "react";
import BookRow from "./BookRow";
import EmptyCollection from "./EmptyCollection";
import LoadScreen from "../LoadScreen";
import ToastNotification from "./Toast";
import ErrorMessage from "../Error";
import { shelfId, shelfOrder } from "./ShelfConstants";

const BookshelfView = ({
  bookshelves,
  shelfBooks,
  loading,
  error,
  message,
  handleAddToFavorites,
  handleAddToToRead,
  handleAddToHaveRead,
  handleAddToReadingNow,
  handleRemoveBook,
  navigate,
  recommendedBooks,
}) => {
  const sortedShelves = [...bookshelves].sort((a, b) => {
    const indexA = shelfOrder.indexOf(a.id.toString());
    const indexB = shelfOrder.indexOf(b.id.toString());

    if (indexA === -1 && indexB === -1) return 0;
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;

    return indexA - indexB;
  });

  return (
    <div className="min-h-screen w-screen bg-slate-50 dark:bg-slate-900">
      <div className="w-full min-h-screen bg-white dark:bg-slate-800 p-6">
        <h1 className="text-4xl text-slate-800 dark:text-white text-center font-bold mb-8">
          Your Book Collection
        </h1>

        {message && <ToastNotification message={message} />}
        {error && <ErrorMessage message={error} />}

        {loading ? (
          <LoadScreen message="Loading your collection..." />
        ) : (
          <div className="space-y-8">
            {sortedShelves
              .filter((shelf) => {
                if (recommendedBooks.includes(shelf.id.toString())) {
                  return shelfBooks[shelf.id]?.length > 0;
                }
                return shelfBooks[shelf.id]?.length > 0;
              })
              .map((shelf) => (
                <BookRow
                  key={shelf.id}
                  shelf={shelf}
                  books={shelfBooks[shelf.id] || []}
                  onAddToFavorites={(bookId) =>
                    handleAddToFavorites(bookId, shelf.id.toString())
                  }
                  onAddToToRead={(bookId) =>
                    handleAddToToRead(bookId, shelf.id.toString())
                  }
                  onAddToHaveRead={(bookId) =>
                    handleAddToHaveRead(bookId, shelf.id.toString())
                  }
                  onAddToReadingNow={(bookId) =>
                    handleAddToReadingNow(bookId, shelf.id.toString())
                  }
                  onRemoveBook={handleRemoveBook}
                  isHaveReadShelf={shelf.id.toString() === shelfId.haveRead}
                  isReadingNowShelf={shelf.id.toString() === shelfId.readingNow}
                  isToReadShelf={shelf.id.toString() === shelfId.toRead}
                  isFavoritesShelf={shelf.id.toString() === shelfId.favorites}
                  isBooksForYouShelf={
                    shelf.id.toString() === shelfId.booksForYou
                  }
                  navigate={navigate}
                />
              ))}

            {bookshelves.every((shelf) => !shelfBooks[shelf.id]?.length) && (
              <EmptyCollection />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookshelfView;
