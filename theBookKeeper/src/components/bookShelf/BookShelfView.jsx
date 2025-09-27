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
  filteredBooks = null,
  viewMode = 'grid',
  activeShelf = 'all',
}) => {

  const sortedShelves = [...bookshelves].sort((a, b) => {
    const indexA = shelfOrder.indexOf(a.id.toString());
    const indexB = shelfOrder.indexOf(b.id.toString());

    if (indexA === -1 && indexB === -1) return 0;
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;

    return indexA - indexB;
  });

  // If filteredBooks is provided, show filtered view
  if (filteredBooks !== null) {
    return (
      <div className="space-y-6">
        {filteredBooks.length > 0 && (
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {activeShelf === 'all' 
                ? `All Books (${filteredBooks.length})` 
                : `${sortedShelves.find(s => s.id.toString() === activeShelf)?.title || 'Books'} (${filteredBooks.length})`
              }
            </h2>
          </div>
        )}
        
        <div className={viewMode === 'grid' 
          ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4" 
          : "space-y-3"
        }>
          {filteredBooks.map((book, index) => {
            // Create unique key by combining book ID with index to handle duplicates
            const uniqueKey = `${book.id}-${index}`;
            
            // Debug: Log book structure for first book to identify issues
            if (index === 0) {
              console.log('Book data structure:', book);
              console.log('Title type:', typeof book.volumeInfo?.title, book.volumeInfo?.title);
              console.log('Authors:', book.volumeInfo?.authors);
            }
            
            // Find which shelf this book is currently in (like the original BookRow does)
            let currentShelfId = null;
            for (const [shelfId, books] of Object.entries(shelfBooks)) {
              if (books?.some(b => b.id === book.id)) {
                currentShelfId = shelfId;
                break;
              }
            }
            
            return (
            <div key={uniqueKey} className="group h-full">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow duration-200 h-full flex flex-col">
                {/* Book Cover */}
                <div className="aspect-[3/4] bg-gray-100 dark:bg-gray-700 relative overflow-hidden flex-shrink-0">
                  {book.volumeInfo?.imageLinks?.thumbnail ? (
                    <img
                      src={book.volumeInfo.imageLinks.thumbnail}
                      alt={book.volumeInfo.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-gray-400 text-center">
                        <svg className="w-8 h-8 mx-auto mb-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                        </svg>
                        <p className="text-xs">No Image</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Quick Actions Overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="flex space-x-1">
                      <button
                        onClick={() => navigate(`/book/${book.id}`)}
                        className="bg-white text-gray-900 px-2 py-1 rounded-full text-xs font-medium hover:bg-gray-100 transition-colors"
                      >
                        View
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToFavorites(book.id, currentShelfId);
                        }}
                        className="bg-red-600 text-white px-2 py-1 rounded-full text-xs font-medium hover:bg-red-700 transition-colors"
                      >
                        ♥
                      </button>
                    </div>
                  </div>
                  
                </div>
                
                {/* Book Info */}
                <div className="p-2 flex flex-col flex-grow">
                  <h3 className="font-medium text-gray-900 dark:text-white text-xs line-clamp-2 mb-1 h-8 flex items-start">
                    {typeof book.volumeInfo?.title === 'string' 
                      ? book.volumeInfo.title 
                      : typeof book.volumeInfo?.title === 'object' && book.volumeInfo?.title?.text
                      ? book.volumeInfo.title.text
                      : 'Untitled'}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-xs mb-2 line-clamp-1 h-4 flex items-center">
                    {Array.isArray(book.volumeInfo?.authors) 
                      ? book.volumeInfo.authors.map(author => {
                          if (typeof author === 'string') {
                            return author;
                          } else if (typeof author === 'object' && author !== null) {
                            return author.name || author.text || 'Unknown Author';
                          } else {
                            return 'Unknown Author';
                          }
                        }).join(', ')
                      : 'Unknown Author'}
                  </p>
                  
                  {/* Rating */}
                  <div className="h-4 mb-2 flex items-center">
                    {book.volumeInfo?.averageRating && typeof book.volumeInfo.averageRating === 'number' && (
                      <div className="flex items-center">
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`w-2 h-2 ${i < Math.floor(book.volumeInfo.averageRating) ? 'fill-current' : 'text-gray-300'}`}
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className="ml-1 text-xs text-gray-500">
                          {book.volumeInfo.averageRating}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {/* Shelf Actions */}
                  <div className="flex flex-wrap gap-1 mt-auto">
                    {currentShelfId !== shelfId.toRead && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToToRead(book.id, currentShelfId);
                        }}
                        className="px-1.5 py-0.5 bg-blue-100 hover:bg-blue-200 text-blue-800 text-xs rounded-full transition-colors"
                      >
                        Want to Read
                      </button>
                    )}
                    {currentShelfId !== shelfId.readingNow && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToReadingNow(book.id, currentShelfId);
                        }}
                        className="px-1.5 py-0.5 bg-green-100 hover:bg-green-200 text-green-800 text-xs rounded-full transition-colors"
                      >
                        Reading
                      </button>
                    )}
                    {currentShelfId !== shelfId.favorites && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToFavorites(book.id, currentShelfId);
                        }}
                        className="px-1.5 py-0.5 bg-red-100 hover:bg-red-200 text-red-800 text-xs rounded-full transition-colors"
                      >
                        Favorites
                      </button>
                    )}
                    {currentShelfId !== shelfId.haveRead && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToHaveRead(book.id, currentShelfId);
                        }}
                        className="px-1.5 py-0.5 bg-purple-100 hover:bg-purple-200 text-purple-800 text-xs rounded-full transition-colors"
                      >
                        Have Read
                      </button>
                    )}
                    {currentShelfId !== shelfId.booksForYou && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveBook(book.id, currentShelfId);
                        }}
                        className="px-1.5 py-0.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs rounded-full transition-colors"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Original shelf-based view
  return (
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
  );
};

export default BookshelfView;
