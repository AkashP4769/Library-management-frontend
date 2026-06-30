import libraryBaseApi from "../api";
import { BASE_URL } from "../api";
import type BookResponse from "./types";
import type { BookToShelfPayload, CreateBookPayload, InventoryBookItem } from "./types";
import type { BookAPIResponse } from "./types";
import { bookResponseToBook, responseToInventoryBookItem } from "./types";
import type Book from "@/models/book";

export const booksApi = libraryBaseApi.injectEndpoints({
  endpoints: (builder) => ({
    createBook: builder.mutation<{ id: number }, CreateBookPayload>({
      // encode image before sending it to the backend
      query: (payload) => ({
        url: BASE_URL + "/books",
        method: "POST",
        body: payload,
      }),
    }),

    getBook: builder.query<Book, number>({
      query: (id) => ({
        url: BASE_URL + `/books/${id}`,
        method: "GET",
      }),
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
    }),

    getInventoryBooks: builder.query<InventoryBookItem[], void>({
      query: () => ({
        url: BASE_URL + "/book-copies/inventory",
        method: "GET"
      }),
      transformResponse: (response: {inventory: [], total: number}) => {
        return response.inventory.map((item) => responseToInventoryBookItem(item));
      }}),
    getBookByGenre: builder.query<Book[], { genre: String; id: Number }>({
      query: ({ genre, id }) => ({
        url: BASE_URL + `/books/search/${genre}?book_id=${id}`,
        method: "GET",
      }),
      transformResponse: (response: BookResponse[]) => {
        return response.map((bookResponse) => bookResponseToBook(bookResponse));
      },
    }),
  }),
  
});

export const { useCreateBookMutation, useGetBookQuery, useGetBooksQuery, useAddBookToShelfMutation, useLazyGetBookbyOpenLibraryAPIQuery, useGetInventoryBooksQuery, useGetBookByGenreQuery } = booksApi;
