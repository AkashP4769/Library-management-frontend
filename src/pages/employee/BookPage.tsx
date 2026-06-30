import BookCard, { LargeBookCard } from "@/Components/BookCard";
import "./BookPage.css";
import { useState } from "react";
import type Book from "@/models/book";
import { books } from "@/models/book";
import type Shelf from "@/models/shelf";
import { shelves as initialShelves } from "@/models/shelf";
import { SmallShelfCard } from "@/Components/ShelfCard";
import { useParams } from "react-router";
import { useGetBookReviewQuery } from "@/api-service/reviews/review.api";

export default function BookPage() {
  const [myBooks] = useState<Book[]>([...books]);
  const { id } = useParams();
  const [shelves, setShelves] = useState<Shelf[]>(initialShelves);
  const [selectBorrowShelf, setSelectBorrowShelf] = useState<number | null>(
    null,
  );
  const [selectReturnShelf, setSelectReturnShelf] = useState<number | null>(
    null,
  );
  const [borrowed, setBorrowed] = useState(false);
  const [returned, setReturned] = useState(false);
  const isBookBorrowed = () => {
    setBorrowed(true);
    setSelectReturnShelf(null);
    setReturned(false);
  };
  const isBookReturned = () => {
    setSelectBorrowShelf(null);
    setBorrowed(false);
    setReturned(true);
  };
  const book = myBooks.find((book) => book.id == id);
  if (!book) {
    return <div>Book not found</div>;
  }
  const { data: reviews = [] } = useGetBookReviewQuery(id);

  return (
    <div className="book-page">
      <section className="book-details-section">
        <h1 className="text-4xl font-bold mb-4">Book Page</h1>
        <p className="text-lg text-gray-600">This is the book page.</p>
        <p className="text-lg text-gray-600">
          You can add more details about the book here.
        </p>
        <div className="grid grid-cols-3 gap-10 h-[600px]">
          <div>{book && <LargeBookCard {...book} />}</div>
          <div className="flex flex-col itens-center justify-center gap-6">
            <h1 className="text-5xl font-bold">{book.title}</h1>

            <p className="text-2xl text-gray-500 mt-2">{book.author}</p>

            <div className="flex gap-6 mt-6 text-lg">
              <span>⭐ {book.rating}</span>

              <span>{book.genre}</span>

              <span>{book.language}</span>
            </div>

            <p className="mt-8 text-gray-600 leading-8">{book.description}</p>
          </div>
          <div className="borrow-tab w-90 justify-between bg-primary-container/30 border border-primary/40 flex flex-col gap-2 justify-self-end">
            <h2 className="text-xl font-semibold">Borrow this Book</h2>
            <div className="mt -6">
              <p className="text-gray-500 mt-2 ">
                Select Shelf:
                <div className="flex flex-wrap gap-4 justify-center mt-2">
                  {shelves.map((shelf) => (
                    <SmallShelfCard
                      key={shelf.id}
                      shelf={shelf}
                      selected={selectBorrowShelf === shelf.id}
                      onClickShelf={() => setSelectBorrowShelf(shelf.id)}
                    />
                  ))}
                </div>
              </p>
            </div>

            <div className="flex gap-4 mt-10">
              <button
                disabled={!selectBorrowShelf || borrowed}
                onClick={isBookBorrowed}
                className={`
    rounded-xl borrow-button text-grey/70 transition border-primary

    ${
      borrowed
        ? "bg-primary/50 cursor-not-allowed"
        : selectBorrowShelf
          ? "bg-primary-container hover:opacity-90 border-primary cursor-pointer"
          : "bg-primary-400 cursor-not-allowed border-primary"
    }
  `}
              >
                {borrowed ? "Borrowed ✓" : "Borrow"}
              </button>
              <button className=" borrow-button border rounded-xl px-6 py-3">
                Save
              </button>
            </div>
          </div>
        </div>
        {/* </div> */}
      </section>

      {/* reviews section */}
      <section className="reviews-section">
        <h2 className="text-2xl font-bold">Reviews</h2>
        <p className="text-lg text-gray-600">
          Read what others have to say about this book.
        </p>
        <p className="text-lg text-gray-600">
          Maybe we can add the whole borrow logic here or make a new page
        </p>
        <div>
          {reviews.map((review) => (
            <div className="rounded-xl bg-white shadow-sm review-padding mt-2">
              <div className="flex justify-between">
                <div>
                  <h3 className="font-semibold">{review.name}</h3>

                  <p className="text-sm text-gray-500">{review.createdAt}</p>
                </div>

                <span>⭐{review.rating}</span>
              </div>

              <p className="mt-4 text-gray-600">{review.content}</p>
            </div>
          ))}
        </div>
      </section>
      {/* return section */}
      <section className="return-section">
        <h2 className="text-2xl font-bold">Return this book</h2>
        <p className="text-lg text-gray-600">
          You can return this book to the library.
        </p>
        <div className="borrow-tab bg-primary-container/30 border border-primary/40 flex flex-col gap-2">
          <h2 className="text-xl font-semibold">Return this Book</h2>
          <div className="mt -6">
            <p className="text-gray-500 mt-2">
              Select Shelf:
              <div className="flex flex-wrap gap-4">
                {shelves.map((shelf) => (
                  <SmallShelfCard
                    key={shelf.id}
                    shelf={shelf}
                    selected={selectReturnShelf === shelf.id}
                    onClickShelf={() => setSelectReturnShelf(shelf.id)}
                  />
                ))}
              </div>
            </p>
          </div>

          <div className="flex gap-4 mt-10">
            <button
              disabled={!selectReturnShelf || !borrowed}
              onClick={isBookReturned}
              className={`
    rounded-xl borrow-button text-grey/70 transition border-primary

    ${
      returned
        ? "bg-primary/50 cursor-not-allowed"
        : selectReturnShelf
          ? "bg-primary-container hover:opacity-90 border-primary cursor-pointer"
          : "bg-primary-400 cursor-not-allowed border-primary"
    }
  `}
            >
              {!borrowed ? "Returned " : "Return"}
            </button>
            <button className=" borrow-button border rounded-xl px-6 py-3">
              Save
            </button>
          </div>
        </div>
      </section>

      {/* similar books section */}
      <section className="similar-books-section mt-14">
        <h2 className="text-2xl font-bold">Similar Books</h2>

        <div className="flex justify-between items-center mb-5">
          <p className="text-lg text-gray-600">
            Check out these similar books.
          </p>
          <button className="text-primary">View All</button>
        </div>

        <div className="grid grid-cols-5 gap-6">
          {books.map((book) => (
            <BookCard key={book.id} {...book} />
          ))}
        </div>
      </section>
    </div>
  );
}
