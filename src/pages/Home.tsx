import type Book from "@/models/book";
import { books } from "@/models/book";
import { useState } from "react";
import './Home.css'

export default function HomePage() {
    const [myBooks, setMyBooks] = useState<Book[]>(books);

    return <div className="home-page">
        <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">My Books</h2>
            <p className="text-primary font-bold hover:underline cursor-pointer">VIEW ALL</p>
        </div>
        <div className="grid grid-cols-5 gap-6">
            {myBooks.length === 0 ? <p className="text-bold text-primary text-xl">No books found</p> : myBooks.map((book) => (
                <div key={book.id} className="flex flex-col items-start justify-center px-4 py-4">
                    <img src={book.image} alt={book.title} className="w-full h-full object-cover rounded-2xl" />
                    <div className="w-full">
                        <h3 className="text-lg font-bold mt-2 text-ellipsis">{book.title}</h3>
                        <p className="text-tertiary">{book.author}</p>
                    </div>
                </div>
            ))}
        </div>

        <div className="flex justify-between items-center mt-8">
            <h2 className="text-2xl font-bold">Most Popular this week</h2>
            <p className="text-primary font-bold hover:underline cursor-pointer">VIEW ALL</p>
        </div>
        <div className="flex flex-wrap gap-6">
            {myBooks.length === 0 ? <p className="text-bold text-primary text-xl">No books found</p> : myBooks.map((book) => (
                <div key={book.id} className="flex items-center gap-4 justify-center h-60 bg-white px-8 py-4 w-70 border-2 border-neutral-200 rounded-2xl">
                    <img src={book.image} alt={book.title} className="w-full h-50 object-cover rounded-2xl" />
                    <div className="w-60 px-4">
                        <h3 className="text-lg font-bold mt-2 text-ellipsis">{book.title}</h3>
                        <p className="text-tertiary">{book.author}</p>
                    </div>
                </div>
            ))}
        </div>
    </div>
}