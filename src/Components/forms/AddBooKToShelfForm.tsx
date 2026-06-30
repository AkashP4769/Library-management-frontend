import type Book from "@/models/book";
import type Shelf from "@/models/shelf";
import { useState } from "react";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { books } from "@/models/book";
import { shelves } from "@/models/shelf";

type BookToShelfRecord = {
    book: Book;
    shelf: Shelf;
    quantity: number;
};

type BookCardProps = {
    book: Book;
    onSelect?: (book: Book) => void;
};

export function BookCard({
    book,
    onSelect,
}: BookCardProps) {
    return (
        <button
            onClick={() => onSelect?.(book)}
            className="
                flex w-full gap-4 rounded-lg border p-3
                text-left transition
                hover:border-amber-500
                hover:bg-amber-50
            "
        >
            <img
                src={book.image_url}
                className="h-20 w-14 rounded object-cover"
            />

            <div>
                <h3 className="font-medium">
                    {book.title}
                </h3>

                <p className="text-sm text-gray-500">
                    {book.author}
                </p>

                <p className="mt-1 text-xs text-gray-400">
                    {book.genre}
                </p>
            </div>
        </button>
    );
}

type ShelfCardProps = {
    shelf: Shelf;
    onSelect?: (shelf: Shelf) => void;
};

export function ShelfCard({
    shelf,
    onSelect,
}: ShelfCardProps) {
    return (
        <button
            onClick={() => onSelect?.(shelf)}
            className="
                w-full flex gap-6 rounded-lg border p-4 text-left
                transition hover:border-amber-500
                hover:bg-amber-50
            "
        >
            <img
                src={shelf.image}
                className="h-20 w-14 rounded object-cover"
            />
            <div>
                <h3 className="font-medium">
                    {shelf.office_location}
                </h3>

                <p className="text-sm text-gray-500">
                    Shelf {shelf.shelf_code}
                </p>

                <p className="mt-2 text-xs text-gray-400">
                    Capacity: {shelf.capacity}
                </p>
            </div>
        </button>
    );
}

type BookPickerProps = {
    open: boolean;
    books: Book[];
    onClose: () => void;
    onSelect: (book: Book) => void;
};

export function BookPicker({
    open,
    books,
    onClose,
    onSelect,
}: BookPickerProps) {
    const [search, setSearch] = useState("");

    const filtered = books.filter((book) =>
        book.title
            .toLowerCase()
            .includes(search.toLowerCase())
    );

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="w-full bg-white">
                <DialogHeader>
                    <DialogTitle>
                        Select Book
                    </DialogTitle>
                </DialogHeader>

                <input
                    placeholder="Search books..."
                    value={search}
                    onChange={(e) =>
                        setSearch(e.target.value)
                    }
                    className="rounded-lg border p-3"
                />

                <div className="max-h-[500px] space-y-3 overflow-y-auto">
                    {filtered.map((book) => (
                        <BookCard
                            key={book.id}
                            book={book}
                            onSelect={(book) => {
                                onSelect(book);
                                onClose();
                            }}
                        />
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    );
}

type ShelfPickerProps = {
    open: boolean;
    shelves: Shelf[];
    onClose: () => void;
    onSelect: (shelf: Shelf) => void;
};

export function ShelfPicker({
    open,
    shelves,
    onClose,
    onSelect,
}: ShelfPickerProps) {
    const [search, setSearch] = useState("");

    const filtered = shelves.filter((shelf) =>
        shelf.office_location
            .toLowerCase()
            .includes(search.toLowerCase())
    );

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl bg-white">
                <DialogHeader>
                    <DialogTitle>
                        Select Shelf
                    </DialogTitle>
                </DialogHeader>

                <input
                    placeholder="Search shelves..."
                    value={search}
                    onChange={(e) =>
                        setSearch(e.target.value)
                    }
                    className="rounded-lg border p-3"
                />

                <div className="max-h-[500px] space-y-3 overflow-y-auto">
                    {filtered.map((shelf) => (
                        <ShelfCard
                            key={shelf.id}
                            shelf={shelf}
                            onSelect={(shelf) => {
                                onSelect(shelf);
                                onClose();
                            }}
                        />
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    );
}

export function AddBookToShelfForm() {

    const [bookToShelfRecords, setBookToShelfRecords] = useState<
        BookToShelfRecord[]
    >([]);

    const [selectedBook, setSelectedBook] =
        useState<Book | null>(null);

    const [selectedShelf, setSelectedShelf] =
        useState<Shelf | null>(null);

    const [bookDialog, setBookDialog] =
        useState(false);

    const [shelfDialog, setShelfDialog] =
        useState(false);
    const [quantity, setQuantity] = useState(1);

    const handleAddBookToShelf = () => {
        const book = selectedBook;
        const shelf = selectedShelf;

        if (!book || !shelf) return;

        const existing = bookToShelfRecords.find(
            r =>
                r.book.id === book.id &&
                r.shelf.id === shelf.id
        );

        if (existing) {
            setBookToShelfRecords(prev =>
                prev.map(r =>
                    r.book.id === book.id &&
                        r.shelf.id === shelf.id
                        ? {
                            ...r,
                            quantity:
                                r.quantity + quantity,
                        }
                        : r
                )
            );

            return;
        }

        setBookToShelfRecords((prev) => [
            ...prev,
            {
                book,
                shelf,
                quantity,
            },
        ]);

        setSelectedBook(null);
        setSelectedShelf(null);
        setQuantity(1);
    };

    const removeRecord = (index: number) => {
        setBookToShelfRecords((prev) =>
            prev.filter((_, i) => i !== index)
        );
    };

    return (
        <div className="space-y-6 w-full rounded-xl border border-neutral-100 bg-white p-6 shadow-sm">
            <BookPicker
                open={bookDialog}
                books={books}
                onClose={() => setBookDialog(false)}
                onSelect={setSelectedBook}
            />

            <ShelfPicker
                open={shelfDialog}
                shelves={shelves}
                onClose={() => setShelfDialog(false)}
                onSelect={setSelectedShelf}
            />

            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">
                    Add Books To Shelves
                </h2>
                <button className="ml-4 rounded-lg bg-primary-container hover:bg-amber-400 duration-200 px-8 py-4 text-black font-semibold hover:bg-primary-hover">
                    Upload All
                </button>
            </div>

            {/* Selection Row */}
            <div className="grid gap-4 md:grid-cols-4">
                <button
                    onClick={() => setBookDialog(true)}
                    className="rounded-lg border h-full py-2 px-4 text-left"
                >
                    <p className="text-sm text-gray-500">
                        Book
                    </p>

                    <p className="font-medium">
                        {selectedBook
                            ? selectedBook.title
                            : "Select a book"}
                    </p>
                </button>

                <button
                    onClick={() => setShelfDialog(true)}
                    className="rounded-lg border h-full py-2 px-4 text-left"
                >
                    <p className="text-sm text-gray-500">
                        Shelf
                    </p>

                    <p className="font-medium">
                        {selectedShelf
                            ? `${selectedShelf.office_location} (${selectedShelf.shelf_code})`
                            : "Select a shelf"}
                    </p>
                </button>

                <input
                    type="number"
                    min={1}
                    value={quantity}
                    onChange={(e) =>
                        setQuantity(Number(e.target.value))
                    }
                    className="rounded-lg h-full border px-4 py-2"
                />

                <button
                    onClick={handleAddBookToShelf}
                    className="rounded-lg h-full bg-tertiary-container hover:bg-neutral-200 duration-300 shadow-md py-2 px-4 text-black font-semibold hover:bg-primary-hover"
                >
                    Add
                </button>
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-lg border">
                <table className="w-full">
                    <thead className="bg-gray-50 text-left">
                        <tr>
                            <th className="px-4 py-3">
                                Book
                            </th>

                            <th className="px-4 py-3">
                                Author
                            </th>

                            <th className="px-4 py-3">
                                Shelf
                            </th>

                            <th className="px-4 py-3">
                                Location
                            </th>

                            <th className="px-4 py-3">
                                Quantity
                            </th>

                            <th className="px-4 py-3">
                                Action
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {bookToShelfRecords.length === 0 && (
                            <tr>
                                <td
                                    colSpan={6}
                                    className="py-8 text-center text-gray-500"
                                >
                                    No books added.
                                </td>
                            </tr>
                        )}

                        {bookToShelfRecords.map(
                            (record, index) => (
                                <tr
                                    key={index}
                                    className="border-t"
                                >
                                    <td className="px-4 py-4">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={record.book.image_url}
                                                alt={
                                                    record.book.title
                                                }
                                                className="h-20 w-16 rounded object-cover"
                                            />

                                            <span>
                                                {
                                                    record.book
                                                        .title
                                                }
                                            </span>
                                        </div>
                                    </td>

                                    <td className="px-4 py-4">
                                        {
                                            record.book
                                                .author
                                        }
                                    </td>

                                    <td className="px-4 py-4">
                                        {
                                            record.shelf
                                                .shelf_code
                                        }
                                    </td>

                                    <td className="px-4 py-4">
                                        {
                                            record.shelf
                                                .office_location
                                        }
                                    </td>

                                    <td className="px-4 py-4 font-medium">
                                        {record.quantity}
                                    </td>

                                    <td className="px-4 py-4">
                                        <button
                                            onClick={() =>
                                                removeRecord(
                                                    index
                                                )
                                            }
                                            className="text-red-600 hover:text-red-700"
                                        >
                                            Remove
                                        </button>
                                    </td>
                                </tr>
                            )
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

