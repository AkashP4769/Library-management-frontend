import type Shelf from "@/models/shelf";

export default function ShelfCard(shelf: Shelf) {
  return (
    <div
      key={shelf.id}
      className="flex items-center h-70 justify-center rounded-2xl border bg-white border-neutral-200 hover:bg-neutral-200 duration-200 px-4 py-4"
    >
      <div className="flex flex-col h-[90%] w-[90%] items-start justify-between px-4 py-4">
        <img
          src={shelf.image}
          alt={shelf.shelf_code}
          className=" h-[75%] w-full object-cover rounded-2xl"
        />
        <div className="w-full">
          <h3 className="text-lg font-bold mt-2 text-ellipsis">
            {shelf.shelf_code}
          </h3>
          <p className="text-tertiary">{shelf.office_location}</p>
        </div>
      </div>
    </div>
  );
}

interface SmallShelfCardProps {
  shelf: Shelf;
  selected: boolean;
  onClick: () => void;
}
function SmallShelfCard({
  shelf,
  selected,
  onClickShelf,
}: SmallShelfCardProps) {
  return (
    <button
      onClick={onClickShelf}
      className={`flex h-20 w-50  justify-center rounded-2xl border bg-white border-neutral-200 ${
        selected
          ? "border-primary bg-primary/10 ring-2 ring-primary"
          : "border-neutral-200 bg-white hover:border-primary"
      }`}
    >
      <div className="flex justify-between gap-2">
        <img
          src={shelf.image}
          alt={shelf.shelf_code}
          className=" h-full w-3/5 object-cover rounded-2xl"
        />
        <div className="w-[50%]">
          <h3 className="text-lg font-bold mt-2 text-ellipsis">
            {shelf.shelf_code}
          </h3>
          <p className="text-tertiary">{shelf.office_location}</p>
        </div>
      </div>
    </button>
  );
}
export { SmallShelfCard };
