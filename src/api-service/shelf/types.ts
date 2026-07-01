import type Shelf from "@/models/shelf";
import { BASE_URL } from "@/api-service/api";
import type Book from "@/models/book";



export default interface ShelfResponse {
    id: number;
    shelf_code: string;
    office_location: string;
    capacity: number;
    image_url: string;
    createdAt: string;
    updatedAt: string;
}

export type CreateShelfPayload = {
    shelf_code: string;
    office_location: string;
    capacity: number;
    image?: File | null;
};

export interface ShelfBookResponse {
    id?: number;
    isbn: string;
    title: string;
    author: string;
    genre: string | null;
    publisher: string | null;
    language: string | null;
    description: string | null;
    image_url: string | null;
    total_copies: number;
    available_copies: number;
    borrowed_copies: number;
    average_rating: number | null;
}

function imageUrlWithFallback(
    imageUrl: string | null,
    fallback: string,
): string {
    if (!imageUrl) return fallback;
    return imageUrl.startsWith('/uploads/') ? BASE_URL + imageUrl : imageUrl;
}

export function shelfResponseToShelf(shelfResponse: ShelfResponse): Shelf {
    return {
        id: shelfResponse.id,
        shelf_code: shelfResponse.shelf_code,
        office_location: shelfResponse.office_location,
        capacity: shelfResponse.capacity,
        image_url: imageUrlWithFallback(shelfResponse.image_url, "https://img.magnific.com/premium-vector/file-folder-mascot-character-design-vector_166742-4413.jpg?semt=ais_hybrid&w=740&q=80"),
        createdAt: shelfResponse.createdAt,
        updatedAt: shelfResponse.updatedAt
    };
}

export function shelfBookResponseToBook(bookResponse: ShelfBookResponse): Book {
    return {
        id: bookResponse.id ?? 0,
        isbn: bookResponse.isbn,
        title: bookResponse.title,
        author: bookResponse.author,
        genre: bookResponse.genre ?? "",
        publisher: bookResponse.publisher ?? "",
        language: bookResponse.language ?? "",
        description: bookResponse.description ?? "",
        image_url: imageUrlWithFallback(bookResponse.image_url, "https://www.forewordreviews.com/books/covers/how-to-start-and-operate-an-internet-used-book-store-without-spending-a-fortune.jpg"),
        rating: bookResponse.average_rating ?? 0,
        total_copies: bookResponse.total_copies,
        available_copies: bookResponse.available_copies,
        borrowed_copies: bookResponse.borrowed_copies,
        createdAt: "",
        updatedAt: "",
    };
}
