import axios from "axios";

const API_KEY = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY;

export const fetchBooksByGenre = async (genre, bookListNum = 20) => {
  const cacheKey = `book_genre_${genre}`;
  const cachedData = localStorage.getItem(cacheKey);

  if (cachedData) {
    try {
      const data = JSON.parse(cachedData);
      return data;
    } catch (e) {
      // If JSON parsing fails, ignore and fetch new data
      console.error("Error parsing cached data", e);
    }
  }

  try {
    const randomNumber = Math.floor(Math.random() * 30);

    const response = await axios.get(
      `https://www.googleapis.com/books/v1/volumes`,
      {
        params: {
          q: `subject:${genre}`,
          maxResults: bookListNum,
          startIndex: randomNumber,
          printType: "books",
          langRestrict: "en",
          key: API_KEY,
        },
      }
    );

    let hasCover = (response.data.items || []).filter(
      (book) => book.volumeInfo.imageLinks?.thumbnail
    );

    if (hasCover.length < bookListNum / 2) {
      const allBooks = [...hasCover];
      const uniqueBooks = Array.from(
        new Map(allBooks.map((book) => [book.id, book])).values()
      );

      hasCover = uniqueBooks;
    }

    // Save to localStorage
    localStorage.setItem(cacheKey, JSON.stringify(hasCover));

    return hasCover;
  } catch (error) {
    console.error(`Error fetching ${genre} books:`, error);
    return [];
  }
};

export const searchBooks = async (searchTerm) => {
  const cacheKey = `search_${searchTerm.toLowerCase().trim()}`;
  const cachedData = localStorage.getItem(cacheKey);

  if (cachedData) {
    try {
      const data = JSON.parse(cachedData);
      console.log(`Using cached search results for "${searchTerm}"`);
      return data;
    } catch (e) {
      console.error("Error parsing cached search data", e);
    }
  }

  try {
    const response = await axios.get(
      `https://www.googleapis.com/books/v1/volumes`,
      {
        params: {
          q: searchTerm,
          maxResults: 20,
          printType: "books",
          key: API_KEY,
        },
      }
    );

    const hasCover = (response.data.items || []).filter(
      (book) => book.volumeInfo.imageLinks?.thumbnail
    );

    localStorage.setItem(cacheKey, JSON.stringify(hasCover));

    return hasCover;
  } catch (error) {
    console.error("Error searching books:", error);
    return [];
  }
};
