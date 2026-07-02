import { useState } from "react";
import { HiMiniPlus } from "react-icons/hi2";
import { MdOutlineUploadFile } from "react-icons/md";
import "./Inventory.css";

import { AddBookForm } from "@/Components/forms/AddBookForm";
import { AddShelfForm } from "@/Components/forms/AddShelfForm";
import { AddBookToShelfForm } from "@/Components/forms/AddBooKToShelfForm";
import { InventoryTable } from "@/Components/table/BookInventory";
import { useGetInventoryBooksQuery } from "@/api-service/books/books.api";
import { useToast } from "@/Components/ui/Toast";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import type {
  CreateBookPayload,
  BookToShelfPayload,
} from "@/api-service/books/types";

import { parseInventoryCSV, transformCSV } from "@/utils/InventoryUtils";

type BulkImportState = {
  books: CreateBookPayload[];
  shelfAssignments: BookToShelfPayload[];
};

export default function InventoryPage() {
  const { data: inventoryBooksData } = useGetInventoryBooksQuery();
  const { toast } = useToast();

  const [addBookOpen, setAddBookOpen] = useState(false);
  const [addShelfOpen, setAddShelfOpen] = useState(false);
  const [addToShelfOpen, setAddToShelfOpen] = useState(false);
  const [bulkImportOpen, setBulkImportOpen] = useState(false);

  const [bulkData, setBulkData] = useState<BulkImportState | null>(null);
  const [isParsing, setIsParsing] = useState(false);

  const handleBulkImport = () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".csv";

    fileInput.onchange = async (event: Event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (!file) return;

      setIsParsing(true);

      try {
        const rows = await parseInventoryCSV(file);
        const parsed = transformCSV(rows);

        if (!parsed.shelfAssignments.length) {
          toast({
            title: "Nothing to import",
            description: "That file didn't contain any recognizable rows.",
            variant: "error",
          });
          return;
        }

        setBulkData(parsed);
        setBulkImportOpen(true);

        toast({
          title: "CSV imported",
          description: `Found ${parsed.shelfAssignments.length} row${
            parsed.shelfAssignments.length === 1 ? "" : "s"
          } ready to review.`,
          variant: "success",
        });
      } catch (error) {
        console.error("Error parsing bulk import file:", error);

        toast({
          title: "Import failed",
          description:
            "Couldn't read that file. Check the format and try again.",
          variant: "error",
        });
      } finally {
        setIsParsing(false);
      }
    };

    fileInput.click();
  };

  return (
    <div className="inventory-page">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-[#191C1D]">Inventory</h1>
          <p className="mt-1 text-[#575E70]">
            Centralized tracking of all books in the library.
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Bulk Import */}
          <button
            onClick={handleBulkImport}
            disabled={isParsing}
            className="flex items-center gap-2 rounded-xl border border-tertiary bg-tertiary-container px-5 py-3 text-sm font-semibold text-primary transition hover:bg-tertiary-hover disabled:cursor-not-allowed disabled:opacity-60"
          >
            <MdOutlineUploadFile size={20} />
            {isParsing ? "Reading file…" : "Bulk Import"}
          </button>

          {/* Add Shelf */}
          <button
            onClick={() => setAddShelfOpen(true)}
            className="flex items-center gap-2 rounded-xl border border-primary bg-primary-container px-5 py-3 text-sm font-semibold text-primary transition hover:bg-primary-hover"
          >
            <HiMiniPlus size={20} />
            Add Shelf
          </button>

          {/* Add Book */}
          <button
            onClick={() => setAddBookOpen(true)}
            className="flex items-center gap-2 rounded-xl border border-primary bg-primary-container px-5 py-3 text-sm font-semibold text-primary transition hover:bg-primary-hover"
          >
            <HiMiniPlus size={20} />
            Add Book
          </button>

          {/* Add Book To Shelf */}
          <button
            onClick={() => setAddToShelfOpen(true)}
            className="flex items-center gap-2 rounded-xl border border-primary bg-primary-container px-5 py-3 text-sm font-semibold text-primary transition hover:bg-primary-hover"
          >
            <HiMiniPlus size={20} />
            Add Book To Shelf
          </button>
        </div>
      </div>

      {/* Inventory Table */}
      <InventoryTable books={inventoryBooksData || []} />

      {/* Add Book Dialog */}
      <Dialog open={addBookOpen} onOpenChange={setAddBookOpen}>
        <DialogContent className="w-[95vw] max-w-[80vh] h-[70vh] overflow-y-auto bg-white">
          <DialogHeader>
            <DialogTitle>Add New Book</DialogTitle>
          </DialogHeader>

          <AddBookForm onSuccess={() => setAddBookOpen(false)} />
        </DialogContent>
      </Dialog>

      {/* Add Shelf Dialog */}
      <Dialog open={addShelfOpen} onOpenChange={setAddShelfOpen}>
        <DialogContent className="w-[40vw] max-w-none h-[40vh] overflow-y-auto bg-white">
          <DialogHeader>
            <DialogTitle>Add New Shelf</DialogTitle>
          </DialogHeader>

          <AddShelfForm onSuccess={() => setAddShelfOpen(false)} />
        </DialogContent>
      </Dialog>

      {/* Manual Add Book To Shelf Dialog */}
      <Dialog open={addToShelfOpen} onOpenChange={setAddToShelfOpen}>
        <DialogContent className="w-[50vw] max-w-none h-[50vh] overflow-y-auto bg-white">
          <DialogHeader>
            <DialogTitle>Add Book To Shelf</DialogTitle>
          </DialogHeader>

          <AddBookToShelfForm
            initialAssignments={[]}
            onSuccess={() => setAddToShelfOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Bulk Import Review Dialog */}
      <Dialog
        open={bulkImportOpen}
        onOpenChange={(open) => {
          setBulkImportOpen(open);

          if (!open) {
            setBulkData(null);
          }
        }}
      >
        <DialogContent className="w-[50vw] max-w-none h-[70vh] overflow-y-auto bg-white">
          <DialogHeader>
            <DialogTitle>Review Bulk Import</DialogTitle>
          </DialogHeader>

          <AddBookToShelfForm
            initialAssignments={bulkData?.shelfAssignments || []}
            onSuccess={() => setBulkImportOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
