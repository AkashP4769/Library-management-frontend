export default interface Book {
    id: number;
    title: string;
    author: string;
    genre: string;
    publisher: string;
    language: string;
    description: string;
    image: string;
    rating: number;
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