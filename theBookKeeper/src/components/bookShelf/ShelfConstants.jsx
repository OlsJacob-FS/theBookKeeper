export const shelfId = {
  favorites: "0",
  purchased: "1",
  toRead: "2",
  readingNow: "3",
  haveRead: "4",
  reviewed: "5",
  myEbooks: "7",
  booksForYou: "8",
};

export const userCollection = [
  shelfId.favorites,
  shelfId.toRead,
  shelfId.readingNow,
  shelfId.haveRead,
];

export const recommendedBooks = [shelfId.booksForYou];

export const shelfOrder = [
  shelfId.readingNow,
  shelfId.toRead,
  shelfId.favorites,
  shelfId.haveRead,
  shelfId.myEbooks,
  shelfId.purchased,
  shelfId.booksForYou,
];
