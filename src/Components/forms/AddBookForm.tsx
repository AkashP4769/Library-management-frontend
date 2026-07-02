import { useState } from "react";
import { TextInput } from "@/Components/inputs/TextInput";
import { TextAreaInput } from "@/Components/inputs/TextAreaInput";
import { useCreateBookMutation } from "@/api-service/books/books.api";
import type { CreateBookPayload } from "@/api-service/books/types";
import BarcodeIcon from "@/assets/icons/Barcode.png";
import ISBNScanner from "@components/scanner/ISBNScanner";
import { useLazyGetBookbyOpenLibraryAPIQuery } from "@/api-service/books/books.api";
import { useToast } from "@/Components/ui/Toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const EMPTY_BOOK: CreateBookPayload = {
  isbn: "",
  title: "",
  author: "",
  genre: "",
  publisher: "",
  language: "",
  description: "",
  image: null,
};

type Props = {
  onSuccess?: () => void;
};

async function imageUrlToFile(url: string) {
  const response = await fetch(url);
  const blob = await response.blob();
  return new File([blob], "cover.jpg", { type: blob.type });
}

export function AddBookForm({ onSuccess }: Props) {
  const [createBook, { isLoading: isCreating }] = useCreateBookMutation();
  const [fetchBook, { isFetching: isLookingUp }] =
    useLazyGetBookbyOpenLibraryAPIQuery();
  const { toast } = useToast();

  const [book, setBook] = useState<CreateBookPayload>(EMPTY_BOOK);
  const [preview, setPreview] = useState<string | null>(null);
  const [showScanner, setShowScanner] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setBook((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBook((prev) => ({ ...prev, image: file }));
    setPreview(URL.createObjectURL(file));
  };

  const resetForm = () => {
    setBook(EMPTY_BOOK);
    setPreview(null);
  };

  const handleScan = async (isbn: string) => {
    console.log(isbn);
    setShowScanner(false);
    let file: File | null = null;
    try {
      const data = await fetchBook(isbn).unwrap();
      console.log(data);
      if (!data) {
        toast({
          title: "No book found",
          description: `ISBN ${isbn} did not return book details.`,
          variant: "error",
        });
        return;
      }

      if (data) {
        const cover_url = data.cover_urls?.[1] ?? data.cover_urls?.[0] ?? null;

        if (cover_url) {
          file = await imageUrlToFile(cover_url);
          setPreview(URL.createObjectURL(file));
        }

        setBook((prev) => ({
          ...prev,
          isbn,
          title: data.title ?? "",
          author: data.author ?? "",
          publisher: data.publisher ?? "",
          language: data.language ?? "",
          description: "",
          image: file,
        }));

        let file: File | null = null;
        const coverUrl = data.cover_urls?.[1] ?? data.cover_urls?.[0] ?? null;

        if (coverUrl) {
          try {
            file = await imageUrlToFile(coverUrl);
            setPreview(URL.createObjectURL(file));
          } catch (imageError) {
            console.error("Error fetching cover image:", imageError);
            // Book details are still usable even if the cover fails to load.
          }
        }

        setBook((prev) => ({
          ...prev,
          isbn,
          title: data.title ?? "",
          author: data.author ?? "",
          publisher: data.publisher ?? "",
          language: data.language ?? "",
          description: "",
          image: file,
        }));

        toast({
          title: "ISBN scanned",
          description: "Book details were filled from Open Library.",
          variant: "success",
        });
      }
    } catch (error) {
      setShowScanner(false);
      toast({
        title: "Scanner lookup failed",
        description: "Please check the ISBN or enter the details manually.",
        variant: "error",
      });
      console.error("Error fetching scanned ISBN:", error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("isbn", book.isbn);
    formData.append("title", book.title);
    formData.append("author", book.author);
    formData.append("genre", book.genre);
    formData.append("publisher", book.publisher);
    formData.append("language", book.language);
    formData.append("description", book.description);
    if (book.image) formData.append("image", book.image);

    createBook(formData as unknown as CreateBookPayload)
      .unwrap()
      .then(() => {
        toast({
          title: "Book created",
          description: `"${book.title}" was added to the library.`,
          variant: "success",
        });
        resetForm();
        onSuccess?.();
      })
      .catch((error) => {
        toast({
          title: "Could not create book",
          description: "Please review the details and try again.",
          variant: "error",
        });
        console.error("Error creating book:", error);
      });
  };

  return (
    <>
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setShowScanner(true)}
          className="flex w-48 items-center justify-center gap-2 rounded-lg bg-tertiary-container py-2 font-medium text-black transition hover:bg-tertiary-hover"
        >
          <img src={BarcodeIcon} alt="" className="h-5 w-5" />
          <span>Scan ISBN</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="w-full space-y-5 self-center">
        <div className="grid gap-5 md:grid-cols-3">
          <TextInput
            label="ISBN"
            name="isbn"
            value={book.isbn}
            onChange={handleChange}
            required
          />
          <TextInput
            label="Title"
            name="title"
            value={book.title}
            onChange={handleChange}
            required
          />
          <TextInput
            label="Author"
            name="author"
            value={book.author}
            onChange={handleChange}
            required
          />
          <TextInput
            label="Genre"
            name="genre"
            value={book.genre}
            onChange={handleChange}
          />
          <TextInput
            label="Publisher"
            name="publisher"
            value={book.publisher}
            onChange={handleChange}
          />
          <TextInput
            label="Language"
            name="language"
            value={book.language}
            onChange={handleChange}
          />
        </div>

        <div className="grid grid-cols-2 gap-5">
          <TextAreaInput
            label="Description"
            name="description"
            value={book.description}
            rows={6}
            onChange={handleChange}
          />
          <BookImagePreview
            preview={preview}
            handleImageChange={handleImageChange}
          />
        </div>

        <div className="flex justify-end border-t border-[#D0C6AE]/40 pt-4">
          <button
            type="submit"
            disabled={isCreating}
            className="rounded-lg bg-primary-container px-6 py-2 font-medium text-black transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isCreating ? "Creating…" : "Create Book"}
          </button>
        </div>
      </form>

      <Dialog open={showScanner} onOpenChange={setShowScanner}>
        <DialogContent className="max-w-md bg-white">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle>Scan ISBN</DialogTitle>
                <p className="text-sm text-[#575E70]">
                  Place the barcode inside the frame.
                </p>
              </div>
              <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Camera active
              </span>
            </div>
          </DialogHeader>

          <div className="space-y-3">
            <ISBNScanner onScan={handleScan} />
            <p className="text-center text-sm text-[#575E70]">
              {isLookingUp
                ? "Looking up ISBN…"
                : "Hold steady while the camera reads the barcode."}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

function BookImagePreview({
  preview,
  handleImageChange,
}: {
  preview: string | null;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="ml-1 text-sm font-medium text-[#191C1D]">
        Book Cover
      </label>

      <div className="flex flex-1 items-center gap-6 rounded-lg">
        <div className="h-40 w-32 overflow-hidden rounded-lg border border-[#D0C6AE]/50 bg-neutral-50">
          {preview ? (
            <img
              src={preview}
              alt="Preview"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-neutral-400">
              No image
            </div>
          )}
        </div>

        <label className="cursor-pointer rounded-lg border border-[#D0C6AE] px-4 py-2 text-sm font-medium text-[#191C1D] transition hover:bg-[#D0C6AE]/20">
          Select image
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
        </label>
      </div>
    </div>
  );
}
