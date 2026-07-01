import libraryBaseApi from "../api";
import { BASE_URL } from "../api";
import type { NotificationRequestPayload, NotificationItem } from "./types";

export const notificationsApi = libraryBaseApi.injectEndpoints({
  endpoints: (builder) => ({
    requestBook: builder.mutation<void, { isbn: string }>({
      query: (payload) => ({
        url: BASE_URL + `/notifications/request`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: [{ type: "Library", id: "LIST" }],
    }),

    getUsersNotifications: builder.query<NotificationItem[], void>({
      query: () => ({
        url: BASE_URL + `/notifications/user/`,
        method: "GET",
      }),
    }),

    resolveNotification: builder.mutation<
      void,
      { notificationId: number; status: string }
    >({
      query: (payload) => ({
        url: BASE_URL + `/notifications/${payload.notificationId}/resolve`,
        method: "PATCH",
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

    createNotificationBroadcast: builder.mutation<
      void,
      NotificationRequestPayload
    >({
      query: (payload) => ({
        url: BASE_URL + `/notifications/broadcast`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: [{ type: "Library", id: "LIST" }],
    }),
  }),
});

export const {
  useRequestBookMutation,
  useCreateNotificationBroadcastMutation,
  useLazyGetUsersNotificationsQuery,
  useResolveNotificationMutation,
  useCreateNotificationMutation,
} = notificationsApi;
