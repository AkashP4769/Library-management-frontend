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
    }),

    signup: builder.mutation<LoginResponse, SignupPayload>({
      query: (payload) => ({
        url: BASE_URL + "/auth/register",
        method: "POST",
        body: payload
      }),
    }),
  }),
});

export const { useLoginMutation, useSignupMutation } = loginApi;
