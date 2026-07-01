import libraryBaseApi from "../api";
import { BASE_URL } from "../api";
import { reviewApi } from "../reviews/review.api";
import type { NotificationRequestPayload } from "./types";

export const requestApi = libraryBaseApi.injectEndpoints({
  endpoints: (builder) => ({
    requestBook: builder.mutation<void, { isbn: string }>({
        query: (payload) => ({
            url: BASE_URL + `/notifications/request`,
            method: "POST",
            body: payload,
        }),
        invalidatesTags: [{ type: "Library", id: "LIST" }],
    }),

    getUsersNotifications: builder.query({
        query: () => ({
            url: BASE_URL + `/notifications/user/`,
            method: "GET",
        }),
    }),

    resolveNotification: builder.mutation<void, { notificationId: number }>({
        query: (payload) => ({
            url: BASE_URL + `/notifications/${payload.notificationId}/resolve`,
            method: "POST",
            body: payload,
        }),
        invalidatesTags: [{ type: "Library", id: "LIST" }],
    }),

    createNotification: builder.mutation<void, NotificationRequestPayload>({
        query: (payload) => ({
            url: BASE_URL + `/notifications`,
            method: "POST",
            body: payload,
        }),
        invalidatesTags: [{ type: "Library", id: "LIST" }],
    }),

    createNotificationBroadcast: builder.mutation<void, NotificationRequestPayload>({
        query: (payload) => ({
            url: BASE_URL + `/notifications/broadcast`,
            method: "POST",
            body: payload,
        }),
        invalidatesTags: [{ type: "Library", id: "LIST" }],
    }),
    

  }),
});

export const { useRequestBookMutation } = requestApi;