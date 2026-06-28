import type Book from "@/models/book";
import { books } from "@/models/book";
import { useState } from "react";
import './Home.css'
import BookCard, { SmallBookCard } from "@/Components/BookCard";

export default function HomePage() {
    const [myBooks, setMyBooks] = useState<Book[]>([...books, ...books]);

    return <div className="home-page">
        <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">My Books</h2>
            <p className="text-primary font-bold hover:underline cursor-pointer">VIEW ALL</p>
        </div>
        <div className="grid grid-cols-5 gap-6">
            {myBooks.length === 0 ? <p className="text-bold text-primary text-xl">No books found</p> : 
            myBooks.map((book) => (
                <BookCard key={book.id} {...book} />
            ))}
        </div>

        <div className="flex justify-between items-center mt-8">
            <h2 className="text-2xl font-bold">Most Popular this week</h2>
            <p className="text-primary font-bold hover:underline cursor-pointer">VIEW ALL</p>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-4 mt-4">
            {myBooks.length === 0 ? <p className="text-bold text-primary text-xl">No books found</p> : myBooks.map((book) => (
                <SmallBookCard key={book.id} {...book} />
            ))}
        </div>
    </div>
}