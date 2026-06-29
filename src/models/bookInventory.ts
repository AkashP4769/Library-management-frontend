import type Book from "./book";
import type Shelf from "./shelf";

export interface BookInventory {
    book: Book;
    shelf: Shelf;
}