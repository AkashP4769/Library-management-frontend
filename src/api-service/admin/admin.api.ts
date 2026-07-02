import libraryBaseApi from "../api";
import { BASE_URL } from "../api";
import type {
  AuditLogResponse,
  CirculationTrend,
  DashBoardMetrics,
  RecentActivity,
  ShelfSageItem,
} from "./types";

export const adminApi = libraryBaseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardMetrics: builder.query<DashBoardMetrics, void>({
      query: () => ({
        url: BASE_URL + "/admin/dashboard",
        method: "GET",
      }),
    }),

    getCirculationTrends: builder.query<CirculationTrend[], { range: string }>({
      query: ({ range }) => ({
        url: BASE_URL + "/admin/circulation-trends",
        method: "GET",
        params: { range },
      }),
    }),

    getRecentActivities: builder.query<RecentActivity[], { range: string }>({
      query: ({ range }) => ({
        url: BASE_URL + "/admin/recent-activities",
        method: "GET",
        params: { range },
      }),
    }),

    getAuditLogs: builder.query<
      AuditLogResponse,
      { range: string; status?: string; search?: string }
    >({
      query: ({ range, status, search }) => ({
        url: BASE_URL + "/audit-logs",
        method: "GET",
        params: {
          range,
          ...(status ? { status } : {}),
          ...(search ? { search } : {}),
        },
      }),
    }),

    getInventorySummary: builder.query<unknown, void>({
      query: () => ({
        url: BASE_URL + `/admin/inventory-summary`,
        method: "GET",
      }),
    }),

    getTopBooks: builder.query<unknown, void>({
      query: () => ({
        url: BASE_URL + "/admin/top-books",
        method: "GET",
      }),
    }),
    getShelfSage: builder.query<ShelfSageItem[], void>({
      query: () => ({
        url: BASE_URL + "/admin/shelf-sage",
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetDashboardMetricsQuery,
  useLazyGetDashboardMetricsQuery,
  useGetCirculationTrendsQuery,
  useGetRecentActivitiesQuery,
  useGetAuditLogsQuery,
  useGetInventorySummaryQuery,
  useGetTopBooksQuery,
  useGetShelfSageQuery,
  useLazyGetCirculationTrendsQuery,
  useLazyGetRecentActivitiesQuery,
  useLazyGetAuditLogsQuery,
  useLazyGetInventorySummaryQuery,
  useLazyGetTopBooksQuery,
} = adminApi;
