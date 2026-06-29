import type Book from "@/models/book";


export default function BookCard(book: Book) {
    return (
        <div key={book.id} className="flex flex-col h-120 w-70 items-center rounded-2xl justify-center border-2 border-neutral-200 hover:bg-white duration-200">
            <div className="flex flex-col h-[90%] w-[90%]  items-start justify-between">
                <img src={book.image} alt={book.title} className="w-full h-[85%] object-cover rounded-2xl" />
                <div className="w-full flex justify-between items-center">
                    <div>
                        <h3 className="text-lg font-bold mt-2 text-clip line-clamp-1">{book.title}</h3>
                        <p className="text-tertiary">{book.author}</p>
                    </div>
                    <p className="text-md text-muted-foreground">
                        {book.rating ? `⭐ ${book.rating}` : ""}
                    </p>
                </div>
            </div>
        </div>
    )
}

function SmallBookCard(book: Book) {
    return (
        <div key={book.id} className="flex h-60 lg:w-90 sm:w-full items-center rounded-2xl justify-center border-2 border-neutral-200 hover:bg-white duration-200">
            <div className="flex h-[90%] w-[90%] items-center justify-between">
                <img src={book.image} alt={book.title} className="h-[90%] w-[50%] object-cover rounded-2xl" />
                <div className="w-[40%] flex flex-col gap-4 justify-between items-start px-4 py-4">
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
    )
}

export { SmallBookCard };