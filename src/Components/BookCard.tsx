import type Book from "@/models/book";

export default function BookCard(book: Book) {
  return (
    <div
      key={book.id}
      className="flex flex-col h-120 w-70 items-center rounded-2xl justify-center border-2 border-neutral-200 hover:bg-white duration-200"
    >
      <div className="flex flex-col h-[90%] w-[90%]  items-start justify-between">
        <img
          src={book.image}
          alt={book.title}
          className="w-full h-[85%] object-cover rounded-2xl"
        />
        <div className="w-full flex justify-between items-center">
          <div>
            <h3 className="text-lg font-bold mt-2 text-clip line-clamp-1">
              {book.title}
            </h3>
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

function SmallBookCard(book: Book) {
  return (
    <div
      key={book.id}
      className="flex h-60 w-90 items-center rounded-2xl justify-center px-4 py-4 border-2 border-neutral-200 hover:bg-white duration-200"
    >
      <div className="flex h-[90%] w-[90%] items-center justify-between px-4 py-4">
        <img
          src={book.image}
          alt={book.title}
          className="h-[90%] w-[50%] object-cover rounded-2xl"
        />
        <div className="w-[40%] flex flex-col justify-between items-start h-[50%] px-4 py-4">
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
  return (
    <div
      key={book.id}
      className="flex flex-col h-120 items-center rounded-2xl justify-center border-2 border-neutral-200 bg-white large-book-card-padding"
    >
      <div className="flex flex-col h-[95%] w-[95%]  items-start justify-between large-book-card-padding">
        <img
          src={book.image}
          alt={book.title}
          className="w-full h-full object-cover rounded-2xl"
        />
      </div>
    </div>
  );
}
export { LargeBookCard };
