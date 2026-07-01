import { AddBookForm } from "@/Components/forms/AddBookForm";
import { HiMiniPlus } from "react-icons/hi2";
import { MdOutlineUploadFile } from "react-icons/md";
import "./Inventory.css";
import type { BookInventory } from "@/models/bookInventory";
import { books as initialBooks } from "@/models/book";
import { shelves as initialShelves } from "@/models/shelf";
import { useState } from "react";
import { AddBookToShelfForm } from "@/Components/forms/AddBooKToShelfForm";
import { InventoryTable } from "@/Components/table/BookInventory";
import { useGetInventoryBooksQuery } from "@/api-service/books/books.api";
import { AddShelfForm } from "@/Components/forms/AddShelfForm";
import type {
  CreateBookPayload,
  BookToShelfPayload,
} from "@/api-service/books/types";
import { parseInventoryCSV, transformCSV } from "@/utils/InventoryUtils";

const books: BookInventory[] = initialBooks.map((book, index) => ({
  book,
  shelf: initialShelves[index % initialShelves.length],
}));

type BulkImportState = {
  books: CreateBookPayload[];
  shelfAssignments: BookToShelfPayload[];
};

export default function InventoryPage() {
  const [pageState, setPageState] = useState<"inventory" | "new-book">(
    "inventory",
  );

  // Raw CSV import result: books to create + isbn/shelf_id assignments.
  // NOTE: shelfAssignments are NOT full {book, shelf, quantity} records yet —
  // they only carry isbn/shelf_id/quantity. AddBookToShelfForm resolves
  // them against the real Book/Shelf data it fetches internally.
  const [bulkData, setBulkData] = useState<BulkImportState | null>(null);

  return (
    <div className="inventory-page">
      <h1 className="text-4xl font-bold mb-4">Inventory</h1>

      {pageState === "inventory" && (
        <BookArchive setPageState={setPageState} setBulkData={setBulkData} />
      )}

      {pageState === "new-book" && <NewBook />}

      {pageState === "new-book" && (
        <AddBookToShelves shelfAssignments={bulkData?.shelfAssignments || []} />
      )}
    </div>
  );
}

function NewBook() {
  return (
    <div className="flex flex-col justify-center items-center gap-6">
      <AddBookForm />
      <AddShelfForm />
    </div>
  );
}

function AddBookToShelves({
  shelfAssignments,
}: {
  shelfAssignments: BookToShelfPayload[];
}) {
  return (
    <div className="flex justify-center items-center">
      <AddBookToShelfForm initialAssignments={shelfAssignments} />
    </div>
  );
}

function BookArchive({
  setPageState,
  setBulkData,
}: {
  setPageState: React.Dispatch<React.SetStateAction<"inventory" | "new-book">>;
  setBulkData: React.Dispatch<React.SetStateAction<BulkImportState | null>>;
}) {
  const { data: inventoryBooksData } = useGetInventoryBooksQuery();

  const handleBulkImport = () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".csv";

    fileInput.onchange = async (event: Event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const rows = await parseInventoryCSV(file);
      const parsed = transformCSV(rows);
      console.log("parsed", parsed);
      setBulkData(parsed);
      setPageState("new-book");
    };

    fileInput.click();
  };

  return (
    <div className="flex flex-col h-full gap-4 mt-6">
      <div className="flex justify-between items-center">
        <div className="flex flex-col items-start">
          <h1 className="text-3xl font-bold">Book Archives</h1>
          <p className="text-gray-600">
            Centralized tracking of all books in the library.
          </p>
        </div>
        <div className="flex flex-1 justify-end items-center h-[50%] gap-4">
          <button
            className="w-40 h-full py-6 flex justify-center items-center bg-tertiary-container text-white rounded-2xl hover:bg-tertiary-hover border border-tertiary"
            onClick={handleBulkImport}
          >
            <MdOutlineUploadFile size={24} className="inline-block mr-1" />
            <p className="text-sm font-semibold text-primary">Bulk import</p>
          </button>

          <button
            onClick={() => setPageState("new-book")}
            className="w-40 h-full py-6 flex justify-center items-center bg-primary-container text-white rounded-2xl hover:bg-primary-hover border border-primary"
          >
            <HiMiniPlus size={30} className="inline-block mr-1" />
            <p className="text-sm font-semibold text-primary">Add New Book</p>
          </button>
        </div>
      </div>
      <InventoryTable books={inventoryBooksData || []} />
    </div>
  );
}
