import type Shelf from "@/models/shelf";

export default function ShelfCard(shelf: Shelf) {
  return (
    <div
      key={shelf.id}
      className="flex items-center h-70 justify-center rounded-2xl border bg-white border-neutral-200 hover:bg-neutral-200 duration-200 large-book-card-padding"
    >
      <div className="flex flex-col h-[90%] w-[90%] items-start justify-between large-book-card-padding">
        <img
          src={shelf.image_url}
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
  onClickShelf: () => void;
}
function SmallShelfCard({
  shelf,
  selected,
  onClickShelf,
}: SmallShelfCardProps) {
  return (
    <button
      onClick={onClickShelf}
      className={`flex h-15 w-90  justify-center rounded-2xl 
        transition-all border 
        ${
          selected
            ? "border-primary bg-primary/20"
            : "border-neutral-200 bg-white hover:border-primary"
        }`}
    >
      <div className="flex justify-between gap-2">
        <img
          src={shelf.image_url}
          alt={shelf.shelf_code}
          className=" h-full w-3/5 object-cover rounded-l-2xl"
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

function BookDetailShelfCard({
  shelf,
  selected,
  onClickShelf,
}: SmallShelfCardProps) {
  return (
    <button
      onClick={onClickShelf}
      className={`w-full rounded-xl border p-3 transition-all ${
        selected
          ? "border-primary bg-primary/10"
          : "border-neutral-200 bg-white hover:border-primary"
      }`}
    >
      <div className="flex items-center gap-3">
        {/* Image */}
        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg">
          <img
            src={shelf.image}
            alt={shelf.shelf_code}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="flex min-w-0 flex-col text-left">
          <h3 className="truncate text-sm font-semibold text-[#191C1D]">
            {shelf.shelf_code}
          </h3>

          <p className="truncate text-xs text-[#575E70]">
            {shelf.office_location}
          </p>
        </div>
      </div>
    </button>
  );
}

export { BookDetailShelfCard };
