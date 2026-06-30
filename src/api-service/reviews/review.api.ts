import libraryBaseApi from "../api";
import { BASE_URL } from "../api";

export const reviewApi = libraryBaseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBookReview: builder.query({
      query: (isbn) => ({
        url: BASE_URL + `/reviews/book/${isbn}`,
        method: "GET",
      }),
    }),
  }),
});

export const { useGetBookReviewQuery } = reviewApi;
