import libraryBaseApi from "../api"
import type { LoginPayload, LoginResponse, SignupPayload } from "./types";
import { BASE_URL } from "../api";

export const loginApi = libraryBaseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginPayload>({
      query: (payload) => ({
        url: BASE_URL + "/auth/login",
        method: "POST",
        body: new URLSearchParams({ username: payload.email, password: payload.password })
      }),
      invalidatesTags: ["User"],
    }),

    signup: builder.mutation<LoginResponse, SignupPayload>({
      query: (payload) => ({
        url: BASE_URL + "/auth/signup",
        method: "POST",
        body: payload
      }),
      invalidatesTags: ["User"],
    }),

    getUserDetails: builder.query<{userId: number, email: string, name: string, contactNumber: string, role: string}, void>({
      query: () => ({
        url: BASE_URL + "/auth/user",
        method: "GET",
      }),
      providesTags: ["User"],
      transformResponse: (response: {user_id: number, email: string, name: string, contact_number: string, role: string}) => {
        return {
          userId: response.user_id,
          email: response.email,
          name: response.name,
          contactNumber: response.contact_number,
          role: response.role
        }
      }
    }),
  }),
});

export const { useLoginMutation, useSignupMutation, useGetUserDetailsQuery } = loginApi;
