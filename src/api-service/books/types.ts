import type Book from "@/models/book";

export default interface BookResponse {
    id: number;
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
        title: bookResponse.title,
        author: bookResponse.author,
        genre: bookResponse.genre,
        publisher: bookResponse.publisher,
        language: bookResponse.language,
        description: bookResponse.description,
        image_url: bookResponse.image_url,
        rating: 0, // Assuming rating is not part of the response, set it to a default value
        createdAt: bookResponse.createdAt,
        updatedAt: bookResponse.updatedAt
    };
}