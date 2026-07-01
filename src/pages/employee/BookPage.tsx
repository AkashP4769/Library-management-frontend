import BookCard, { BookDetailsCard } from "@/Components/BookCard";
import { useState } from "react";

import { BookDetailShelfCard } from "@/Components/ShelfCard";
import { useParams } from "react-router";
import { useGetBookReviewQuery } from "@/api-service/reviews/review.api";
import {
  useGetBookByGenreQuery,
  useGetBookQuery,
  useGetShelvesOfBookQuery,
} from "@/api-service/books/books.api";

export default function BookPage() {
  const { id } = useParams();
  const { data: book } = useGetBookQuery(parseInt(id || "-1"));

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

  const [selectBorrowShelf, setSelectBorrowShelf] = useState<number | null>(
    null,
  );

  const [borrowed, setBorrowed] = useState(false);

  const isBookBorrowed = () => {
    setBorrowed(true);
  };

  const { data: reviews = [] } = useGetBookReviewQuery(id);
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
                <span>{book.rating}</span>
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
              {shelves.map((shelf) => (
                <BookDetailShelfCard
                  key={shelf.id}
                  shelf={shelf}
                  selected={selectBorrowShelf === shelf.id}
                  onClickShelf={() => setSelectBorrowShelf(shelf.id)}
                />
              ))}
            </div>
            {/* Footer Actions */}
            <div className="flex gap-3 pt-4 border-t border-[#D0C6AE]/70">
              <button
                disabled={!selectBorrowShelf || borrowed}
                onClick={isBookBorrowed}
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

              <button className="rounded-xl border border-[#7F7662] px-4 py-3 text-sm font-medium hover:bg-[#F3F4F5]">
                Save
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="border-t border-[#D0C6AE]/50 px-6 py-8 max-w-[1280px] mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Reviews</h2>

          <button className="border border-[#7F7662] rounded-xl px-4 py-2 text-sm">
            View All
          </button>
        </div>

        {/* Rating Summary */}
        <div className="flex items-center gap-6 bg-[#F3F4F5] rounded-xl p-5 mb-6">
          <div className="flex flex-col items-center pr-6 border-r border-[#D0C6AE]">
            <span className="text-4xl font-bold">{avgRating}</span>
            <Stars rating={Number(avgRating)} />
            <span className="text-xs text-[#575E70]">
              {reviews.length} ratings
            </span>
          </div>

          <div className="flex-1 flex flex-col gap-2">
            {[5, 4, 3].map((star) => (
              <div key={star} className="flex items-center gap-3">
                <span className="w-4 text-xs">{star}</span>

                <div className="flex-1 h-2 rounded-full bg-[#E7E8E9] overflow-hidden">
                  <div
                    className="h-full bg-[#735C00]"
                    style={{
                      width: star === 5 ? "85%" : star === 4 ? "10%" : "3%",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Review Cards */}
        <div className="flex flex-col gap-4">
          {reviews.map((review: any) => (
            <div
              key={review.id}
              className="border border-[#D0C6AE]/50 rounded-xl p-5"
            >
              <div className="flex justify-between mb-3">
                <div>
                  <h3 className="font-bold">{review.name}</h3>
                  <p className="text-xs uppercase text-[#575E70]">
                    {review.createdAt}
                  </p>
                </div>
              </div>

              <Stars rating={review.rating} />

              <p className="text-sm leading-6 text-[#4D4635] mt-3">
                {review.content}
              </p>
            </div>
          ))}
        </div>
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
            <BookCard key={book.id} {...book} />
          ))}
        </div>
      </section>
    </div>
  );
}
