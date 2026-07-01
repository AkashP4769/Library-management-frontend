import type Book from "@/models/book";
import { BASE_URL } from "@/api-service/api";
import { useState, type MouseEvent } from "react";
import { useNavigate } from "react-router";
import { Heart } from "lucide-react";
export default function BookCard(book: Book) {
  const hasShelfCopies = typeof book.total_copies === "number";
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(false);

  function handleClick(event: MouseEvent<HTMLDivElement>) {
    const target = event.target as HTMLElement;

    if (target.closest("button")) {
      return;
    }

    if (book.id) {
      navigate(`/catalog/books/${book.id}`);
    }
  }

  return (
    <div
      key={book.id}
      onClick={handleClick}
      role={book.id ? "button" : undefined}
      tabIndex={book.id ? 0 : undefined}
      className="cursor-pointer flex flex-col h-120 w-full items-center rounded-2xl justify-center border-2 border-neutral-200 hover:bg-white duration-200 relative"
    >
      <div className="flex flex-col h-[90%] w-[90%]  items-start justify-between">
        <div className="relative h-[85%] w-full">
          <img
            src={book.image_url}
            alt={book.title}
            className="w-full h-full object-cover rounded-2xl"
          />
          <button
            type="button"
            aria-label={isLiked ? "Remove from favorites" : "Add to favorites"}
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              setIsLiked((prev) => !prev);
            }}
            className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 shadow-md backdrop-blur-sm transition hover:scale-110"
          >
            <Heart
              className={`h-6 w-6 transition-all duration-200 ${
                isLiked
                  ? "fill-red-500 text-red-500"
                  : "fill-transparent text-white hover:text-red-400"
              }`}
              strokeWidth={2}
            />
          </button>
          {hasShelfCopies && (
            <span className="absolute left-3 top-3 rounded-lg bg-white/95 px-3 py-1 text-xs font-bold text-secondary shadow">
              {book.total_copies} copies
            </span>
          )}
        </div>
        <div className="w-full flex justify-between items-center">
          <div>
            <h3 className="text-lg font-bold mt-2 text-clip line-clamp-1">
              {book.title}
            </h3>
            <p className="text-tertiary line-clamp-1">{book.author}</p>
            {hasShelfCopies && (
              <p className="text-xs font-medium text-primary">
                {book.available_copies ?? 0} available / {book.total_copies}{" "}
                total
              </p>
            )}
          </div>
          <p className="text-md text-muted-foreground">
            {book.rating ? `⭐ ${book.rating.toFixed(1)}` : ""}
          </p>
        </div>
      </div>
    </div>
  );
}

// function SmallBookCard(book: Book) {
// //   const imageUrl = book.image_url.startsWith('/uploads/') ? BASE_URL + book.image_url : book.image_url;
//   return (
//     <div
//       key={book.id}
//       className="flex flex-col h-120 w-full items-center rounded-2xl justify-center border-2 border-neutral-200 hover:bg-white duration-200"
//     >
//       <div className="flex flex-col h-[90%] w-[90%]  items-start justify-between">
//         <img
//           src={imageUrl}
//           alt={book.title}
//           className="w-full h-[85%] object-cover rounded-2xl"
//         />
//         <div className="w-full flex justify-between items-center">
//           <div>
//             <h3 className="text-lg font-bold mt-2 text-clip line-clamp-1">
//               {book.title}
//             </h3>
//             <p className="text-tertiary">{book.author}</p>
//           </div>
//           <p className="text-md text-muted-foreground">
//             {book.rating ? `⭐ ${book.rating}` : ""}
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }

function SmallBookCard(book: Book) {
  return (
    <div
      key={book.id}
      className="flex h-60 w-full items-center rounded-2xl justify-center  border-2 border-neutral-200 hover:bg-white duration-200"
    >
      <div className="flex h-[90%] ml-4 mr-4  w-full items-center justify-between ">
        <img
          src={book.image_url}
          alt={book.title}
          className="h-[90%] w-[50%] object-cover rounded-2xl"
        />
        <div className="w-[40%] flex flex-col justify-between items-start h-[50%]">
          <div>
            <h3 className="text-lg font-bold mt-2 text-clip">{book.title}</h3>
            <p className="text-tertiary">{book.author}</p>
          </div>
          <p className="text-md text-muted-foreground">
            {book.rating ? `⭐ ${book.rating}` : ""}
          </p>
        </div>
      </div>
    </div>
  );
}

export { SmallBookCard };

function LargeBookCard(book: Book) {
  //   const imageUrl = book.image_url.startsWith('/uploads/') ? BASE_URL + book.image_url : book.image_url;
  return (
    <div
      key={book.id}
      className="flex flex-col h-120 items-center rounded-2xl justify-center border-2 border-neutral-200 bg-white large-book-card-padding"
    >
      <div className="flex flex-col h-[95%] w-[95%]  items-start justify-between large-book-card-padding">
        <img
          src={book.image_url}
          alt={book.title}
          className="w-full h-full object-cover rounded-2xl"
        />
      </div>
    </div>
  );
}
export { LargeBookCard };

interface BorrowedBookCardProps {
  book: Book;
  onReturnClick: (borrowId: number) => void;
}

function BorrowedBookCard({ book, onReturnClick }: BorrowedBookCardProps) {
  return (
    <div className="flex flex-col h-120 w--full rounded-2xl border-2 border-neutral-200 hover:bg-white duration-200 p-3">
      <div className="flex flex-col h-full justify-between">
        <div>
          <img
            src={book.image_url}
            alt={book.title}
            className="w-full h-80 object-cover rounded-xl"
          />

          <div className="mt-3">
            <h3 className="text-lg font-bold line-clamp-1">{book.title}</h3>
            <p className="text-tertiary">{book.author}</p>
          </div>
        </div>

        <button
          onClick={() => onReturnClick(book.id)} //book.borrowid
          className="mt-4 w-full rounded-lg bg-primary text-white py-2 hover:opacity-90 transition"
        >
          Return Book
        </button>
      </div>
    </div>
  );
}

export { BorrowedBookCard };

function BookDetailsCard(book: Book) {
  const imageUrl = book.image_url.startsWith("/uploads/")
    ? BASE_URL + book.image_url
    : book.image_url;
  return (
    <div className="flex flex-col h-[100%] w-[100%]  items-start justify-between book-detail-card-padding">
      <img
        src={imageUrl}
        alt={book.title}
        className="w-full h-full object-cover "
      />
    </div>
  );
}
export { BookDetailsCard };
