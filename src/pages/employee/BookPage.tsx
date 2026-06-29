import './BookPage.css'

export default function BookPage() {
    return (
        <div className="book-page">
            <section className="book-details-section">
                <h1 className="text-4xl font-bold mb-4">Book Page</h1>
                <p className="text-lg text-gray-600">This is the book page.</p>
                <p className="text-lg text-gray-600">You can add more details about the book here.</p>
            </section>

            {/* borrow section */}
            <section className="borrow-section">
                <h2 className="text-2xl font-bold">Borrow this book</h2>
                <p className="text-lg text-gray-600">You can borrow this book from the library.</p>
            </section>

            {/* reviews section */}
            <section className="reviews-section">
                <h2 className="text-2xl font-bold">Reviews</h2>
                <p className="text-lg text-gray-600">Read what others have to say about this book.</p>
                <p className="text-lg text-gray-600">Maybe we can add the whole borrow logic here or make a new page</p>
            </section>

            {/* similar books section */}
            <section className="similar-books-section">
                <h2 className="text-2xl font-bold">Similar Books</h2>
                <p className="text-lg text-gray-600">Check out these similar books.</p>
            </section>
        </div>
    );
}