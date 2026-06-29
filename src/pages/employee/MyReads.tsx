import "./MyReads.css";

export default function MyReads() {
    return (
        <div className="my-reads-page">
            <section className="my-reads-section">
                <h1 className="text-4xl font-bold mb-4">My Reads</h1>
                <p className="text-lg text-gray-600">This is the My Reads page.</p>
                <p className="text-lg text-gray-600">You can add more details about your reads here.</p>
            </section>

            {/* borrowed books section */}
            <section className="borrowed-books-section">
                <h2 className="text-2xl font-bold">Borrowed Books</h2>
                <p className="text-lg text-gray-600">These are the books you have borrowed.</p>
            </section>

            {/* Books requested section */}
            <section className="books-requested-section">
                <h2 className="text-2xl font-bold">Books Requested</h2>
                <p className="text-lg text-gray-600">These are the books you have requested.</p>
            </section>

            {/* saved books section */}
            <section className="saved-books-section">
                <h2 className="text-2xl font-bold">Saved Books</h2>
                <p className="text-lg text-gray-600">These are the books you have saved for later.</p>
            </section>
        </div>
    );
}