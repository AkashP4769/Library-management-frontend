

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

export const books = [
    {
        id: 1,
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        genre: "Fiction",
        publisher: "Scribner",
        language: "English",
        description: "A classic American novel set in the Jazz Age.",
        image: "https://images.unsplash.com/photo-1554080353-a576cf803bda?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fHBob3RvZ3JhcGh5fGVufDB8fDB8fHww",
        rating: 4.5,
        createdAt: "2023-01-01T00:00:00Z",
        updatedAt: "2023-01-01T00:00:00Z"
    },
    {
        id: 2,
        title: "To Kill a Mockingbird",
        author: "Harper Lee",
        genre: "Fiction",
        publisher: "J.B. Lippincott & Co.",
        language: "English",
        description: "A gripping tale of racial injustice and childhood innocence.",
        image: "https://images.unsplash.com/photo-1601134991665-a020399422e3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fHBob3RvfGVufDB8fDB8fHww",
        rating: 4.8,
        createdAt: "2023-01-01T00:00:00Z",
        updatedAt: "2023-01-01T00:00:00Z"
    },
    {
        id: 3,
        title: "1984",
        author: "George Orwell",
        genre: "Dystopian Fiction",
        publisher: "Secker & Warburg",
        language: "English",
        description: "A dystopian social science fiction novel and cautionary tale.",
        image: "https://images.unsplash.com/photo-1531804055935-76f44d7c3621?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8cGhvdG98ZW58MHx8MHx8fDA%3D",
        rating: 4.9,
        createdAt: "2023-01-01T00:00:00Z",
        updatedAt: "2023-01-01T00:00:00Z"
    },
    {
        id: 4,
        title: "The Catcher in the Rye",
        author: "J.D. Salinger",
        genre: "Fiction",
        publisher: "Little, Brown and Company",
        language: "English",
        description: "A controversial novel that has been the subject of censorship debates.",
        image: "https://images.unsplash.com/photo-1457089328109-e5d9bd499191?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fHBob3RvfGVufDB8fDB8fHww",
        rating: 4.2,
        createdAt: "2023-01-01T00:00:00Z",
        updatedAt: "2023-01-01T00:00:00Z"
    }


];
