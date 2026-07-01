import type Book from "@/models/book";
import type Shelf from "@/models/shelf";
import { shelves as initialShelves } from "@/models/shelf";
import { useEffect, useState } from "react";
import "./Catalog.css";
import BookCard from "@/Components/BookCard";
import ShelfCard from "@/Components/ShelfCard";
import { useGetBooksQuery } from "@/api-service/books/books.api";
import { Link } from "react-router";
import { useGetShelvesQuery } from "@/api-service/shelf/shelf.api";

export default function CatalogPage() {
  const { data: fetchedBooks } = useGetBooksQuery();
  const { data: fetchedShelves } = useGetShelvesQuery();
  const [shelves, setShelves] = useState<Shelf[]>(initialShelves);

  const [books, setBooks] = useState<Book[]>([]);
  useEffect(() => {
    if (fetchedShelves) {
      setShelves([...fetchedShelves]);
    }
  }, [fetchedShelves]);

  useEffect(() => {
    if (fetchedBooks) {
      setBooks([...fetchedBooks]);
    }
  }, [fetchedBooks]);

  return (
    <div className="catalog-page">
      <section className="books-section">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Explore</h2>
          <p className="text-primary font-bold hover:underline cursor-pointer">
            Filter Icon
          </p>
        </div>
        <div
          className="grid  gap-6 grid-cols-1
        sm:grid-cols-2
        md:grid-cols-3
        lg:grid-cols-4
        xl:grid-cols-5"
        >
          {books.length === 0 ? (
            <p className="text-bold text-primary text-xl">No books found</p>
          ) : (
            books.map((book) => (
              <Link key={book.id} to={`/catalog/books/${book.id}`}>
                <BookCard {...book} />
              </Link>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
