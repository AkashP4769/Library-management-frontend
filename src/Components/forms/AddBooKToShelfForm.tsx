import type Book from "@/models/book";
import type Shelf from "@/models/shelf";
import { useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  useAddBookToShelfMutation,
  useGetBooksQuery,
} from "@/api-service/books/books.api";
import { useGetShelvesQuery } from "@/api-service/shelf/shelf.api";
import type { BookToShelfPayload } from "@/api-service/books/types";
import { useToast } from "@/Components/ui/Toast";

type BookToShelfRecord = {
  book: Book;
  shelf: Shelf;
  quantity: number;
};

type BookCardProps = {
  book: Book;
  onSelect?: (book: Book) => void;
};

export function BookCard({ book, onSelect }: BookCardProps) {
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
      <img src={book.image_url} className="h-20 w-14 rounded object-cover" />
      <div>
        <h3 className="font-medium">{book.title}</h3>
        <p className="text-sm text-gray-500">{book.author}</p>
        <p className="mt-1 text-xs text-gray-400">{book.genre}</p>
      </div>
    </button>
  );
}

type ShelfCardProps = {
  shelf: Shelf;
  onSelect?: (shelf: Shelf) => void;
};

export function ShelfCard({ shelf, onSelect }: ShelfCardProps) {
  return (
    <button
      onClick={() => onSelect?.(shelf)}
      className="
                w-full flex gap-6 rounded-lg border p-4 text-left
                transition hover:border-amber-500
                hover:bg-amber-50
            "
    >
      <img src={shelf.image_url} className="h-20 w-14 rounded object-cover" />
      <div>
        <h3 className="font-medium">{shelf.office_location}</h3>
        <p className="text-sm text-gray-500">Shelf {shelf.shelf_code}</p>
        <p className="mt-2 text-xs text-gray-400">Capacity: {shelf.capacity}</p>
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
    book.title.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-[40vw] max-w-none h-[70vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle>Select Book</DialogTitle>
        </DialogHeader>

        <input
          placeholder="Search books..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-lg border p-3 h-10 w-full"
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
    shelf.office_location.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl bg-white">
        <DialogHeader>
          <DialogTitle>Select Shelf</DialogTitle>
        </DialogHeader>

        <input
          placeholder="Search shelves..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-lg border p-3"
        />

        <div className="max-h-[500px] overflow-y-auto">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
        </div>
      </DialogContent>
    </Dialog>
  );
}

/** Keeps only records that actually resolved to a real book + shelf. */
function sanitizeRecords(list: unknown): BookToShelfRecord[] {
  if (!Array.isArray(list)) return [];
  return list.filter(
    (r): r is BookToShelfRecord =>
      !!r && typeof r === "object" && !!(r as any).book && !!(r as any).shelf,
  );
}

type Props = {
  bookToShelfList?: BookToShelfRecord[];
  initialAssignments?: BookToShelfPayload[];
  onSuccess?: () => void; // add this
};

export function AddBookToShelfForm({
  bookToShelfList = [],
  initialAssignments = [],
  onSuccess,
}: Props) {
  const { data: inventoryBooks } = useGetBooksQuery();
  const { data: inventoryShelves } = useGetShelvesQuery();
  const { toast } = useToast();

  const [addBookToShelf] = useAddBookToShelfMutation();

  const [bookToShelfRecords, setBookToShelfRecords] = useState<
    BookToShelfRecord[]
  >(sanitizeRecords(bookToShelfList));

  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [selectedShelf, setSelectedShelf] = useState<Shelf | null>(null);
  const [bookDialog, setBookDialog] = useState(false);
  const [shelfDialog, setShelfDialog] = useState(false);
  const [quantity, setQuantity] = useState(1);

  // Keep in sync if the caller passes already-resolved records.
  useEffect(() => {
    console.log("bookToShelfList", bookToShelfList);
    if (bookToShelfList.length) {
      setBookToShelfRecords(sanitizeRecords(bookToShelfList));
    }
  }, [bookToShelfList]);

  // Resolve raw CSV assignments (isbn/shelf_id/quantity) into full records
  // once the book/shelf data has loaded.
  useEffect(() => {
    if (!initialAssignments.length || !inventoryBooks || !inventoryShelves) {
      return;
    }

    const resolved: BookToShelfRecord[] = [];
    const skipped: BookToShelfPayload[] = [];

    for (const assignment of initialAssignments) {
      const book = inventoryBooks.find((b) => b.isbn === assignment.isbn);
      const shelf = inventoryShelves.find((s) => s.id === assignment.shelf_id);

      if (book && shelf) {
        resolved.push({ book, shelf, quantity: assignment.quantity });
      } else {
        skipped.push(assignment);
      }
    }

    if (skipped.length) {
      console.warn(
        "Some bulk-imported shelf assignments could not be resolved to a known book/shelf and were skipped:",
        skipped,
      );
    }

    if (resolved.length) {
      setBookToShelfRecords((prev) => {
        const existingKeys = new Set(
          prev.map((r) => `${r.book.id}-${r.shelf.id}`),
        );
        const merged = [...prev];
        for (const r of resolved) {
          const key = `${r.book.id}-${r.shelf.id}`;
          if (!existingKeys.has(key)) {
            merged.push(r);
            existingKeys.add(key);
          }
        }
        return merged;
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialAssignments, inventoryBooks, inventoryShelves]);

  const handleAddBookToShelf = () => {
    const book = selectedBook;
    const shelf = selectedShelf;

    if (!book || !shelf) {
      toast({
        title: "Choose a book and shelf",
        description: "Both fields are required before adding a row.",
        variant: "error",
      });
      return;
    }

    const existing = bookToShelfRecords.find(
      (r) => r.book.id === book.id && r.shelf.id === shelf.id,
    );

    if (existing) {
      setBookToShelfRecords((prev) =>
        prev.map((r) =>
          r.book.id === book.id && r.shelf.id === shelf.id
            ? { ...r, quantity: r.quantity + quantity }
            : r,
        ),
      );
      toast({
        title: "Quantity updated",
        description: `${book.title} already exists on this shelf, so the quantity was increased.`,
        variant: "info",
      });
      return;
    }

    setBookToShelfRecords((prev) => [...prev, { book, shelf, quantity }]);
    toast({
      title: "Book queued",
      description: `${book.title} is ready to upload to ${shelf.shelf_code}.`,
      variant: "success",
    });

    setSelectedBook(null);
    setSelectedShelf(null);
    setQuantity(1);
  };

  const removeRecord = (index: number) => {
    setBookToShelfRecords((prev) => prev.filter((_, i) => i !== index));
  };

  function handleUploadAll() {
    if (bookToShelfRecords.length === 0) {
      toast({
        title: "Nothing to upload",
        description: "Add at least one book to a shelf first.",
        variant: "error",
      });
      return;
    }

    const payload: BookToShelfPayload[] = bookToShelfRecords.map((record) => ({
      isbn: record.book.isbn,
      shelf_id: record.shelf.id,
      quantity: record.quantity,
    }));

    addBookToShelf(payload)
      .unwrap()
      .then(() => {
        toast({
          title: "Shelves updated",
          description: "Books were added to shelves successfully.",
          variant: "success",
        });
        setBookToShelfRecords([]);
        onSuccess?.();
      });
  }

  if (!inventoryBooks || !inventoryShelves) {
    return <div>Loading...</div>;
  }

  // Defensive: never render a record that's missing book/shelf, even if
  // something upstream slips through.
  const safeRecords = bookToShelfRecords.filter((r) => r?.book && r?.shelf);

  return (
    <div className="space-y-6 w-full rounded-xl border border-neutral-100 bg-white p-6 shadow-sm">
      <BookPicker
        open={bookDialog}
        books={inventoryBooks}
        onClose={() => setBookDialog(false)}
        onSelect={setSelectedBook}
      />

      <ShelfPicker
        open={shelfDialog}
        shelves={inventoryShelves}
        onClose={() => setShelfDialog(false)}
        onSelect={setSelectedShelf}
      />

      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Add Books To Shelves</h2>
        <button
          onClick={handleUploadAll}
          className="ml-4 rounded-lg bg-primary-container hover:bg-amber-400 duration-200 px-8 py-4 text-black font-semibold hover:bg-primary-hover"
        >
          Upload All
        </button>
      </div>

      {/* Selection Row */}
      <div className="grid gap-4 md:grid-cols-4">
        <button
          onClick={() => setBookDialog(true)}
          className="rounded-lg border h-full py-2 px-4 text-left"
        >
          <p className="text-sm text-gray-500">Book</p>
          <p className="font-medium">
            {selectedBook ? selectedBook.title : "Select a book"}
          </p>
        </button>

        <button
          onClick={() => setShelfDialog(true)}
          className="rounded-lg border h-full py-2 px-4 text-left"
        >
          <p className="text-sm text-gray-500">Shelf</p>
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
          onChange={(e) => setQuantity(Number(e.target.value))}
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
              <th className="px-4 py-3">Book</th>
              <th className="px-4 py-3">Author</th>
              <th className="px-4 py-3">Shelf</th>
              <th className="px-4 py-3">Location</th>
              <th className="px-4 py-3">Quantity</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {safeRecords.length === 0 && (
              <tr>
                <td colSpan={6} className="py-8 text-center text-gray-500">
                  No books added.
                </td>
              </tr>
            )}

            {safeRecords.map((record, index) => (
              <tr key={index} className="border-t">
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={
                        record.book.image_url ||
                        "http://localhost:8000/uploads/8a7d397e-9725-43f4-ab24-4eca644dcbf9.webp"
                      }
                      alt={record.book.title}
                      className="h-20 w-16 rounded object-cover"
                    />
                    <span>{record.book.title}</span>
                  </div>
                </td>
                <td className="px-4 py-4">{record.book.author}</td>
                <td className="px-4 py-4">{record.shelf.shelf_code}</td>
                <td className="px-4 py-4">{record.shelf.office_location}</td>
                <td className="px-4 py-4 font-medium">{record.quantity}</td>
                <td className="px-4 py-4">
                  <button
                    onClick={() => removeRecord(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
