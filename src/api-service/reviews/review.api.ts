import libraryBaseApi from "../api";
import { BASE_URL } from "../api";
import type { ReviewResponse } from "./types";

export const reviewApi = libraryBaseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBookReview: builder.query({
      query: (isbn) => ({
        url: BASE_URL + `/reviews/book/${isbn}`,
        method: "GET",
      }),
    }),
    getUserReviews: builder.query<ReviewResponse[], void>({
      query: () => ({
        url: BASE_URL + `/reviews/user/review`,
        method: "GET",
      }),
    }),
  }),
});

export const { useGetBookReviewQuery, useGetUserReviewsQuery } = reviewApi;
