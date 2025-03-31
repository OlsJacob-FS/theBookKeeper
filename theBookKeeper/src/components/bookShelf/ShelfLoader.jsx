import {
  fetchUserBookshelves,
  fetchBooksFromShelf,
  fetchSpecialCollection,
} from "./BookFetch";
import { recommendedBooks } from "./ShelfConstants";

export const loadBooksForShelf = async (token, shelfId) => {
  try {
    const books = await fetchBooksFromShelf(token, shelfId);
    return books;
  } catch (error) {
    console.error(`Error loading books for shelf ${shelfId}:`, error);
    return [];
  }
};

export const loadBookshelves = async (
  token,
  shelfId,
  onBookshelvesFetched,
  onBooksLoaded,
  onError,
  onComplete
) => {
  try {
    const bookShelfs = await fetchUserBookshelves(token, shelfId);
    onBookshelvesFetched(bookShelfs);

    const recommendedBooksPromises = [];
    for (const specialId of recommendedBooks) {
      const recommendedShelf = bookShelfs.find(
        (shelf) => shelf.id.toString() === specialId
      );

      if (recommendedShelf) {
        const promise = fetchSpecialCollection(token, specialId)
          .then((books) => {
            if (books && books.length > 0) {
              onBooksLoaded(specialId, books);
            }
          })
          .catch((error) => {
            console.error(
              `Error loading recommended books for shelf ${specialId}:`,
              error
            );
          });

        recommendedBooksPromises.push(promise);
      }
    }

    const regularPromises = bookShelfs
      .filter(
        (shelf) =>
          shelf.volumeCount > 0 &&
          !recommendedBooks.includes(shelf.id.toString())
      )
      .map((shelf) =>
        loadBooksForShelf(token, shelf.id).then((books) =>
          onBooksLoaded(shelf.id, books)
        )
      );

    await Promise.all([...recommendedBooksPromises, ...regularPromises]);
    onComplete();
  } catch (error) {
    console.error("Error loading bookshelves:", error);

    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem("googleBooksToken");
      onError("Session has expired. Please log in again.");
    } else {
      onError("Failed to load your bookshelves. Please try again later.");
    }

    onComplete();
  }
};
