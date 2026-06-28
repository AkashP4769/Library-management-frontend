import ShelfCard from "@/Components/ShelfCard";
import type Shelf from "@/models/shelf";
import { shelves as initialShelves } from "@/models/shelf";
import { useState } from "react";

import './Shelves.css'



export default function ShelvesPage() {
    const [shelves, setShelves] = useState<Shelf[]>(initialShelves);

    return <div className="shelves-page">
        <section className="shelves-section">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Check out from Office shelves</h2>
                <p className="text-primary font-bold hover:underline cursor-pointer">Filter Icon</p>
            </div>
            <div className="grid grid-cols-4 gap-6">
                {shelves.length === 0 ? <p className="text-bold text-primary text-xl">No shelves found</p> : 
                shelves.map((shelf) => (
                    <ShelfCard key={shelf.id} {...shelf} />
                ))}
            </div>
        </section>
    </div>
}