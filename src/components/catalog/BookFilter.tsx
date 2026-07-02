import type { FilterParamsType } from "@/api-service/books/types";
import { useState, useEffect, useRef } from "react";

interface BookFiltersProps {
  filterParams: FilterParamsType;
  onChange: (params: FilterParamsType) => void;
}

const GENRES = ["Fiction", "Non-Fiction", "Sci-Fi", "Fantasy", "Mystery", "Biography"];
const LANGUAGES = ["English", "Spanish", "French", "German", "Malayalam"];
const DEBOUNCE_MS = 400;

export function BookFilters({ filterParams, onChange }: BookFiltersProps) {
  const [query, setQuery] = useState(filterParams.q ?? "");
  const [showFilters, setShowFilters] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  // debounce search input -> filterParams.q
  useEffect(() => {
    const handle = setTimeout(() => {
      if (query !== (filterParams.q ?? "")) {
        onChange({ ...filterParams, q: query || undefined });
      }
    }, DEBOUNCE_MS);
    return () => clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  // close popover on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setShowFilters(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectChange = (key: "genre" | "language", value: string) => {
    onChange({ ...filterParams, [key]: value || undefined });
  };

  const hasActiveFilters = filterParams.genre || filterParams.language;

  return (
    <div className="relative w-full max-w-md mb-6" ref={popoverRef}>
      <div className="flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
        {/* search icon */}
        <svg className="h-4 w-4 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
        </svg>

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by title or author..."
          className="flex-1 text-sm outline-none"
        />

        {/* filter icon */}
        <button
          type="button"
          onClick={() => setShowFilters((s) => !s)}
          className={`relative shrink-0 rounded p-1 hover:bg-gray-100 ${showFilters ? "bg-gray-100" : ""}`}
        >
          <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M3 4h18M6 8h12M10 12h4" />
          </svg>
          {hasActiveFilters && (
            <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-blue-600" />
          )}
        </button>
      </div>

      {showFilters && (
        <div className="absolute right-0 z-10 mt-2 w-56 rounded-lg border border-gray-200 bg-white p-3 shadow-lg space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Genre</label>
            <select
              value={filterParams.genre ?? ""}
              onChange={(e) => handleSelectChange("genre", e.target.value)}
              className="w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm"
            >
              <option value="">All genres</option>
              {GENRES.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Language</label>
            <select
              value={filterParams.language ?? ""}
              onChange={(e) => handleSelectChange("language", e.target.value)}
              className="w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm"
            >
              <option value="">All languages</option>
              {LANGUAGES.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>

          {hasActiveFilters && (
            <button
              onClick={() => onChange({ ...filterParams, genre: undefined, language: undefined })}
              className="text-xs text-gray-500 hover:text-gray-800 underline"
            >
              Clear filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}