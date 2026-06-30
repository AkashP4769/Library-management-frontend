import BookCard, { BorrowedBookCard } from "@/Components/BookCard";
import "./MyReads.css";
import { books } from "@/models/book";
import { FaUser, FaEnvelope, FaPhoneAlt } from "react-icons/fa";
import EmptyShelf from "@/Components/EmptyShelf";
import { useState } from "react";
import { SmallShelfCard } from "@/Components/ShelfCard";
import { shelves } from "@/models/shelf";
import type Shelf from "@/models/shelf";

export default function MyReads() {
  const borrowedBooks = books.slice(0, 2);
  const requestedBooks = books.slice(2, 3);
  const [showReturnPanel, setShowReturnPanel] = useState(false);
  const [selectedBorrowId, setSelectedBorrowId] = useState<string | null>(null);
  const [selectedShelfId, setSelectedShelfId] = useState<number | null>(null);
  const [returnShelves, setReturnShelves] = useState<Shelf[]>([]);
  const handleReturnClick = async (borrowId: string) => {
    setSelectedBorrowId(borrowId);

    // TODO: Fetch shelves from backend
    // const shelves = await getReturnShelves(borrowId);

    // Placeholder
    setReturnShelves(shelves);

    setSelectedShelfId(null);
    setShowReturnPanel(true);
  };
  const handleConfirmReturn = async () => {
    if (!selectedBorrowId || !selectedShelfId) return;

    // TODO: Backend call
    /*
  await returnBook({
    borrowId: selectedBorrowId,
    shelfId: selectedShelfId,
  });
  */

    // Close the panel
    setShowReturnPanel(false);
    setSelectedBorrowId(null);
    setSelectedShelfId(null);

    // Optional: refresh borrowed books list
  };

  return (
    <div className="my-reads-page space-y-12">
      {/* User Profile */}
      <section>
        <h1 className="text-4xl font-bold"> My Profile</h1>
        <div className="gap-6 flex flex-col">
          <div className="bg-white rounded-2xl shadow-md p-8 flex items-center gap-12">
            <div className="w-24 h-24 rounded-full bg-primary-container text-white flex items-center justify-center text-3xl font-bold">
              <FaUser />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Aksa George</h2>
              <p className="text-primary font-medium">Employee</p>

              <div className="mt-4 text-gray-600 flex justify-center gap-5">
                <p className="flex gap-2 items-center">
                  <FaPhoneAlt size={18} />
                  678829027
                </p>
                <p className="flex gap-2 items-center">
                  <FaEnvelope size={18} /> aksa@gmail.com
                </p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl shadow p-6 text-center">
              <p className="text-sm uppercase tracking-wide text-gray-500">
                Books Read
              </p>
              <h2 className="text-5xl font-bold mt-3">5</h2>
            </div>

            <div className="bg-white rounded-2xl shadow p-6 text-center">
              <p className="text-sm uppercase tracking-wide text-gray-500">
                Borrowed
              </p>
              <h2 className="text-5xl font-bold mt-3">8</h2>
            </div>

            <div className="bg-white rounded-2xl shadow p-6 text-center">
              <p className="text-sm uppercase tracking-wide text-gray-500">
                Reviews
              </p>
              <h2 className="text-5xl font-bold mt-3">12</h2>
            </div>
          </div>
        </div>
      </section>
      <div>
        <h1 className="text-3xl font-bold">My Reads</h1>
        <p className="text-gray-500">
          Manage your borrowed, requested and saved books.
        </p>
      </div>
      {/* Borrowed */}
      <section>
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-2xl font-bold">My Reads</h2>

          <p className="text-primary font-bold cursor-pointer hover:underline">
            VIEW ALL
          </p>
        </div>

        <div className="grid grid-cols-5 gap-6">
          {borrowedBooks.length ? (
            borrowedBooks.map((book) => (
              <BookCard
                key={book.id} //book.borrowid
                {...book}
              />
            ))
          ) : (
            <EmptyShelf message="No borrowed books" />
          )}
        </div>
      </section>

      <section>
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-2xl font-bold">Currently Borrowed</h2>

          <p className="text-primary font-bold cursor-pointer hover:underline">
            VIEW ALL
          </p>
        </div>

        <div className="grid grid-cols-5 gap-6">
          {borrowedBooks.length ? (
            borrowedBooks.map((book) => (
              <BorrowedBookCard
                book={book}
                onReturnClick={handleReturnClick}
                key={book.id} //book.borrowid
                {...book}
              />
            ))
          ) : (
            <EmptyShelf message="No borrowed books" />
          )}
        </div>
        {showReturnPanel && (
          <div className="mt-5  rounded-2xl border border-neutral-200 bg-white p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-4">
              Select a shelf to return the book
            </h2>

            <div className="flex flex-wrap gap-3">
              {returnShelves.map((shelf) => (
                <SmallShelfCard
                  key={shelf.id}
                  shelf={shelf}
                  selected={selectedShelfId === shelf.id}
                  onClickShelf={() => setSelectedShelfId(shelf.id)}
                />
              ))}
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowReturnPanel(false)}
                className="rounded-lg border border-neutral-300 px-4 py-2 hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                disabled={!selectedShelfId}
                onClick={handleConfirmReturn}
                className="rounded-lg bg-primary px-4 py-2 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Return
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Requested */}

      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Requested Books</h2>

          <p className="text-primary font-bold cursor-pointer hover:underline">
            VIEW ALL
          </p>
        </div>

        <div className="grid grid-cols-5 gap-6">
          {requestedBooks.length ? (
            requestedBooks.map((book) => <BookCard key={book.id} {...book} />)
          ) : (
            <EmptyShelf message="No pending requests" />
          )}
        </div>
      </section>

      {/* Saved

      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">WishList</h2>

          <p className="text-primary font-bold cursor-pointer hover:underline">
            VIEW ALL
          </p>
        </div>

        <div className="grid grid-cols-5 gap-6">
          {savedBooks.length ? (
            savedBooks.map((book) => <BookCard key={book.id} {...book} />)
          ) : (
            <EmptyShelf message="No books added in Wishlist" />
          )}
        </div>
      </section> */}
    </div>
  );
}
