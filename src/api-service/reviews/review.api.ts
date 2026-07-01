import libraryBaseApi from "../api";
import { BASE_URL } from "../api";
import type {
  BookReview,
  BookReviewPayload,
  BookReviewResponse,
} from "./types";

export const reviewApi = libraryBaseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBookReview: builder.query<BookReview[], string>({
      query: (isbn) => ({
        url: BASE_URL + `/reviews/book/${isbn}`,
        method: "GET",
      }),
      providesTags: ["Reviews"],
      transformResponse: (response: BookReviewResponse[]): BookReview[] => {
        return response.map((reviewResponse) => ({
          id: reviewResponse.id,
          isbn: reviewResponse.isbn,
          user_id: reviewResponse.user_id,
          name: reviewResponse.name,
          rating: reviewResponse.rating,
          content: reviewResponse.content,
          created_at: reviewResponse.created_at,
          updated_at: reviewResponse.updated_at,
        }));
      },
    }),

    createBookReview: builder.mutation<void, BookReviewPayload>({
      query: (payload) => ({
        url: BASE_URL + `/reviews/`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Reviews"],
    }),

    deleteBookReview: builder.mutation<void, { reviewId: number }>({
      query: (payload) => ({
        url: BASE_URL + `/reviews/${payload.reviewId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Reviews"],
    }),
    getUserReviews: builder.query<BookReviewResponse[], void>({
      query: () => ({
        url: BASE_URL + `/reviews/user/review`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetBookReviewQuery,
  useCreateBookReviewMutation,
  useDeleteBookReviewMutation,
} = reviewApi;
