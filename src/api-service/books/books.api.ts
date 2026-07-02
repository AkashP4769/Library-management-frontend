import type Shelf from "@/models/shelf";
import libraryBaseApi from "../api";
import { BASE_URL } from "../api";
import type BookResponse from "./types";
import type {
  BookToShelfPayload,
  BorrowBookPayload,
  BorrowedBook,
  CreateBookPayload,
  InventoryBookItem,
  RequestedBook,
} from "./types";
import type { BookAPIResponse } from "./types";
import {
  bookResponseToBook,
  responseToInventoryBookItem,
  transformBorrowedBookResponse,
  transformRequestedBookResponse,
} from "./types";
import type { BorrowedBookResponse } from "./types";
import type Book from "@/models/book";
import type ShelfResponse from "../shelf/types";
import { shelfResponseToShelf } from "../shelf/types";

function transformWishlistResponse(response: unknown): number[] {
  const collectIds = (items: unknown[]): number[] =>
    items
      .map((item) => {
        if (typeof item === "number") {
          return item;
        }

        if (item && typeof item === "object") {
          const record = item as {
            book_id?: number;
            id?: number;
            book?: { id?: number };
          };

          return record.book_id ?? record.id ?? record.book?.id ?? null;
        }

        return null;
      })
      .filter((id): id is number => typeof id === "number");

  if (Array.isArray(response)) {
    return collectIds(response);
  }

  if (response && typeof response === "object") {
    const record = response as {
      wishlist?: unknown[];
      wishlist_books?: unknown[];
      books?: unknown[];
      data?: unknown[];
      book_ids?: unknown[];
    };

    return collectIds(
      record.wishlist ??
        record.wishlist_books ??
        record.books ??
        record.data ??
        record.book_ids ??
        [],
    );
  }

  return [];
}

export const booksApi = libraryBaseApi.injectEndpoints({
  endpoints: (builder) => ({
    createBook: builder.mutation<{ id: number }, CreateBookPayload>({
      // encode image before sending it to the backend
      query: (payload) => ({
        url: BASE_URL + "/books",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Books"],
    }),
    getRequestedBooksByUser: builder.query<RequestedBook[], void>({
      query: () => ({
        url: BASE_URL + `/books/requests`,
        method: "GET",
      }),
      providesTags: ["RequestedBooks", "Books"],
      transformResponse: (response: RequestedBook[]) => {
        return transformRequestedBookResponse(response);
      },
    }),

    getBook: builder.query<Book, number>({
      query: (id) => ({
        url: BASE_URL + `/books/${id}`,
        method: "GET",
      }),
      providesTags: ["Books"],
      transformResponse: (response: BookResponse) => {
        return bookResponseToBook(response);
      },
    }),

    getBookbyOpenLibraryAPI: builder.query({
      query: (isbn) => ({
        url: BASE_URL + `/books/isbn/api/${isbn}`,
        method: "GET",
      }),
      transformResponse: (response: BookAPIResponse) => {
        return response;
      },
    }),

    getBooks: builder.query<Book[], void>({
      query: () => ({
        url: BASE_URL + "/books",
        method: "GET",
      }),
      providesTags: ["Books"],
      transformResponse: (response: BookResponse[]) => {
        return response.map((bookResponse) => bookResponseToBook(bookResponse));
      },
    }),

    addBookToShelf: builder.mutation<void, BookToShelfPayload[]>({
      query: (payload) => ({
        url: BASE_URL + `/book-copies`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Books"],
    }),

    getInventoryBooks: builder.query<InventoryBookItem[], void>({
      query: () => ({
        url: BASE_URL + "/book-copies/inventory",
        method: "GET",
      }),
      providesTags: ["Books"],
      transformResponse: (response: { inventory: []; total: number }) => {
        return response.inventory.map((item) =>
          responseToInventoryBookItem(item),
        );
      },
    }),

    getBookByGenre: builder.query<Book[], { genre: String; id: Number }>({
      query: ({ genre, id }) => ({
        url: BASE_URL + `/books/search/${genre}?book_id=${id}`,
        method: "GET",
      }),
      providesTags: ["Books"],
      transformResponse: (response: BookResponse[]) => {
        return response.map((bookResponse) => bookResponseToBook(bookResponse));
      },
    }),

    getShelvesOfBook: builder.query<Shelf[], string>({
      query: (isbn) => ({
        url: BASE_URL + `/books/${isbn}/shelves`,
        method: "GET",
      }),
      providesTags: ["Books"],
      transformResponse: (response: ShelfResponse[]) => {
        return response.map((shelfResponse) =>
          shelfResponseToShelf(shelfResponse),
        );
      },
    }),

    borrowBook: builder.mutation<BorrowedBookResponse, BorrowBookPayload>({
      query: (payload) => ({
        url: BASE_URL + `/borrowed-books`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["BorrowedBooks", "Books"],
    }),

    getBorrowedBooksByUser: builder.query<BorrowedBook[], void>({
      query: () => ({
        url: BASE_URL + `/borrowed-books/details-by-user`,
        method: "GET",
      }),
      providesTags: ["BorrowedBooks", "Books"],
      transformResponse: (response: { borrowed_books: BorrowedBook[] }) => {
        return response.borrowed_books.map((bookResponse) =>
          transformBorrowedBookResponse(bookResponse),
        );
      },
    }),

    returnBorrowedBook: builder.mutation<
      void,
      { borrowId: number; shelfId: number }
    >({
      query: ({ borrowId, shelfId }) => ({
        url: BASE_URL + `/borrowed-books/${borrowId}/return/${shelfId}`,
        method: "POST",
      }),
      invalidatesTags: ["BorrowedBooks", "Books"],
    }),

    getWishlist: builder.query<number[], void>({
      query: () => ({
        url: BASE_URL + "/wishlist",
        method: "GET",
      }),
      providesTags: ["Wishlist"],
      transformResponse: (response: unknown) =>
        transformWishlistResponse(response),
    }),

    addToWishlist: builder.mutation<void, number>({
      query: (bookId) => ({
        url: BASE_URL + "/wishlist",
        method: "POST",
        body: { book_id: bookId },
      }),
      invalidatesTags: ["Wishlist"],
    }),

    removeFromWishlist: builder.mutation<void, number>({
      query: (bookId) => ({
        url: BASE_URL + `/wishlist/${bookId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Wishlist"],
    }),
  }),
});

export const {
  useCreateBookMutation,
  useGetBookQuery,
  useGetBooksQuery,
  useAddBookToShelfMutation,
  useLazyGetBookbyOpenLibraryAPIQuery,
  useGetInventoryBooksQuery,
  useGetBookByGenreQuery,
  useGetShelvesOfBookQuery,
  useBorrowBookMutation,
  useGetBorrowedBooksByUserQuery,
  useReturnBorrowedBookMutation,
  useGetRequestedBooksByUserQuery,
  useGetWishlistQuery,
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
} = booksApi;
