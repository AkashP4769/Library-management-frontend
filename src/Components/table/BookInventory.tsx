import { useMemo, useState, useEffect } from "react";
import type { InventoryBookItem } from "@/api-service/books/types";
import {
  Pencil,
  Trash2,
  SlidersHorizontal,
  BookOpen,
  Search,
} from "lucide-react";

const FALLBACK_COVER =
  "http://localhost:8000/uploads/8a7d397e-9725-43f4-ab24-4eca644dcbf9.webp";

const ITEMS_PER_PAGE = 4;

function RatingBadge({ rating }: { rating: number | null | undefined }) {
  if (rating === null || rating === undefined) {
    return (
      <span className="rounded-full bg-neutral-100 px-3 py-1 text-sm font-medium text-neutral-400">
        No rating
      </span>
    );
  }

  const styles =
    rating >= 4
      ? "bg-emerald-50 text-emerald-700"
      : rating >= 3
        ? "bg-amber-50 text-amber-700"
        : "bg-red-50 text-red-700";

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium ${styles}`}
    >
      <span className="text-xs">★</span>
      {rating.toFixed(1)}
    </span>
  );
}

function Cell({ value }: { value?: string | null }) {
  return value ? (
    <span className="text-sm text-[#4D4635]">{value}</span>
  ) : (
    <span className="text-sm italic text-neutral-400">—</span>
  );
}

type RowProps = {
  item: InventoryBookItem;
};

export function BookRow({ item }: RowProps) {
  return (
    <tr className="group border-b border-[#D0C6AE]/40 transition-colors last:border-b-0 hover:bg-[#FCD34D]/[0.06]">
      <td className="py-4 pl-6 pr-4">
        <div className="flex items-center gap-4">
          <img
            src={item.image_url || FALLBACK_COVER}
            alt={item.title}
            className="h-20 w-14 shrink-0 rounded-md object-cover shadow-sm ring-1 ring-black/5"
          />
          <div className="min-w-0">
            <p className="truncate font-semibold text-[#191C1D]">
              {item.title}
            </p>
            <p className="truncate text-sm text-[#575E70]">{item.author}</p>
          </div>
        </div>
      </td>

      <td className="px-4 py-4">
        <Cell value={item.genre} />
      </td>

      <td className="px-4 py-4">
        <Cell value={item.publisher} />
      </td>

      <td className="px-4 py-4">
        <div className="text-sm font-medium text-[#191C1D]">
          {item.office_location}
        </div>
        <div className="text-sm text-[#575E70]">Shelf {item.shelf_code}</div>
      </td>

      <td className="px-4 py-4">
        <Cell value={item.language} />
      </td>

      <td className="px-4 py-4">
        <RatingBadge rating={item.average_rating} />
      </td>

      <td className="px-4 py-4 pr-6">
        <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <button className="rounded-lg p-2 text-[#575E70] hover:bg-[#D0C6AE]/30 hover:text-[#191C1D]">
            <Pencil size={16} />
          </button>

          <button className="rounded-lg p-2 text-[#575E70] hover:bg-red-50 hover:text-red-600">
            <Trash2 size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
}

type InventoryTableProps = {
  books: InventoryBookItem[];
};

const COLUMNS = [
  "Book",
  "Genre",
  "Publisher",
  "Shelf",
  "Language",
  "Rating",
  "",
];

export function InventoryTable({ books }: InventoryTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");

  const filteredBooks = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return books;

    return books.filter((book) =>
      [
        book.title,
        book.author,
        book.genre,
        book.publisher,
        book.language,
        book.isbn,
        book.shelf_code,
        book.office_location,
      ]
        .filter(Boolean)
        .some((field) => String(field).toLowerCase().includes(query)),
    );
  }, [books, search]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const totalPages = Math.ceil(filteredBooks.length / ITEMS_PER_PAGE);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;

  const paginatedBooks = filteredBooks.slice(startIndex, endIndex);

  return (
    <div className="overflow-hidden rounded-2xl border border-[#D0C6AE]/40 bg-white shadow-sm">
      {/* Header */}
      <div className="border-b border-[#D0C6AE]/40 px-6 py-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#191C1D]">
              Library Inventory
            </h2>
            <p className="text-sm text-[#575E70]">
              {filteredBooks.length} books tracked
            </p>
          </div>

          <button className="flex items-center gap-2 rounded-lg border border-[#D0C6AE] px-4 py-2 text-sm font-medium text-[#191C1D] transition hover:bg-[#D0C6AE]/20">
            <SlidersHorizontal size={16} />
            Filter
          </button>
        </div>

        {/* Search */}
        <div className="flex items-center gap-3 rounded-xl border border-[#D0C6AE] bg-white px-4 py-3">
          <Search size={16} className="text-[#575E70]" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, author, genre, ISBN..."
            className="w-full bg-transparent text-sm outline-none placeholder:text-[#9AA0AE]"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#D0C6AE]/15 text-left text-xs font-semibold uppercase tracking-wide text-[#575E70]">
              {COLUMNS.map((col) => (
                <th
                  key={col || "actions"}
                  className="px-4 py-3 first:pl-6 last:pr-6"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {filteredBooks.length === 0 ? (
              <tr>
                <td colSpan={COLUMNS.length} className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center gap-2 text-[#575E70]">
                    <BookOpen size={28} className="text-[#D0C6AE]" />
                    <p className="font-medium text-[#191C1D]">
                      No matching books found
                    </p>
                    <p className="text-sm">Try refining your search query.</p>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedBooks.map((item) => (
                <BookRow key={item.isbn ?? item.id} item={item} />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      {filteredBooks.length > 0 && (
        <div className="flex items-center justify-between border-t border-[#D0C6AE]/40 px-6 py-4 text-sm text-[#575E70]">
          <span>
            Showing {startIndex + 1}–{Math.min(endIndex, filteredBooks.length)}{" "}
            of {filteredBooks.length} books
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((prev) => prev - 1)}
              disabled={currentPage === 1}
              className="rounded-lg border border-[#D0C6AE] px-3 py-1 disabled:opacity-40"
            >
              Prev
            </button>

            {Array.from({ length: totalPages }, (_, index) => {
              const page = index + 1;

              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`h-8 w-8 rounded-lg text-sm font-medium transition ${
                    currentPage === page
                      ? "bg-[#191C1D] text-[#FCD34D]"
                      : "border border-[#D0C6AE] text-[#191C1D] hover:bg-[#D0C6AE]/20"
                  }`}
                >
                  {page}
                </button>
              );
            })}

            <button
              onClick={() => setCurrentPage((prev) => prev + 1)}
              disabled={currentPage === totalPages}
              className="rounded-lg border border-[#D0C6AE] px-3 py-1 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
