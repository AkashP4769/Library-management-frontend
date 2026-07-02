import { useLazyGetRecentActivitiesQuery } from "@/api-service/admin/admin.api";
import { placeholderImageUrl } from "@/api-service/books/types";
import { Search } from "lucide-react";
import Papa from "papaparse";
import { useEffect, useMemo, useState } from "react";

type ActivityStatus = "ISSUED" | "BORROWED" | "OVERDUE" | "RETURNED";

interface ActivityRow {
  image_url: string | null;
  id: number;
  title: string;
  user: string;
  date: string;
  status: ActivityStatus;
  due_date: string;
}

const RANGE_OPTIONS = [
  { label: "7 days", value: "7d" },
  { label: "30 days", value: "30d" },
  { label: "90 days", value: "90d" },
] as const;

type Range = (typeof RANGE_OPTIONS)[number]["value"];

const STATUS_STYLES: Record<
  ActivityStatus,
  {
    pill: string;
    dot: string;
  }
> = {
  ISSUED: {
    pill: "bg-blue-50 text-blue-700",
    dot: "bg-blue-600",
  },
  BORROWED: {
    pill: "bg-amber-50 text-amber-700",
    dot: "bg-amber-600",
  },
  OVERDUE: {
    pill: "bg-red-50 text-red-700",
    dot: "bg-red-600",
  },
  RETURNED: {
    pill: "bg-emerald-50 text-emerald-700",
    dot: "bg-emerald-600",
  },
};

const AVATAR_PALETTE = [
  "bg-[#D9DFF5]",
  "bg-[#FCD34D]",
  "bg-[#D0D7E7]",
  "bg-[#FFDAD6]",
  "bg-[#DCFCE7]",
];

const PAGE_SIZE = 8;

function avatarBg(name: string): string {
  const hash = [...name].reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return AVATAR_PALETTE[hash % AVATAR_PALETTE.length];
}

function initials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

function formatDate(value?: string): string {
  if (!value || value === "-") return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "Asia/Kolkata",
  }).format(date);
}

function StatusBadge({ status }: { status: ActivityStatus }) {
  const style = STATUS_STYLES[status];

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium ${style.pill}`}
    >
      <span className={`h-2 w-2 rounded-full ${style.dot}`} />
      {status}
    </span>
  );
}

function SkeletonRows() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <tr
          key={i}
          className="border-t border-[#D0C6AE] h-[81px] animate-pulse"
        >
          {Array.from({ length: 6 }).map((_, idx) => (
            <td key={idx} className="px-6 py-5">
              <div className="h-4 rounded bg-[#E7E8E9]" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

function EmptyState() {
  return (
    <tr>
      <td colSpan={6} className="px-6 py-16 text-center">
        <p className="text-sm font-semibold text-[#191C1D]">
          No activity found
        </p>
        <p className="text-xs text-[#575E70] mt-1">
          Try another search or date range.
        </p>
      </td>
    </tr>
  );
}

export default function Track() {
  const [range, setRange] = useState<Range>("30d");
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const [fetchActivities, { data: rows = [], isLoading, isFetching }] =
    useLazyGetRecentActivitiesQuery();

  useEffect(() => {
    setPage(1);
    fetchActivities({ range });
  }, [range, fetchActivities]);

  const loading = isLoading || isFetching;

  const filteredRows = useMemo(() => {
    const query = search.toLowerCase().trim();

    if (!query) return rows;

    return rows.filter((row) =>
      [row.title, row.user, row.status].some((field) =>
        field.toLowerCase().includes(query),
      ),
    );
  }, [rows, search]);

  const totalPages = Math.ceil(filteredRows.length / PAGE_SIZE);

  const startIndex = (page - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;

  const pageRows = filteredRows.slice(startIndex, endIndex);

  const exportCSV = () => {
    const csv = Papa.unparse(
      filteredRows.map((row) => ({
        Title: row.title,
        User: row.user,
        Status: row.status,
        Date: formatDate(row.date),
        DueDate: formatDate(row.due_date),
      })),
    );

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "recent-activity.csv";
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col gap-4 p-8 mx-auto w-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-[#191C1D]">
            Recent Activity
          </h1>
          <p className="text-xs text-[#575E70] mt-0.5">
            All borrowing events across the library system.
          </p>
        </div>

        <button
          onClick={exportCSV}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#D0C6AE] bg-white text-xs font-bold text-[#191C1D] hover:bg-[#F3F4F5]"
        >
          ↓ Export CSV
        </button>
      </div>

      <div className="flex flex-col w-full bg-white border border-[#D0C6AE] rounded-xl overflow-hidden">
        {/* Filters */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#D0C6AE] bg-[#FAFAF8] gap-4">
          <div className="flex items-center gap-1 p-1 bg-[#F3F4F5] rounded-lg">
            {RANGE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setRange(opt.value)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold ${
                  range === opt.value
                    ? "bg-white border border-[#D0C6AE]"
                    : "text-[#575E70]"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="flex items-center gap-2 rounded-lg border border-[#D0C6AE] px-3 py-2 min-w-[280px] bg-white">
            <Search size={16} className="text-[#575E70]" />
            <input
              type="text"
              placeholder="Search title, user, status..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full outline-none text-sm"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F3F4F5]">
              <tr>
                {["Book", "User", "Date", "Status", "Due Date", ""].map(
                  (h, i) => (
                    <th
                      key={i}
                      className={`px-6 py-4 text-xs font-semibold uppercase ${
                        i === 5 ? "text-right" : "text-left"
                      }`}
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <SkeletonRows />
              ) : pageRows.length === 0 ? (
                <EmptyState />
              ) : (
                pageRows.map((row) => {
                  const bg = avatarBg(row.user);

                  return (
                    <tr key={row.id} className="border-t border-[#D0C6AE]">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={placeholderImageUrl(row.image_url)}
                            alt={row.title}
                            className="w-8 h-12 rounded object-cover"
                          />
                          <span className="font-semibold">{row.title}</span>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold ${bg}`}
                          >
                            {initials(row.user)}
                          </span>
                          {row.user}
                        </div>
                      </td>

                      <td className="px-6 py-4">{formatDate(row.date)}</td>

                      <td className="px-6 py-4">
                        <StatusBadge status={row.status} />
                      </td>

                      <td className="px-6 py-4">{formatDate(row.due_date)}</td>

                      <td />
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredRows.length > 0 && (
          <div className="flex items-center justify-between border-t border-[#D0C6AE]/40 px-6 py-4">
            <span>
              Showing {startIndex + 1}–{Math.min(endIndex, filteredRows.length)}{" "}
              of {filteredRows.length} events
            </span>

            <div className="flex gap-2">
              <button
                onClick={() => setPage((prev) => prev - 1)}
                disabled={page === 1}
                className="rounded-lg border px-3 py-1"
              >
                Prev
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (current) => (
                  <button
                    key={current}
                    onClick={() => setPage(current)}
                    className={`h-8 w-8 rounded-lg ${
                      page === current
                        ? "bg-[#191C1D] text-[#FCD34D]"
                        : "border"
                    }`}
                  >
                    {current}
                  </button>
                ),
              )}

              <button
                onClick={() => setPage((prev) => prev + 1)}
                disabled={page === totalPages}
                className="rounded-lg border px-3 py-1"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
