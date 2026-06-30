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
    image_url: bookResponse.image_url
      ? bookResponse.image_url.startsWith("/uploads/")
        ? BASE_URL + bookResponse.image_url
        : bookResponse.image_url
      : "https://www.forewordreviews.com/books/covers/how-to-start-and-operate-an-internet-used-book-store-without-spending-a-fortune.jpg",
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
    image_url: item.image_url
      ? item.image_url.startsWith("/uploads/")
        ? BASE_URL + item.image_url
        : item.image_url
      : "https://www.forewordreviews.com/books/covers/how-to-start-and-operate-an-internet-used-book-store-without-spending-a-fortune.jpg",
    shelf_id: item.shelf_id,
    shelf_code: item.shelf_code,
    office_location: item.office_location,
    total_copies: item.total_copies,
    available_copies: item.available_copies,
    borrowed_copies: item.borrowed_copies,
    average_rating: item.average_rating,
  };
}
