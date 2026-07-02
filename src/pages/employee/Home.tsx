import type Book from "@/models/book";
import { useEffect, useState } from "react";
import "./Home.css";
import BookCard, { SmallBookCard } from "@/Components/BookCard";
import {
  useGetBooksQuery,
  useGetBorrowedBooksByUserQuery,
} from "@/api-service/books/books.api";
import {
  transformBorrowedBookToBook,
  type BorrowedBook,
  type FilterParamsType,
} from "@/api-service/books/types";
import { Link } from "react-router";

export default function HomePage() {
  const [filterParams, setFilterParams] = useState<FilterParamsType>({
    q: undefined,
  });
  const { data: fetchedBooks } = useGetBooksQuery(filterParams, {});
  const [myBooks, setMyBooks] = useState<Book[]>([]);
  const [exploreBooks, setExploreBooks] = useState<Book[]>([]);
  const { data: borrowedBooksInformation = [] } =
    useGetBorrowedBooksByUserQuery();

  useEffect(() => {
    if (borrowedBooksInformation) {
      console.log("Borrowed Books Information:", borrowedBooksInformation); // Debugging line to check the data
      // const filteredBooks = borrowedBooksInformation.filter(
      //   (book) => book.status === "RETURNED",
      // );
      setMyBooks(transformBorrowedBookToBook(borrowedBooksInformation, true));
    }
  }, [borrowedBooksInformation]);

  useEffect(() => {
    if (fetchedBooks) {
      setExploreBooks([...fetchedBooks]);
    }
  }, [fetchedBooks]);

  console.log("Fetched Books:", fetchedBooks);
  console.log("My Books State:", myBooks);

  const [showMyBooks, setShowMyBooks] = useState(false);
  const [showAllBooks, setShowAllBooks] = useState(false);

  return (
    <div className="home-page px-4 sm:px-6 lg:px-8">
      {/* My Books */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl sm:text-2xl font-bold">My Books</h2>

          {myBooks.length > 5 && (
            <button
              onClick={() => setShowMyBooks(!showMyBooks)}
              className="text-primary font-semibold hover:underline text-sm sm:text-base"
            >
              {showMyBooks ? "SHOW LESS" : "VIEW ALL"}
            </button>
          )}
        </div>

        <div
          className={`grid gap-6 transition-all duration-300 overflow-hidden
        grid-cols-1
        sm:grid-cols-2
        md:grid-cols-3
        lg:grid-cols-4
        xl:grid-cols-5
        ${showMyBooks ? "max-h-[5000px]" : "max-h-[500px]"}
      `}
        >
          {myBooks.length === 0 ? (
            <p className="text-primary text-xl font-semibold">No books found</p>
          ) : (
            myBooks.map((book) => (
              <Link key={book.book_id} to={`/catalog/books/${book.id}`}>
                <BookCard {...book} />
              </Link>
            ))
          )}
        </div>
      </section>

      {/* Popular Books */}
      <section className="mt-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl sm:text-2xl font-bold">
            Most Popular This Week
          </h2>

          {exploreBooks.length > 5 && (
            <button
              onClick={() => setShowAllBooks(!showAllBooks)}
              className="text-primary font-semibold hover:underline text-sm sm:text-base"
            >
              {showAllBooks ? "SHOW LESS" : "VIEW ALL"}
            </button>
          )}
        </div>

        <div
          className={`grid gap-4 transition-all duration-300 overflow-hidden
        grid-cols-1
        sm:grid-cols-1
        md:grid-cols-2
        lg:grid-cols-3
        xl:grid-cols-4
        ${showAllBooks ? "max-h-[3000px]" : "max-h-[260px]"}
      `}
        >
          {exploreBooks.length === 0 ? (
            <p className="text-primary text-xl font-semibold">No books found</p>
          ) : (
            exploreBooks.map((book) => (
              <Link key={book.id} to={`/catalog/books/${book.id}`}>
                <SmallBookCard {...book} />
              </Link>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
