

function RatingBadge({ rating }: { rating: number }) {
    let styles =
        "bg-red-100 text-red-700";

    if (rating >= 4)
        styles = "bg-green-100 text-green-700";
    else if (rating >= 3)
        styles = "bg-yellow-100 text-yellow-700";

    return (
        <span
            className={`rounded-full px-3 py-1 text-sm font-medium ${styles}`}
        >
            ★ {rating}
        </span>
    );
}

import type { BookInventory } from "@/models/bookInventory";
import { Pencil, Trash2 } from "lucide-react";

type Props = {
    item: BookInventory;
};

export function BookRow({ item }: Props) {
    const { book, shelf } = item;

    return (
        <tr className="border-b border-neutral-300 hover:bg-gray-50">
            <td className="py-3">
                <div className="flex px-6 items-center gap-4">
                    <img
                        src={book.image_url}
                        alt={book.title}
                        className="h-24 w-20 rounded object-cover shadow"
                    />

                    <div>
                        <p className="font-semibold">
                            {book.title}
                        </p>

                        <p className="text-sm text-gray-500">
                            {book.author}
                        </p>
                    </div>
                </div>
            </td>

            <td>{book.genre}</td>

            <td>{book.publisher}</td>

            <td>
                <div className="font-medium">
                    {shelf.office_location}
                </div>

                <div className="text-sm text-gray-500">
                    Shelf {shelf.shelf_code}
                </div>
            </td>

            <td>{book.language}</td>

            <td>
                <RatingBadge rating={book.rating} />
            </td>

            <td>
                <div className="flex gap-2">
                    <button className="rounded p-2 hover:bg-gray-100">
                        <Pencil size={18} />
                    </button>

                    <button className="rounded p-2 text-red-500 hover:bg-red-50">
                        <Trash2 size={18} />
                    </button>
                </div>
            </td>
        </tr>
    );
}

type InventoryTableProps = {
    books: BookInventory[];
};

export function InventoryTable({
    books,
}: InventoryTableProps) {
    return (
        <div className="overflow-hidden rounded-2xl  border-neutral-100 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b p-5">
                <h2 className="text-xl font-semibold">
                    Library Inventory
                </h2>

                <button className="rounded-lg border px-4 py-2 hover:bg-gray-50">
                    Filter
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 text-left text-sm text-gray-500">
                        <tr>
                            <th className="p-5">Book</th>
                            <th>Genre</th>
                            <th>Publisher</th>
                            <th>Shelf</th>
                            <th>Language</th>
                            <th>Rating</th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {books.map((item) => (
                            <BookRow
                                key={item.book.id}
                                item={item}
                            />
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex items-center justify-between border-t p-5 text-sm text-gray-500">
                <span>
                    Showing {books.length} books
                </span>

                <div className="flex gap-2">
                    <button className="rounded border px-3 py-1">
                        1
                    </button>

                    <button className="rounded border px-3 py-1">
                        2
                    </button>

                    <button className="rounded border px-3 py-1">
                        3
                    </button>
                </div>
            </div>
        </div>
    );
}