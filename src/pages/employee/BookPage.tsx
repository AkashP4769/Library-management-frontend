import BookCard, { LargeBookCard } from "@/Components/BookCard";
import "./BookPage.css";
import { useState } from "react";
import type Book from "@/models/book";
import { books } from "@/models/book";
import type Shelf from "@/models/shelf";
import { shelves as initialShelves } from "@/models/shelf";
import { SmallShelfCard } from "@/Components/ShelfCard";

export default function BookPage() {
  const [myBooks] = useState<Book[]>([...books]);
  const [shelves, setShelves] = useState<Shelf[]>(initialShelves);
  const [selectedShelf, setSelectedShelf] = useState<number | null>(null);
  const [borrowed, setBorrowed] = useState(false);
  const book = myBooks[0];
  return (
    <div className="book-page">
      <section className="book-details-section">
        <h1 className="text-4xl font-bold mb-4">Book Page</h1>
        <p className="text-lg text-gray-600">This is the book page.</p>
        <p className="text-lg text-gray-600">
          You can add more details about the book here.
        </p>
        <div className="grid grid-cols-3 gap-10">
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
        </div>
      </section>

      {/* borrow section */}
      <section className="borrow-section">
        <h2 className="text-2xl font-bold">Borrow this book</h2>
        <p className="text-lg text-gray-600">
          You can borrow this book from the library.
        </p>
        <div className="borrow-tab bg-primary-container/30 border border-primary/40 flex flex-col gap-2">
          <h2 className="text-xl font-semibold">Borrow this Book</h2>
          <div className="mt -6">
            <p className="text-gray-500 mt-2">
              Select Shelf:
              <div className="flex flex-wrap gap-4">
                {shelves.map((shelf) => (
                  <SmallShelfCard
                    key={shelf.id}
                    shelf={shelf}
                    selected={selectedShelf === shelf.id}
                    onClickShelf={() => setSelectedShelf(shelf.id)}
                  />
                ))}
              </div>
            </p>
          </div>

          <div className="flex gap-4 mt-10">
            <button
              disabled={!selectedShelf || borrowed}
              onClick={() => setBorrowed(true)}
              className={`
    rounded-xl borrow-button text-grey/70 transition border-primary

    ${
      borrowed
        ? "bg-primary-container cursor-not-allowed"
        : selectedShelf
          ? "bg-primary/50 hover:opacity-90 border-primary"
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
        <div className="rounded-xl bg-white shadow-sm review-padding overflow-y-auto">
          <div className="flex justify-between">
            <div>
              <h3 className="font-semibold">John Doe</h3>

              <p className="text-sm text-gray-500">2 days ago</p>
            </div>

            <span>⭐⭐⭐⭐⭐</span>
          </div>

          <p className="mt-4 text-gray-600">
            Excellent book for anyone learning software engineering. The
            examples are practical and easy to understand.
          </p>
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
