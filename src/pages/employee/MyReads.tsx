import BookCard, { BorrowedBookCard } from "@/Components/BookCard";
import { Link } from "react-router";
import "./MyReads.css";
import { books } from "@/models/book";
import { FaUser, FaEnvelope, FaPhoneAlt, FaEdit } from "react-icons/fa";
import EmptyShelf from "@/Components/EmptyShelf";
import { useEffect, useState } from "react";
import { SmallShelfCard } from "@/Components/ShelfCard";
import {
  useUpdateUserMutation,
  useUserQuery,
} from "@/api-service/user/user.api";
import {
  useGetBorrowedBooksByUserQuery,
  useReturnBorrowedBookMutation,
} from "@/api-service/books/books.api";
import type Book from "@/models/book";
import { transformBorrowedBookToBook } from "@/api-service/books/types";
import { useGetShelvesQuery } from "@/api-service/shelf/shelf.api";
import { useToast } from "@/Components/ui/Toast";
import { useGetUserReviewsQuery } from "@/api-service/reviews/review.api";

export default function MyReads() {
  const { data: borrowedBooksInformation = [] } =
    useGetBorrowedBooksByUserQuery();
  const [borrowedBooks, setBorrowedBooks] = useState<Book[]>([]);
  const [myBooks, setMyBooks] = useState<Book[]>([]);
  const [returnBorrowedBook] = useReturnBorrowedBookMutation();
  const { data: fetchshelves } = useGetShelvesQuery();
  const { toast } = useToast();
  const { data: userReviews = [] } = useGetUserReviewsQuery();
  const requestedBooks = books.slice(2, 3);
  const { data: user } = useUserQuery();
  const [showReturnPanel, setShowReturnPanel] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedBorrowId, setSelectedBorrowId] = useState<number | null>(null);
  const [selectedShelfId, setSelectedShelfId] = useState<number | null>(null);
  const [updateUser, { isLoading }] = useUpdateUserMutation();

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    const payload = {
      name: String(formData.get("name") || ""),
      email: String(formData.get("email") || ""),
      contact_number: formData.get("contact_number")
        ? String(formData.get("contact_number"))
        : undefined,
    };

    try {
      await updateUser(payload).unwrap();
      setIsEditing(false);
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    if (borrowedBooksInformation) {
      console.log("Borrowed Books Information:", borrowedBooksInformation); // Debugging line to check the data
      const filteredBooks = borrowedBooksInformation.filter(
        (book) => book.status === "BORROWED",
      );
      setBorrowedBooks(transformBorrowedBookToBook(filteredBooks));
    }
  }, [borrowedBooksInformation]);

  useEffect(() => {
    if (borrowedBooksInformation) {
      console.log("Borrowed Books Information:", borrowedBooksInformation); // Debugging line to check the data
      const filteredBooks = borrowedBooksInformation.filter(
        (book) => book.status === "RETURNED",
      );
      setMyBooks(transformBorrowedBookToBook(filteredBooks));
    }
  }, [borrowedBooksInformation]);

  const handleReturnClick = async (borrowId: number) => {
    setSelectedBorrowId(borrowId);
    setSelectedShelfId(null);
    setShowReturnPanel(true);
  };
  const handleConfirmReturn = async () => {
    if (!selectedBorrowId || !selectedShelfId) {
      toast({
        title: "Select a return shelf",
        description:
          "Choose where this book should be placed before returning it.",
        variant: "error",
      });
      return;
    }

    console.log(
      `Returning borrowId: ${selectedBorrowId} to shelfId: ${selectedShelfId}`,
    );
    returnBorrowedBook({ borrowId: selectedBorrowId, shelfId: selectedShelfId })
      .unwrap()
      .then(() => {
        toast({
          title: "Book returned",
          description: "The borrowed book was returned successfully.",
          variant: "success",
        });
        console.log("Book returned successfully");
      })
      .catch((error) => {
        // Handle error, e.g., show an error message
        toast({
          title: "Return failed",
          description:
            error?.message || "Error returning book. Please try again.",
          variant: "error",
        });
        console.error("Error returning book:", error);
      });

    // Close the panel
    setShowReturnPanel(false);
    setSelectedBorrowId(null);
    setSelectedShelfId(null);

    // Optional: refresh borrowed books list
  };
  if (!fetchshelves) {
    return <div>Shelf not found</div>;
  }

  return (
    <div className="my-reads-page space-y-12">
      {/* User Profile */}
      <section>
        <h1 className="text-4xl font-bold"> My Profile</h1>
        <div className="gap-6 flex flex-col">
          <div className="bg-white rounded-2xl shadow-md p-8 relative">
            {/* Edit Button */}
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="absolute top-6 right-6 flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition"
            >
              <FaEdit />
              {isEditing ? "Cancel" : "Edit Profile"}
            </button>

            <div className="flex items-center gap-12">
              <div className="w-24 h-24 rounded-full bg-primary-container text-white flex items-center justify-center text-3xl">
                <FaUser />
              </div>

              <div>
                <h2 className="text-2xl font-bold">{user?.name}</h2>

                <p className="text-primary font-medium capitalize">
                  {user?.role}
                </p>

                <div className="mt-4 flex gap-6 text-gray-600">
                  <p className="flex items-center gap-2">
                    <FaPhoneAlt />
                    {user?.contact_number || "Not provided"}
                  </p>

                  <p className="flex items-center gap-2">
                    <FaEnvelope />
                    {user?.email}
                  </p>
                </div>
              </div>
            </div>
          </div>
          {isEditing && (
            <form
              onSubmit={handleSubmit}
              className="mt-6 bg-white rounded-2xl shadow-md p-8"
            >
              <h3 className="text-xl font-semibold mb-6">Edit Profile</h3>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Name</label>

                  <input
                    type="text"
                    defaultValue={user?.name}
                    name="name"
                    className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Email
                  </label>

                  <input
                    type="email"
                    defaultValue={user?.email}
                    name="email"
                    className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Contact Number
                  </label>

                  <input
                    type="text"
                    defaultValue={user?.contact_number ?? ""}
                    name="contact_number"
                    className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-8">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-5 py-2 rounded-lg border border-gray-300 hover:bg-gray-100"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-5 py-2 rounded-lg bg-primary text-white hover:bg-primary/90"
                >
                  {isLoading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          )}

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl shadow p-6 text-center">
              <p className="text-sm uppercase tracking-wide text-gray-500">
                Books Read
              </p>
              <h2 className="text-5xl font-bold mt-3">{myBooks.length}</h2>
            </div>

            <div className="bg-white rounded-2xl shadow p-6 text-center">
              <p className="text-sm uppercase tracking-wide text-gray-500">
                Borrowed
              </p>
              <h2 className="text-5xl font-bold mt-3">
                {borrowedBooks.length}
              </h2>
            </div>

            <div className="bg-white rounded-2xl shadow p-6 text-center">
              <p className="text-sm uppercase tracking-wide text-gray-500">
                Reviews
              </p>
              <h2 className="text-5xl font-bold mt-3">{userReviews.length}</h2>
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
          {myBooks.length ? (
            myBooks.map((book) => (
              <Link key={book.id} to={`/catalog/books/${book.id}`}>
                <BookCard {...book} />
              </Link>
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
              {fetchshelves.map((shelf) => (
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
            requestedBooks.map((book) => (
              <Link key={book.id} to={`/catalog/books/${book.id}`}>
                <BookCard {...book} />
              </Link>
            ))
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
