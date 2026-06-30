import { useState } from "react";
import { TextInput } from '@/Components/inputs/TextInput';

import type { CreateShelfPayload } from "@/api-service/shelf/types";
import { useCreateShelfMutation } from "@/api-service/shelf/shelf.api";


export function AddShelfForm() {
  const [createShelf] = useCreateShelfMutation();

  const [shelf, setShelf] = useState<CreateShelfPayload>({
    shelf_code: "",
    office_location: "",
    capacity: 0,
    image: null,
  });


  const [preview, setPreview] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    setShelf((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (
      e: React.ChangeEvent<HTMLInputElement>
  ) => {
      const file = e.target.files?.[0];

      if (!file) return;

      setShelf((prev) => ({
          ...prev,
          image: file,
      }));

      setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("shelf_code", shelf.shelf_code);
    formData.append("office_location", shelf.office_location);
    formData.append("capacity", shelf.capacity.toString());

    if (shelf.image) {
        formData.append("image", shelf.image);
    }

    console.log(shelf);

    createShelf(formData as unknown as CreateShelfPayload);
  };

  return (
    <div className="w-full p-6 rounded-xl bg-white shadow-sm ">
      <div className="flex justify-between">
        <h2 className="mb-6 w-full text-2xl font-bold">
          Add New Shelf
        </h2>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-5 w-full self-center"
      >
        <div className="grid gap-5 md:grid-cols-3">
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

          <BookImagePreview preview={preview} handleImageChange={handleImageChange} />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="
              rounded-lg bg-primary-container
              hover:bg-amber-400
              duration-200
              px-6 py-2
              font-medium text-black
              transition
              hover:bg-primary-hover
            "
          >
            Create Shelf
          </button>
        </div>
      </form>
    </div>
  );
}

function BookImagePreview({ preview, handleImageChange }: { preview: string | null; handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) {
  return (
    <div className="flex flex-col h-full gap-2">
      <label className="text-sm ml-2 font-medium">
          Book Cover
      </label>

      <div className="flex flex-1 items-center justify-start gap-6 rounded-lg  border-neutral-300">
          <div className="h-full w-40 overflow-hidden rounded-lg border bg-gray-100">
              {preview ? (
                  <img
                      src={preview}
                      alt="Preview"
                      className="h-full w-full object-cover"
                  />
              ) : (
                  <div className="flex h-full items-center justify-center text-sm text-gray-400">
                      No Image
                  </div>
              )}
          </div>

          <label className="cursor-pointer rounded-lg border px-4 py-2 hover:bg-gray-50">
              Select Image

              <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
              />
          </label>
      </div>
  </div>
  )
}