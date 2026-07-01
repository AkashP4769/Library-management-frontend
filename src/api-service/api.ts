import {
  createApi,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import { clearAuth } from "@/lib/auth";

export const BASE_URL = "http://127.0.0.1:8000"

const rawBaseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: (headers) => {
    const token = localStorage.getItem("access_token");

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    return headers;
  },
});

const baseQueryWithAuth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
    clearAuth();

    if (window.location.pathname !== "/login") {
      window.location.replace("/login");
    }
  }

  return result;
};

const LibraryBaseApi = createApi({
  reducerPath: "libraryApi",
  baseQuery: baseQueryWithAuth,
  refetchOnMountOrArgChange: true,
  refetchOnReconnect: true,
  endpoints: () => ({}),
  tagTypes: ['Library', 'Books', 'BorrowedBooks', 'MyBooks', 'Shelves', 'Inventory', 'Admin'],
});

export default LibraryBaseApi;
