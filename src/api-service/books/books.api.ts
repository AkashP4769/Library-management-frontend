import type Shelf from "@/models/shelf";
import libraryBaseApi from "../api";
import { BASE_URL } from "../api";
import type BookResponse from "./types";
import type { BookToShelfPayload, BorrowBookPayload, BorrowedBook, CreateBookPayload, InventoryBookItem } from "./types";
import type { BookAPIResponse } from "./types";
import { bookResponseToBook, responseToInventoryBookItem, transformBorrowedBookResponse } from "./types";
import type { BorrowedBookResponse } from "./types";
import type Book from "@/models/book";
import type ShelfResponse from "../shelf/types";
import { shelfResponseToShelf } from "../shelf/types";

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

    getBook: builder.query<Book, number>({
      query: (id) => ({
        url: BASE_URL + `/books/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Books", id }],
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
      providesTags: (result) => result ? result.map(({ id }) => ({ type: "Books", id })) : [{ type: "Books", id: "LIST" }],
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
      invalidatesTags: [{ type: "Books", id: "LIST" }],
    }),

    getInventoryBooks: builder.query<InventoryBookItem[], void>({
      query: () => ({
        url: BASE_URL + "/book-copies/inventory",
        method: "GET"
      }),
      providesTags: (result) => result ? result.map(({ isbn }) => ({ type: "Books", isbn })) : [{ type: "Books", id: "LIST" }],
      transformResponse: (response: {inventory: [], total: number}) => {
        return response.inventory.map((item) => responseToInventoryBookItem(item));
      }
    }),

    getBookByGenre: builder.query<Book[], { genre: String; id: Number }>({
      query: ({ genre, id }) => ({
        url: BASE_URL + `/books/search/${genre}?book_id=${id}`,
        method: "GET",
      }),
      providesTags: (result) => result ? result.map(({ id }) => ({ type: "Books", id })) : [{ type: "Books", id: "LIST" }],
      transformResponse: (response: BookResponse[]) => {
        return response.map((bookResponse) => bookResponseToBook(bookResponse));
      },
    }),

    getShelvesOfBook: builder.query<Shelf[], string>({
      query: (isbn) => ({
        url: BASE_URL + `/books/${isbn}/shelves`,
        method: "GET",
      }),
      providesTags: (result) => result ? result.map(({ id }) => ({ type: "Shelves", id })) : [{ type: "Shelves", id: "LIST" }],
      transformResponse: (response: ShelfResponse[]) => {
        return response.map((shelfResponse) => shelfResponseToShelf(shelfResponse));
      }
    }),

    borrowBook: builder.mutation<BorrowedBookResponse, BorrowBookPayload>({
      query: (payload) => ({
        url: BASE_URL + `/borrowed-books`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: [{ type: "BorrowedBooks", id: "LIST" }],
      
    }),

    getBorrowedBooksByUser: builder.query<BorrowedBook[], void>({
      query: () => ({
        url: BASE_URL + `/borrowed-books/details-by-user`,  
        method: "GET",
      }),
      providesTags: (result) => result ? result.map(({ id }) => ({ type: "BorrowedBooks", id })) : [{ type: "BorrowedBooks", id: "LIST" }],
      transformResponse: (response: { borrowed_books: BorrowedBook[] }) => {
        return response.borrowed_books.map((bookResponse) => transformBorrowedBookResponse(bookResponse));
      },

    }),

    returnBorrowedBook: builder.mutation<void, { borrowId: number; shelfId: number }>({
      query: ({ borrowId, shelfId }) => ({
        url: BASE_URL + `/borrowed-books/${borrowId}/return/${shelfId}`,
        method: "POST",
      }),
      invalidatesTags: [{ type: "BorrowedBooks", id: "LIST" }],
    }),
  }),
  
});

export const { useCreateBookMutation, useGetBookQuery, useGetBooksQuery, useAddBookToShelfMutation, 
  useLazyGetBookbyOpenLibraryAPIQuery, 
  useGetInventoryBooksQuery, useGetBookByGenreQuery, useGetShelvesOfBookQuery, 
  useBorrowBookMutation, useGetBorrowedBooksByUserQuery, useReturnBorrowedBookMutation
} = booksApi;
