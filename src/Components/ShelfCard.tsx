import type Shelf from "@/models/shelf";


export default function ShelfCard(shelf: Shelf) {
    return (
        <div key={shelf.id} className="flex items-center h-70 justify-center rounded-2xl border bg-white border-neutral-200 hover:bg-neutral-200 duration-200 px-4 py-4">
            <div className="flex flex-col h-[90%] w-[90%] items-start justify-between px-4 py-4">
                <img src={shelf.image} alt={shelf.shelf_code} className=" h-[75%] w-full object-cover rounded-2xl" />
                <div className="w-full">
                    <h3 className="text-lg font-bold mt-2 text-ellipsis">{shelf.shelf_code}</h3>
                    <p className="text-tertiary">{shelf.office_location}</p>
                </div>
            </div>
        </div>
    );
}