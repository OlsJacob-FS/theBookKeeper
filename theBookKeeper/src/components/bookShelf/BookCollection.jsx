import { userCollection, shelfId } from "./ShelfConstants";
import { addBookToShelf, removeBookFromShelf } from "./BookFetch";

export const findBookCurrentCollection = (shelfBooks, bookId) => {
  for (const shelfId of userCollection) {
    if (shelfBooks[shelfId]?.some((book) => book.id === bookId)) {
      return shelfId;
    }
  }
  return null;
};

export const moveBookToCollection = async (
  token,
  bookId,
  targetShelfId,
  originalShelfId,
  successCallback,
  errorCallback
) => {
  if (!token) {
    errorCallback("Session has expired. Please log in again.");
    return;
  }

  try {
    await addBookToShelf(token, bookId, targetShelfId);

    if (
      originalShelfId &&
      originalShelfId !== targetShelfId &&
      userCollection.includes(originalShelfId)
    ) {
      try {
        await removeBookFromShelf(token, bookId, originalShelfId);
      } catch (removeError) {
        console.error(`Error removing book from original shelf:`, removeError);
      }
    }

    successCallback();
  } catch (error) {
    errorCallback(error);
  }
};

export const removeBook = async (
  token,
  bookId,
  shelfId,
  successCallback,
  errorCallback
) => {
  if (!token) {
    errorCallback("Session has expired. Please log in again.");
    return;
  }

  try {
    await removeBookFromShelf(token, bookId, shelfId);
    successCallback(bookId, shelfId);
  } catch (error) {
    console.error("Error removing book:", error);
    errorCallback("Failed to remove book");
  }
};

export const createBookHandlers = (
  shelfBooks,
  token,
  onSuccess,
  onError,
  reloadCallback
) => {
  const handleSuccess = (message) => {
    onSuccess({ type: "success", text: message });
    setTimeout(reloadCallback, 1000);
  };

  const handleError = (error, targetShelf) => {
    console.error(`Error moving book to ${targetShelf}`, error);

    let errorMessage = "Failed to update your collection.";
    if (error.response?.data?.error?.message?.includes("already exists")) {
      errorMessage = "This book is already in this collection.";
    }

    onError({ type: "error", text: errorMessage });
  };

  return {
    handleAddToHaveRead: (bookId, currentShelfId) => {
      const originalShelfId =
        currentShelfId || findBookCurrentCollection(shelfBooks, bookId);
      moveBookToCollection(
        token,
        bookId,
        shelfId.haveRead,
        originalShelfId,
        () => handleSuccess("Book moved to Have Read"),
        (error) => handleError(error, "Have Read")
      );
    },

    handleAddToReadingNow: (bookId, currentShelfId) => {
      const originalShelfId =
        currentShelfId || findBookCurrentCollection(shelfBooks, bookId);
      moveBookToCollection(
        token,
        bookId,
        shelfId.readingNow,
        originalShelfId,
        () => handleSuccess("Book moved to Reading Now"),
        (error) => handleError(error, "Reading Now")
      );
    },

    handleAddToToRead: (bookId, currentShelfId) => {
      const originalShelfId =
        currentShelfId || findBookCurrentCollection(shelfBooks, bookId);
      moveBookToCollection(
        token,
        bookId,
        shelfId.toRead,
        originalShelfId,
        () => handleSuccess("Book moved to To Read"),
        (error) => handleError(error, "To Read")
      );
    },

    handleAddToFavorites: (bookId, currentShelfId) => {
      const originalShelfId =
        currentShelfId || findBookCurrentCollection(shelfBooks, bookId);
      moveBookToCollection(
        token,
        bookId,
        shelfId.favorites,
        originalShelfId,
        () => handleSuccess("Book moved to favorites"),
        (error) => handleError(error, "Favorites")
      );
    },

    handleRemoveBook: (bookId, shelfId) => {
      removeBook(
        token,
        bookId,
        shelfId,
        (bookId, shelfId) => {
          handleSuccess("Book removed");
        },
        (errorMessage) => onError({ type: "error", text: errorMessage })
      );
    },
  };
};
