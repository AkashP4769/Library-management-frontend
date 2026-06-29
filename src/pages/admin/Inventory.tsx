import { AddBookForm } from '@/Components/forms/AddBookForm';
import { HiMiniPlus } from "react-icons/hi2";
import { MdOutlineUploadFile } from "react-icons/md";
import './Inventory.css'
// import InventoryTable from '@/components/table/InventoryTable';

import type { BookInventory } from "@/models/bookInventory";
import { books as initialBooks } from "@/models/book";
import { shelves as initialShelves } from "@/models/shelf";
import { useState } from 'react';
import { AddBookToShelfForm } from '@/Components/forms/AddBooKToShelfForm';
import { InventoryTable } from '@/Components/table/BookInventory';

const books: BookInventory[] = initialBooks.map((book, index) => ({
    book,
    shelf: initialShelves[index % initialShelves.length],
}));


export default function InventoryPage() {
    const [pageState, setPageState] = useState<'inventory' | 'new-book'>('inventory');

    return (
        <div className="inventory-page">
            <h1 className="text-4xl font-bold mb-4">Inventory</h1>
            <p className="text-lg text-gray-600">This is the Inventory page.</p>
            <p className="text-lg text-gray-600">You can add more details about inventory here.</p>

            {/* <BookForm /> */}
            {pageState === 'inventory' && <BookArchive setPageState={setPageState} />}
            {pageState === 'new-book' && <NewBook />}
            {pageState === 'new-book' && <AddBookToShelves />}

            {/* <InventoryTable books={books} /> */}
        </div>

       
    );
}

function NewBook() {
    return (
        <div className= "flex justify-center items-center">
            <AddBookForm />
        </div>
    );
}

function AddBookToShelves(){
    return (
        <div className= "flex justify-center items-center">
            <AddBookToShelfForm />
        </div>
    );
}

function BookArchive({ setPageState }: { setPageState: React.Dispatch<React.SetStateAction<'inventory' | 'new-book'>> }) {
    return (
        <div className="flex flex-col gap-4 mt-6">
            <div className="flex justify-between items-center">
                <div className="flex flex-col items-start">
                    <h1 className="text-3xl font-bold">Book Archives</h1>
                    <p className="text-gray-600">Centralized tracking of all books in the library.</p>
                </div>
                <div className="flex flex-1 justify-end h-full gap-4">
                    <button className='w-32 flex justify-center items-center bg-tertiary-container text-white py-8 px-10 rounded-2xl hover:bg-tertiary-hover border border-tertiary'>
                        <MdOutlineUploadFile className="inline-block mr-1" />
                        <p className="text-sm font-semibold text-primary">Bulk import</p>
                    </button>

                    <button onClick={() => setPageState('new-book')} className='w-32 flex justify-center items-center bg-primary-container text-white py-2 px-4 rounded-2xl hover:bg-primary-hover border border-primary'>
                        <HiMiniPlus className="inline-block mr-1" />
                        <p className="text-sm font-semibold text-primary">Add New Book</p>
                    </button>
                </div>
            </div>
            <InventoryTable books={books} />
        </div>
    )
}