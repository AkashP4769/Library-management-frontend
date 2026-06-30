import type Book from "@/models/book";
import { useEffect, useState } from "react";
import './Home.css'
import BookCard, { SmallBookCard } from "@/Components/BookCard";
import { useGetBooksQuery } from "@/api-service/books/books.api";

export default function HomePage() {
    const { data: fetchedBooks } = useGetBooksQuery();
    const [myBooks, setMyBooks] = useState<Book[]>([]);

    useEffect(() => {
        if (fetchedBooks) {
            setMyBooks(fetchedBooks);
        }
    }, [fetchedBooks]);

    console.log("Fetched Books:", fetchedBooks);
    console.log("My Books State:", myBooks);

    return <div className="home-page">
        <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">My Books</h2>
            <p className="text-primary font-bold hover:underline cursor-pointer">VIEW ALL</p>
        </div>
        <div className="flex flex-wrap gap-6">
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