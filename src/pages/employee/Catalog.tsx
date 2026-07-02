import type Book from "@/models/book";
import type Shelf from "@/models/shelf";
import { shelves as initialShelves } from "@/models/shelf";
import { useEffect, useState } from "react";
import "./Catalog.css";
import BookCard from "@/Components/BookCard";
import ShelfCard from "@/Components/ShelfCard";
import { useGetBooksQuery } from "@/api-service/books/books.api";
import { Link, useLocation, useNavigate } from "react-router";
import { useGetBooksByShelfQuery, useGetShelvesQuery } from "@/api-service/shelf/shelf.api";
import type { FilterParamsType } from "@/api-service/books/types";
import { BookFilters } from "@/components/catalog/BookFilter";





export default function CatalogPage() {
  const [filterParams, setFilterParams] = useState<FilterParamsType>({
    q: undefined,
    author: undefined,
    genre: undefined,
    language: undefined,
  });

  const { data: fetchedBooks } = useGetBooksQuery(filterParams, {});

  const { data: fetchedShelves } = useGetShelvesQuery();
  const [shelves, setShelves] = useState<Shelf[]>(initialShelves);
  const [selectedShelfId, setSelectedShelfId] = useState<number | null>(null);
  const selectedShelf = shelves.find((shelf) => shelf.id === selectedShelfId);
  const {
    data: shelfBooks = [],
    isFetching: isFetchingShelfBooks,
  } = useGetBooksByShelfQuery(
    {
      shelfId: selectedShelfId ?? 0,
      ...filterParams
    },
    {
      skip: selectedShelfId === null,
    }
  );

  const [books, setBooks] = useState<Book[]>([]);
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    if (fetchedShelves) {
      setShelves([...fetchedShelves]);
    }
  }, [fetchedShelves]);

  useEffect(() => {
    if (fetchedBooks) {
      setBooks([...fetchedBooks]);
    }
  }, [fetchedBooks, filterParams]);

  // Read shelfId from query params so other pages can link to /catalog?shelfId=...
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const shelfParam = params.get("shelfId");
    if (shelfParam) {
      const id = Number(shelfParam);
      if (!Number.isNaN(id)) setSelectedShelfId(id);
    }
  }, [location.search]);

  const visibleBooks = selectedShelfId ? shelfBooks : books;
  const noBooksMessage = selectedShelf
    ? `No books found in ${selectedShelf.shelf_code}`
    : "No books found";

  return (
    <div className="catalog-page">
      <section className="books-section">
        <div className="flex justify-between items-center">
          <div className="flex w-full items-center  justify-between gap-1">
            <div>
              <h2 className="text-2xl font-bold">
              {selectedShelf ? `${selectedShelf.shelf_code} Books` : "Explore"}
              </h2>
              {selectedShelf && (
                <p className="text-sm text-tertiary">
                  Showing books available in {selectedShelf.office_location}
                </p>
              )}
            </div>
            <div className="flex items-center justify-end gap-4">
              <BookFilters filterParams={filterParams} onChange={setFilterParams} />
              {selectedShelf && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedShelfId(null);
                    navigate('/catalog');
                  }}
                  className="text-primary w-40 mb-6 font-bold hover:underline cursor-pointer"
                >
                  SHOW ALL
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-5 gap-6">
          {isFetchingShelfBooks ? (
            <p className="text-bold text-primary text-xl">Loading shelf books...</p>
          ) : visibleBooks.length === 0 ? (
            <p className="text-bold text-primary text-xl">{noBooksMessage}</p>
          ) : (
            visibleBooks.map((book) =>
              book.id ? (
                <Link key={`${book.isbn}-${book.id}`} to={`/catalog/books/${book.id}`}>
                  <BookCard {...book} />
                </Link>
              ) : (
                <div key={book.isbn}>
                  <BookCard {...book} />
                </div>
              ),
            )
          )}
        </div>
      </section>
    </div>
  );
}
