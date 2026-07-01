import ShelfCard from "@/Components/ShelfCard";
import type Shelf from "@/models/shelf";
import { useEffect, useState } from "react";

import './Shelves.css'
import { useGetShelvesQuery } from "@/api-service/shelf/shelf.api";
import { useNavigate } from "react-router";



export default function ShelvesPage() {
    const { data: fetchedShelves } = useGetShelvesQuery();
    const [shelves, setShelves] = useState<Shelf[]>([]);

    useEffect(() => {
        if (fetchedShelves) {
            console.log("Fetched Shelves:", fetchedShelves);
            setShelves(fetchedShelves);
        }
    }, [fetchedShelves]);

    const navigate = useNavigate();

    return <div className="shelves-page">
        <section className="shelves-section">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Check out from Office shelves</h2>
                <p className="text-primary font-bold hover:underline cursor-pointer">Filter Icon</p>
            </div>
            <div className="grid grid-cols-4 gap-6">
                {shelves.length === 0 ? <p className="text-bold text-primary text-xl">No shelves found</p> : 
                shelves.map((shelf) => (
                    <ShelfCard
                        key={shelf.id}
                        {...shelf}
                        onClickShelf={() => navigate(`/catalog?shelfId=${shelf.id}`)}
                    />
                ))}
            </div>
        </section>
    </div>
}