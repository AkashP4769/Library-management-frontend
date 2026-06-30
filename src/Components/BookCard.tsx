import type Book from "@/models/book";
import { BASE_URL } from "@/api-service/api";


export default function BookCard(book: Book) {
    const imageUrl = book.image_url.startsWith('/uploads/') ? BASE_URL + book.image_url : book.image_url;

    return (
        <div key={book.id} className="flex flex-col h-120 w-70 items-center rounded-2xl justify-center border-2 border-neutral-200 hover:bg-white duration-200">
            <div className="flex flex-col h-[90%] w-[90%]  items-start justify-between">
                <img src={imageUrl} alt={book.title} className="w-full h-[85%] object-cover rounded-2xl" />
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
    const imageUrl = book.image_url.startsWith('/uploads/') ? BASE_URL + book.image_url : book.image_url;
    console.log('Image URL:', imageUrl); // Debugging line to check the image URL

    return (
        <div key={book.id} className="flex h-60 lg:w-90 sm:w-full items-center rounded-2xl justify-center border-2 border-neutral-200 hover:bg-white duration-200">
            <div className="flex h-[90%] w-[90%] items-center justify-between">
                <img src={imageUrl} alt={book.title} className="h-[90%] w-[50%] object-cover rounded-2xl" />
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