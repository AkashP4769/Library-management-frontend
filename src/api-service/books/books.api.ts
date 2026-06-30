import libraryBaseApi from "../api"
import { BASE_URL } from "../api";
import type { CreateBookPayload } from "./types";

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

    getBook: builder.query<{ id: number }, void>({
      query: (id) => ({
        url: BASE_URL + `/books/${id}`,
        method: "GET"
      }),
    }),

    getBooks: builder.query<{ id: number }[], void>({
      query: () => ({
        url: BASE_URL + "/books",
        method: "GET"
      }),
    }),
  }),
});

export const { useCreateBookMutation, useGetBookQuery, useGetBooksQuery } = booksApi;
