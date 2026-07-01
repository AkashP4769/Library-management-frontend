import Papa from "papaparse";
import type {
  CreateBookPayload,
  BookToShelfPayload,
} from "@/api-service/books/types";

export function transformCSV(rows: any[]) {
  const books: CreateBookPayload[] = [];
  const shelfAssignments: BookToShelfPayload[] = [];

  for (const row of rows) {
    books.push({
      isbn: row.isbn,
      title: row.title,
      author: row.author,
      genre: row.genre,
      publisher: row.publisher,
      language: row.language,
      description: "",
      image: null,
    });

    shelfAssignments.push({
      isbn: row.isbn,
      shelf_id: Number(row.shelf_id),
      quantity: Number(row.quantity),
    });
  }

  return { books, shelfAssignments };
}

export function parseInventoryCSV(file: File): Promise<any[]> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => resolve(results.data),
      error: (err) => reject(err),
    });
  });
}
