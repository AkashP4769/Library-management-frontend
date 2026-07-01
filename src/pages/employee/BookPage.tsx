import BookCard, { BookDetailsCard } from "@/Components/BookCard";
import { Link } from "react-router";
import { useState } from "react";

import { BookDetailShelfCard } from "@/Components/ShelfCard";
import { useParams } from "react-router";
import { useGetBookReviewQuery } from "@/api-service/reviews/review.api";
import {
  useBorrowBookMutation,
  useGetBookByGenreQuery,
  useGetBookQuery,
  useGetShelvesOfBookQuery,
} from "@/api-service/books/books.api";
import BookReviews from "@/components/Review";
import { useGetUserDetailsQuery } from "@/api-service/login/login.api";

export default function BookPage() {
  const { id } = useParams();
  const { data: book } = useGetBookQuery(parseInt(id || "-1"));
  const { data: userDetails } = useGetUserDetailsQuery();

  const { data: shelves = [] } = useGetShelvesOfBookQuery(book?.isbn ?? "");
  const { data: bookGenre = [] } = useGetBookByGenreQuery(
    {
      genre: book?.genre ?? "",
      id: Number(id),
    },
    {
      skip: !book,
    },
  );

  const [borrowBook] = useBorrowBookMutation();

  const [selectBorrowShelf, setSelectBorrowShelf] = useState<number | null>(
    null,
  );

  const [borrowed, setBorrowed] = useState(false);
  const [requested, setRequested] = useState(false);

  const isBookBorrowed = () => {
    setBorrowed(true);
  };

  function handleBorrowBook() {
    if (book && selectBorrowShelf) {
      borrowBook({
        isbn: book.isbn,
        shelf_id: selectBorrowShelf,
      })
        .unwrap()
        .then(() => {
          isBookBorrowed();
        })
        .catch((error) => {
          console.error("Error borrowing book:", error);
        });
    }
    setBorrowed(true);
  }

  function handleRequestBook() {
    if (book) {
      // Implement the logic to request the book here
      setRequested(true);
    }
  }

  const { data: reviews = [] } = useGetBookReviewQuery(book?.isbn ?? "", {
    skip: !book,
  });

  if (!book) {
    return <div>Book not found</div>;
  }

  const Stars = ({ rating }: { rating: number }) => (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={
            i < Math.round(rating) ? "text-[#735C00]" : "text-[#E7E8E9]"
          }
        >
          ★
        </span>
      ))}
    </div>
  );

  const avgRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum: number, r: any) => sum + (r.rating || 0), 0) /
          reviews.length
        ).toFixed(1)
      : book.rating;

  return (
    <div className="">
      {/* Hero */}
      <section className="flex flex-col gap-8 px-6 py-8 max-w-[1480px] mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-semibold tracking-[0.6px]">
          <span className="text-[#575E70]">HOME</span>
          <span className="text-[#575E70]">/</span>
          <span className="text-[#575E70]">BOOKS</span>
          <span className="text-[#575E70]">/</span>
          <span className="text-[#191C1D]">{book.title}</span>
        </div>

        {/* Main Layout */}
        <div className="grid lg:grid-cols-[1.1fr_2fr_1.6fr] gap-8 w-full items-start">
          {" "}
          {/* Cover */}
          <div className="flex flex-col gap-4">
            <div className="w-[280px] h-[420px] rounded-lg bg-[#E7E8E9] shadow-[0px_10px_30px_-10px_rgba(0,0,0,0.2)] overflow-hidden">
              <BookDetailsCard {...book} />
            </div>
          </div>
          {/* Meta */}
          <div className="flex flex-col gap-5 min-w-0">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#D9DFF5] text-xs font-semibold uppercase text-[#5C6274] w-fit">
              {book.genre}
            </span>

            <h1 className="text-4xl font-bold leading-tight text-[#191C1D]">
              {book.title}
            </h1>

            <p className="text-xl font-semibold text-[#575E70]">
              {book.author}
            </p>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <span>⭐</span>
                <span>{avgRating}</span>
                <span className="text-[#575E70]">
                  ({reviews.length} reviews)
                </span>
              </div>

              <div className="w-px h-4 bg-[#D0C6AE]" />

              <span className="text-[#575E70]">{book.language}</span>
            </div>

            <div className="flex flex-col gap-3">
              <h2 className="text-xl font-semibold text-[#191C1D]">Synopsis</h2>

              <p className="text-base leading-7 text-[#4D4635]">
                {book.description}
              </p>
            </div>
          </div>
          {/* Borrow */}
          <div className="w-full min-w-[300px] max-w-[400px] rounded-2xl border border-[#D0C6AE] p-6 shadow-sm">
            {" "}
            {/* Header */}
            <div className="flex items-center gap-2 pb-4 border-b border-[#D0C6AE]/70">
              <span className="w-2 h-2 rounded-full bg-[#735C00]" />
              <h2 className="text-sm font-semibold uppercase tracking-wide text-[#575E70]">
                Borrow this Book
              </h2>
            </div>
            {/* Shelf Grid */}
            <div className="flex flex-col h-70 overflow-auto gap-3 py-5 px-5">
              {shelves.length > 0 ? (
                shelves.map((shelf) => (
                  <BookDetailShelfCard
                    key={shelf.id}
                    shelf={shelf}
                    selected={selectBorrowShelf === shelf.id}
                    onClickShelf={() => setSelectBorrowShelf(shelf.id)}
                  />
                ))
              ) : (
                <div className="text-center text-[#575E70]">
                  No shelves available for this book.
                </div>
              )}
            </div>
            {/* Footer Actions */}
            <div className="flex gap-3 pt-4 border-t border-[#D0C6AE]/70">
              {shelves.length > 0 ? (
                <button
                  disabled={!selectBorrowShelf || borrowed}
                  onClick={handleBorrowBook}
                  className={`flex-1 rounded-xl px-4 py-3 text-sm font-medium transition ${
                    borrowed
                      ? "bg-[#E7E8E9] text-[#575E70]"
                      : selectBorrowShelf
                        ? "bg-[#735C00] text-white hover:bg-[#5C4A00]"
                        : "bg-[#F3F4F5] text-[#9A9A9A]"
                  }`}
                >
                  {borrowed ? "Borrowed ✓" : "Borrow"}
                </button>
              ) : (
                <>
                  <button
                    disabled={requested}
                    onClick={handleRequestBook}
                    className={`flex-1 rounded-xl px-4 py-3 text-sm font-medium transition ${
                      requested
                        ? "bg-[#E7E8E9] text-[#575E70]"
                        : "bg-[#735C00] text-white hover:bg-[#5C4A00]"
                    }`}
                  >
                    {requested ? "Requested ✓" : "Request to Borrow"}
                  </button>
                  <button className="rounded-xl border border-[#7F7662] px-4 py-3 text-sm font-medium hover:bg-[#F3F4F5]">
                    Notify Me
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="border-t max-w-[1280px]  border-[#D0C6AE]/50 px-6 py-8 mx-auto">
        <BookReviews isbn={book.isbn} currentUserId={userDetails?.userId ?? 0}/>
      </section>

      {/* Similar */}
      <section className="border-t border-[#D0C6AE]/50 px-6 py-8 max-w-[1280px] mx-auto">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-semibold">Similar Books</h2>

          <button className="border border-[#7F7662] rounded-xl px-4 py-2 text-sm">
            View All
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-5">
          {bookGenre.map((book) => (
            <Link key={book.id} to={`/catalog/books/${book.id}`}>
              <BookCard {...book} />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
