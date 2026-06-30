import BookCard from "@/Components/BookCard";
import "./MyReads.css";
import { books } from "@/models/book";
import EmptyShelf from "@/Components/EmptyShelf";

// export default function MyReads() {
//     return (
// <div className="my-reads-page">
//     <section className="my-reads-section">
//         <h1 className="text-4xl font-bold mb-4">My Reads</h1>
//         <p className="text-lg text-gray-600">This is the My Reads page.</p>
//         <p className="text-lg text-gray-600">You can add more details about your reads here.</p>
//     </section>

//     {/* borrowed books section */}
//     <section className="borrowed-books-section">
//         <h2 className="text-2xl font-bold">Borrowed Books</h2>
//         <p className="text-lg text-gray-600">These are the books you have borrowed.</p>
//     </section>

//     {/* Books requested section */}
//     <section className="books-requested-section">
//         <h2 className="text-2xl font-bold">Books Requested</h2>
//         <p className="text-lg text-gray-600">These are the books you have requested.</p>
//     </section>

//     {/* saved books section */}
//     <section className="saved-books-section">
//         <h2 className="text-2xl font-bold">Saved Books</h2>
//         <p className="text-lg text-gray-600">These are the books you have saved for later.</p>
//     </section>
// </div>
export default function MyReads() {
  const borrowedBooks = books.slice(0, 2);
  const requestedBooks = books.slice(2, 3);
  const savedBooks = books.slice(1, 4);

  return (
    <div className="my-reads-page space-y-12">
      <div>
        <h1 className="text-4xl font-bold">My Reads</h1>
        <p className="text-gray-500 mt-2">
          Manage your borrowed, requested and saved books.
        </p>
      </div>
      {/* User Profile */}
      <section>
        <h1></h1>
        <div></div>
      </section>

      {/* Borrowed */}

      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Currently Borrowed</h2>

          <p className="text-primary font-bold cursor-pointer hover:underline">
            VIEW ALL
          </p>
        </div>

        <div className="grid grid-cols-5 gap-6">
          {borrowedBooks.length ? (
            borrowedBooks.map((book) => <BookCard key={book.id} {...book} />)
          ) : (
            <EmptyShelf message="No borrowed books" />
          )}
        </div>
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

      {/* Saved */}

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
      </section>
    </div>
  );
}
