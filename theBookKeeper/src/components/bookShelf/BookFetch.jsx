import axios from "axios";

const booksApi = axios.create({
  baseURL: "https://www.googleapis.com/books/v1/mylibrary",
});

const authHeader = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});

const requireToken = (token) => {
  if (!token) throw new Error("Missing Google Books token.");
};

export const fetchUserBookshelves = async (token, shelfIds) => {
  requireToken(token);

  const res = await booksApi.get("/bookshelves", authHeader(token));
  const bookShelfs = res.data?.items || [];

  return bookShelfs.filter(
    (shelf) =>
      shelf.volumeCount > 0 ||
      Object.values(shelfIds).includes(shelf.id.toString())
  );
};

export const fetchBooksFromShelf = async (token, shelfId) => {
  requireToken(token);

  const res = await booksApi.get(
    `/bookshelves/${shelfId}/volumes`,
    authHeader(token)
  );

  return res.data?.items || [];
};

export const fetchSpecialCollection = async (token, shelfId) => {
  try {
    return await fetchBooksFromShelf(token, shelfId);
  } catch (err) {
    console.error(`Error fetching special collection (${shelfId}):`, err);
    return [];
  }
};

export const addBookToShelf = async (token, bookId, shelfId) => {
  requireToken(token);

  await booksApi.post(`/bookshelves/${shelfId}/addVolume`, null, {
    ...authHeader(token),
    params: { volumeId: bookId },
  });
};

export const removeBookFromShelf = async (token, bookId, shelfId) => {
  requireToken(token);

  await booksApi.post(`/bookshelves/${shelfId}/removeVolume`, null, {
    ...authHeader(token),
    params: { volumeId: bookId },
  });
};
