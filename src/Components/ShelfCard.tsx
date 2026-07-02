import type Shelf from "@/models/shelf";

type ShelfCardProps = Shelf & {
  selected?: boolean;
  onClickShelf?: (shelf: Shelf) => void;
};

export default function ShelfCard({
  selected = false,
  onClickShelf,
  ...shelf
}: ShelfCardProps) {
  return (
    <button
      type="button"
      key={shelf.id}
      onClick={() => onClickShelf?.(shelf)}
      className={`flex items-center h-70 justify-center rounded-2xl border bg-white duration-200 large-book-card-padding text-left ${
        selected
          ? "border-primary ring-2 ring-primary/20"
          : "border-neutral-200 hover:bg-neutral-200"
      }`}
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
    </button>
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
      className={`flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition-all ${
        selected
          ? "border-primary bg-primary/10 ring-2 ring-primary/20"
          : "border-neutral-200 bg-white hover:border-primary"
      }`}
    >
      <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg">
        <img
          src={shelf.image_url}
          alt={shelf.shelf_code}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="flex min-w-0 flex-col">
        <h3 className="truncate text-base font-bold">{shelf.shelf_code}</h3>
        <p className="truncate text-sm text-tertiary">
          {shelf.office_location}
        </p>
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
            src={shelf.image_url}
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
