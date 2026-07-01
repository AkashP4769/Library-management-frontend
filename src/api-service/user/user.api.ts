import libraryBaseApi from "../api";
import { BASE_URL } from "../api";
import type { UpdateUserRequest } from "./types";
import type UserResponse from "./types";
export const userApi = libraryBaseApi.injectEndpoints({
  endpoints: (builder) => ({
    user: builder.query<UserResponse, void>({
      query: () => ({
        url: BASE_URL + "/auth/user",
        method: "GET",
      }),
      providesTags: ["User"],
    }),

    updateUser: builder.mutation<UserResponse, UpdateUserRequest>({
      query: (payload) => ({
        url: BASE_URL + "/auth/user/update",
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const { useUserQuery, useUpdateUserMutation } = userApi;
