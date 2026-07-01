import type Shelf from "@/models/shelf";
import libraryBaseApi from "../api"
import { BASE_URL } from "../api";
import { shelfBookResponseToBook, shelfResponseToShelf, type CreateShelfPayload, type ShelfBookResponse } from "./types";
import type ShelfResponse from "./types";
import type Book from "@/models/book";


export const shelvesApi = libraryBaseApi.injectEndpoints({
  endpoints: (builder) => ({
    createShelf: builder.mutation<{ id: number }, CreateShelfPayload>({
      // encode image before sending it to the backend
      query: (payload) => ({
        url: BASE_URL + "/shelves",
        method: "POST",
        body: payload 
      }),
    }),

    getShelf: builder.query<Shelf, void>({
      query: (id) => ({
        url: BASE_URL + `/shelves/${id}`,
        method: "GET"
      }),
      transformResponse: (response: ShelfResponse) => {
        return shelfResponseToShelf(response);
      }
    }),

    getShelves: builder.query<Shelf[], void>({
      query: () => ({
        url: BASE_URL + "/shelves",
        method: "GET"
      }),
      transformResponse: (response: ShelfResponse[]) => {
        return response.map((shelfResponse) => shelfResponseToShelf(shelfResponse));
      }
    }),

    getBooksByShelf: builder.query<Book[], number>({
      query: (shelfId) => ({
        url: BASE_URL + `/shelves/${shelfId}/books`,
        method: "GET"
      }),
      providesTags: ["Books"],
      transformResponse: (response: ShelfBookResponse[]) => {
        return response.map((bookResponse) => shelfBookResponseToBook(bookResponse));
      }
    }),
  }),
});

export const { useCreateShelfMutation, useGetShelfQuery, useGetShelvesQuery, useGetBooksByShelfQuery } = shelvesApi;
