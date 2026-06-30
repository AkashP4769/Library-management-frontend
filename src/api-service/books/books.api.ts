import libraryBaseApi from "../api"
import { BASE_URL } from "../api";
import type BookResponse from "./types";
import type { BookAPIResponse } from "./types";
import type { CreateBookPayload } from "./types";
import { bookResponseToBook } from "./types";
import type Book from "@/models/book";

export const booksApi = libraryBaseApi.injectEndpoints({
  endpoints: (builder) => ({
    createBook: builder.mutation<{ id: number }, CreateBookPayload>({
      // encode image before sending it to the backend
      query: (payload) => ({
        url: BASE_URL + "/books",
        method: "POST",
        body: payload 
      }),
    }),

    getBook: builder.query<Book, void>({
      query: (id) => ({
        url: BASE_URL + `/books/${id}`,
        method: "GET"
      }),
      transformResponse: (response: BookResponse) => {
        return bookResponseToBook(response);
      }
    }),

    getBookbyOpenLibraryAPI:builder.query({
      query:(isbn)=>({
        url: BASE_URL + `/books/isbn/api/${isbn}`,
        method: "GET"
      }),
      transformResponse: (response: BookAPIResponse) => {
        return response;
      }

    }),

    getBooks: builder.query<Book[], void>({
      query: () => ({
        url: BASE_URL + "/books",
        method: "GET"
      }),
      transformResponse: (response: BookResponse[]) => {
        return response.map((bookResponse) => bookResponseToBook(bookResponse));
      }
    }),
  }),
});

export const { useCreateBookMutation, useGetBookQuery, useGetBooksQuery, useLazyGetBookbyOpenLibraryAPIQuery } = booksApi;
