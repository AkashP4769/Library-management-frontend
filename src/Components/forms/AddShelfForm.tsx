import { useState } from "react";
import { TextInput } from "@/Components/inputs/TextInput";
import type { CreateShelfPayload } from "@/api-service/shelf/types";
import { useCreateShelfMutation } from "@/api-service/shelf/shelf.api";
import { useToast } from "@/Components/ui/Toast";

type Props = {
  onSuccess?: () => void;
};

export function AddShelfForm({ onSuccess }: Props) {
  const [createShelf, { isLoading }] = useCreateShelfMutation();
  const { toast } = useToast();

  const [shelf, setShelf] = useState<CreateShelfPayload>({
    shelf_code: "",
    office_location: "",
    capacity: 0,
    image: null,
  });
  const [preview, setPreview] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setShelf((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setShelf((prev) => ({ ...prev, image: file }));
    setPreview(URL.createObjectURL(file));
  };

  const resetForm = () => {
    setShelf({ shelf_code: "", office_location: "", capacity: 0, image: null });
    setPreview(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("shelf_code", shelf.shelf_code);
    formData.append("office_location", shelf.office_location);
    formData.append("capacity", shelf.capacity.toString());
    if (shelf.image) formData.append("image", shelf.image);

    createShelf(formData as unknown as CreateShelfPayload)
      .unwrap()
      .then(() => {
        toast({
          title: "Shelf created",
          description: `${shelf.shelf_code || "New shelf"} was added successfully.`,
          variant: "success",
        });
        resetForm();
        onSuccess?.();
      })
      .catch((error) => {
        console.error("Error creating shelf:", error);
        toast({
          title: "Couldn't create shelf",
          description: "Something went wrong. Please try again.",
          variant: "error",
        });
      });
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-5 self-center">
      <div className="flex flex-col gap-6 md:flex-row">
        <ShelfImagePreview
          preview={preview}
          handleImageChange={handleImageChange}
        />

        <div className="flex flex-1 flex-col gap-4">
          <TextInput
            label="Shelf Code"
            name="shelf_code"
            value={shelf.shelf_code}
            onChange={handleChange}
            required
          />
          <TextInput
            label="Office Location"
            name="office_location"
            value={shelf.office_location}
            onChange={handleChange}
            required
          />
          <TextInput
            label="Capacity"
            name="capacity"
            type="number"
            value={shelf.capacity}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="flex justify-end border-t border-[#D0C6AE]/40 pt-4">
        <button
          type="submit"
          disabled={isLoading}
          className="rounded-lg bg-primary-container px-6 py-2 font-medium text-black transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? "Creating…" : "Create Shelf"}
        </button>
      </div>
    </form>
  );
}

function ShelfImagePreview({
  preview,
  handleImageChange,
}: {
  preview: string | null;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="flex w-full flex-col gap-2 md:w-48">
      <div className="h-40 w-full overflow-hidden rounded-lg border border-[#D0C6AE]/50 bg-neutral-50">
        {preview ? (
          <img
            src={preview}
            alt="Preview"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-neutral-400">
            No image
          </div>
        )}
      </div>

      <label className="flex cursor-pointer items-center justify-center rounded-lg border border-[#D0C6AE] px-4 py-2 text-sm font-medium text-[#191C1D] transition hover:bg-[#D0C6AE]/20">
        Select image
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageChange}
        />
      </label>
    </div>
  );
}
