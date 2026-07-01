import type Book from "@/models/book";
import { BASE_URL } from "@/api-service/api";

export default interface BookResponse {
  id: number;
  isbn: string;
  title: string;
  author: string;
  genre: string;
  publisher: string;
  language: string;
  description: string;
  image_url: string;
  createdAt: string;
  updatedAt: string;
}
export interface BookAPIResponse {
  isbn: string;
  title: string;
  author: string;
  pages: string | null;
  publisher: string | null;
  language: string | null;
  cover_urls: (string | null)[] | null;
}
export type CreateBookPayload = {
  isbn: string;
  title: string;
  author: string;
  genre: string;
  publisher: string;
  language: string;
  description: string;
  image?: File | null;
};

function placeholderImageUrl(originalImageUrl: string | null): string {
  if (!originalImageUrl) {
    return "https://www.forewordreviews.com/books/covers/how-to-start-and-operate-an-internet-used-book-store-without-spending-a-fortune.jpg";
  }
  if (originalImageUrl.startsWith("/uploads/")) {
    return BASE_URL + originalImageUrl;
  }
  return originalImageUrl;  
}

export function bookResponseToBook(bookResponse: BookResponse): Book {
  return {
    id: bookResponse.id,
    isbn: bookResponse.isbn,
    title: bookResponse.title,
    author: bookResponse.author,
    genre: bookResponse.genre,
    publisher: bookResponse.publisher,
    language: bookResponse.language,
    description: bookResponse.description,
    image_url: placeholderImageUrl(bookResponse.image_url),
    rating: 0, // Assuming rating is not part of the response, set it to a default value
    createdAt: bookResponse.createdAt,
    updatedAt: bookResponse.updatedAt,
  };
}

export type BookToShelfPayload = {
  isbn: string;
  shelf_id: number;
  quantity: number;
};

export type InventoryBookItem = {
  isbn: string;
  title: string;
  author: string;
  genre: string;
  publisher: string;
  language: string;
  image_url: string;
  shelf_id: number;
  shelf_code: string;
  office_location: string;
  total_copies: number;
  available_copies: number;
  borrowed_copies: number;
  average_rating: number;
};

export function responseToInventoryBookItem(item: any): InventoryBookItem {
  return {
    isbn: item.isbn,
    title: item.title,
    author: item.author,
    genre: item.genre,
    publisher: item.publisher,
    language: item.language,
    image_url: placeholderImageUrl(item.image_url),
    shelf_id: item.shelf_id,
    shelf_code: item.shelf_code,
    office_location: item.office_location,
    total_copies: item.total_copies,
    available_copies: item.available_copies,
    borrowed_copies: item.borrowed_copies,
    average_rating: item.average_rating,
  };
}

export type BorrowedBookItem = {
  id: number;
  book_copy_id: number;
  user_id: number;
  borrowed_at: string; // Use string for datetime representation
  due_date: string; // Use string for datetime representation
  returned_at: string | null; // Use string for datetime representation
  status: "borrowed" | "returned" | "overdue"; // Adjust the type based on your actual status values
  renewal_count: number;
  fine_amount: number;
  created_at: string; // Use string for datetime representation
  updated_at: string | null; // Use string for datetime representation
  deleted_at: string | null; // Use string for datetime representation
};

export type BorrowBookPayload = {
  isbn: string;
  shelf_id: number;
};


export type BorrowedBookResponse = {
  id: number;
  book_copy_id: number;
  user_id: number;
  borrowed_at: string; // Use string for datetime representation
  due_date: string; // Use string for datetime representation
  returned_at: string | null; // Use string for datetime representation
  status: "borrowed" | "returned" | "overdue"; // Adjust the type based on your actual status values
  renewal_count: number;
  fine_amount: number;
  created_at: string; // Use string for datetime representation
  updated_at: string | null; // Use string for datetime representation
  deleted_at: string | null; // Use string for datetime representation
}

export type BorrowedBook = {
    id: number;
    user_id: number;
    user_name: string;
    user_email: string;

    book_id: number;
    book_copy_id: number;

    isbn: string;
    title: string;
    author: string;
    genre: string | null;
    image_url: string | null;
    publisher: string | null;

    shelf_code: string;

    borrowed_at: string; // Use string for datetime representation
    due_date: string; // Use string for datetime representation
    returned_at: string | null; // Use string for datetime representation

    status: "BORROWED" | "RETURNED" | "OVERDUE"; // Adjust the type based on your actual status values

    renewal_count: number;
    fine_amount: number;
}




export function transformBorrowedBookResponse(response: BorrowedBook): BorrowedBook {
  return {
    ...response,
    image_url: placeholderImageUrl(response.image_url)
  };
}

export function transformBorrowedBookToBook(response: BorrowedBook[], hardConvert: boolean): Book[] {
  return response.map((book) => ({
    id: hardConvert ? book.book_id : book.id,
    isbn: book.isbn,
    title: book.title,
    author: book.author,
    genre: book.genre ?? "",
    image_url: placeholderImageUrl(book.image_url),
    publisher: book.publisher ?? "",
    language: "",
    description: "",
    rating: 0,
    createdAt: "",
    updatedAt: "",
  }));
}
