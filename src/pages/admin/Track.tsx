import { useLazyGetRecentActivitiesQuery } from "@/api-service/admin/admin.api";
import { placeholderImageUrl } from "@/api-service/books/types";
import { useEffect, useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type ActivityStatus = "Issued" | "Borrowed" | "Overdue" | "Returned";

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

const STATUS_STYLES: Record<ActivityStatus, { pill: string; dot: string }> = {
  Issued: { pill: "bg-[#DCFCE7] text-[#15803D]", dot: "bg-[#15803D]" },
  Borrowed: { pill: "bg-[#FEF9C3] text-[#A16207]", dot: "bg-[#A16207]" },
  Overdue: { pill: "bg-[#FEE2E2] text-[#B91C1C]", dot: "bg-[#B91C1C]" },
  Returned: { pill: "bg-[#E9E8E9] text-[#4D4635]", dot: "bg-[#7F7662]" },
};

/** Deterministically map a user name to one of 5 avatar background colors. */
const AVATAR_PALETTE = [
  "bg-[#D9DFF5]",
  "bg-[#FCD34D]",
  "bg-[#D0D7E7]",
  "bg-[#FFDAD6]",
  "bg-[#DCFCE7]",
];

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
  console.log(value);
  if (!value) return "Time unavailable";

  const date = new Date(value);
  console.log(date);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "Asia/Kolkata",
  }).format(date);
}

function SkeletonRows() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <tr
          key={i}
          className="border-t border-[#D0C6AE] h-[81px] animate-pulse"
        >
          <td className="px-6 py-5">
            <div className="flex items-center gap-4">
              <div className="w-8 h-12 rounded bg-[#E7E8E9]" />
              <div className="h-3 w-32 rounded bg-[#E7E8E9]" />
            </div>
          </td>
          <td className="px-6 py-5">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-[#E7E8E9]" />
              <div className="h-3 w-24 rounded bg-[#E7E8E9]" />
            </div>
          </td>
          <td className="px-6 py-5">
            <div className="h-3 w-20 rounded bg-[#E7E8E9]" />
          </td>
          <td className="px-6 py-5">
            <div className="h-5 w-16 rounded-full bg-[#E7E8E9]" />
          </td>
          <td className="px-6 py-5">
            <div className="h-3 w-20 rounded bg-[#E7E8E9]" />
          </td>
          <td className="px-6 py-5" />
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
          Try a different date range or check back later.
        </p>
      </td>
    </tr>
  );
}

const PAGE_SIZE = 10;

export default function Track() {
  const [range, setRange] = useState<Range>("30d");
  const [page, setPage] = useState(1);

  const [fetchActivities, { data: rows = [], isLoading, isFetching }] =
    useLazyGetRecentActivitiesQuery();

  useEffect(() => {
    setPage(1);
    fetchActivities({ range });
  }, [range, fetchActivities]);

  const loading = isLoading || isFetching;
  const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const pageRows: ActivityRow[] = rows.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  );

  return (
    <div className="flex flex-col gap-4 p-8 mx-auto w-full">
      {/* Page heading */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-[#191C1D]">
            Recent Activity
          </h1>
          <p className="text-xs text-[#575E70] mt-0.5">
            All borrowing events across the library system.
          </p>
        </div>

        <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#D0C6AE] bg-white text-xs font-bold text-[#191C1D] hover:bg-[#F3F4F5] transition">
          ↓ Export CSV
        </button>
      </div>

      {/* Card */}
      <div className="flex flex-col w-full bg-white border border-[#D0C6AE] rounded-xl overflow-hidden">
        {/* Card header: range tabs + row count */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#D0C6AE] bg-[#FAFAF8]">
          {/* Range selector */}
          <div className="flex items-center gap-1 p-1 bg-[#F3F4F5] rounded-lg">
            {RANGE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setRange(opt.value)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold tracking-[0.4px] transition ${
                  range === opt.value
                    ? "bg-white shadow-sm text-[#191C1D] border border-[#D0C6AE]"
                    : "text-[#575E70] hover:text-[#191C1D]"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Live row count */}
          <span className="text-xs font-semibold tracking-[0.6px] text-[#575E70]">
            {loading
              ? "Loading…"
              : `${rows.length} event${rows.length !== 1 ? "s" : ""}`}
          </span>
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
                      className={`px-6 py-4 text-xs font-semibold uppercase tracking-[0.6px] text-[#4D4635] whitespace-nowrap ${
                        i === 5 ? "text-right w-10" : "text-left"
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
                pageRows.map((row, i) => {
                  const style =
                    STATUS_STYLES[row.status] ?? STATUS_STYLES["Borrowed"];
                  const bg = avatarBg(row.user);
                  const init = initials(row.user);
                  const isOverdue = row.status === "Overdue";

                  return (
                    <tr
                      key={`${row.id}-${i}`}
                      className="border-t border-[#D0C6AE] h-[76px] hover:bg-[#FAFAF8] transition-colors group"
                    >
                      {/* Book */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-12 rounded bg-[#E7E8E9] shadow-sm flex-shrink-0">
                              <img src={placeholderImageUrl(row.image_url)} alt={row.title} className="w-full h-full object-cover rounded" />
                          </div>
                          <span className="font-bold text-sm text-[#191C1D] leading-snug">
                            {row.title}
                          </span>
                        </div>
                      </td>

                      {/* User */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 whitespace-nowrap">
                          <span
                            className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-bold text-[#191C1D] ${bg}`}
                          >
                            {init}
                          </span>
                          <span className="text-sm text-[#191C1D]">
                            {row.user}
                          </span>
                        </div>
                      </td>

                      {/* Issued date */}
                      <td className="px-6 py-4 text-sm text-[#575E70] whitespace-nowrap">
                        {formatDate(row.date)}
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${style.pill}`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${style.dot}`}
                          />
                          {row.status}
                        </span>
                      </td>

                      {/* Due date */}
                      <td
                        className={`px-6 py-4 text-sm whitespace-nowrap font-medium ${
                          isOverdue ? "text-[#B91C1C]" : "text-[#575E70]"
                        }`}
                      >
                        {formatDate(row.due_date) ?? "—"}
                      </td>

                      {/* Row actions */}
                      <td className="px-6 py-4 text-right">
                        <button className="opacity-0 group-hover:opacity-100 transition-opacity text-[#575E70] hover:text-[#191C1D] text-lg leading-none">
                          ⋮
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer / Pagination */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#F3F4F5] border-t border-[#D0C6AE]">
          <span className="text-xs font-semibold tracking-[0.6px] text-[#4D4635]">
            {rows.length === 0
              ? "No entries"
              : `Showing ${(page - 1) * PAGE_SIZE + 1}–${Math.min(page * PAGE_SIZE, rows.length)} of ${rows.length}`}
          </span>

          <div className="flex items-center gap-1">
            <PaginationButton
              label="← Prev"
              disabled={page === 1 || loading}
              onClick={() => setPage((p) => p - 1)}
            />

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(
                (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1,
              )
              .reduce<(number | "…")[]>((acc, p, idx, arr) => {
                if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push("…");
                acc.push(p);
                return acc;
              }, [])
              .map((p, i) =>
                p === "…" ? (
                  <span
                    key={`ellipsis-${i}`}
                    className="px-1 text-xs text-[#575E70]"
                  >
                    …
                  </span>
                ) : (
                  <PaginationButton
                    key={p}
                    label={String(p)}
                    active={p === page}
                    disabled={loading}
                    onClick={() => setPage(p as number)}
                  />
                ),
              )}

            <PaginationButton
              label="Next →"
              disabled={page === totalPages || loading}
              onClick={() => setPage((p) => p + 1)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function PaginationButton({
  label,
  active,
  disabled,
  onClick,
}: {
  label: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-3 py-1 rounded text-xs font-semibold border transition min-w-[32px] ${
        active
          ? "bg-[#191C1D] text-white border-[#191C1D]"
          : disabled
            ? "border-[#D0C6AE] text-[#9A9A9A] cursor-not-allowed"
            : "border-[#D0C6AE] text-[#191C1D] bg-white hover:bg-[#F3F4F5]"
      }`}
    >
      {label}
    </button>
  );
}
