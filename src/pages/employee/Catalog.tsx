import type Book from "@/models/book";
import type Shelf from "@/models/shelf";
import { books as initialBooks } from "@/models/book";
import { shelves as initialShelves } from "@/models/shelf";
import { useState } from "react";
import './Catalog.css'
import BookCard from "@/Components/BookCard";
import ShelfCard from "@/Components/ShelfCard";


export default function CatalogPage() {
    const [books, setBooks] = useState<Book[]>(initialBooks);
    const [shelves, setShelves] = useState<Shelf[]>(initialShelves);

    return <div className="catalog-page">
        <section className="books-section">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Explore</h2>
                <p className="text-primary font-bold hover:underline cursor-pointer">Filter Icon</p>
            </div>
            <div className="grid grid-cols-5 gap-6">
                {books.length === 0 ? <p className="text-bold text-primary text-xl">No books found</p> : 
                books.map((book) => (
                    <BookCard key={book.id} {...book} />
                ))}
            </div>
        </section>

        <section className="shelves-section">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Check out from Office shelves</h2>
                <p className="text-primary font-bold hover:underline cursor-pointer">Filter Icon</p>
            </div>
            <div className="grid grid-cols-4 gap-6">
                {shelves.length === 0 ? <p className="text-bold text-primary text-xl">No shelves found</p> : 
                shelves.map((shelf) => (
                    <ShelfCard key={shelf.id} {...shelf} />
                ))}
            </div>
        </section>
    </div>
}


