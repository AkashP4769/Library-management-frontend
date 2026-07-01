import { useState } from "react";
import { TextInput } from '@/Components/inputs/TextInput';
import { TextAreaInput } from "@/Components/inputs/TextAreaInput";
import { useCreateBookMutation } from "@/api-service/books/books.api";
import type { CreateBookPayload } from "@/api-service/books/types";
import BarcodeIcon from "@/assets/icons/Barcode.png";
import ISBNScanner from "@components/scanner/ISBNScanner";
import { useLazyGetBookbyOpenLibraryAPIQuery } from "@/api-service/books/books.api";
import { useToast } from "@/Components/ui/Toast";

export function AddBookForm() {
  const [createBook] = useCreateBookMutation();
  const [fetchBook] = useLazyGetBookbyOpenLibraryAPIQuery();
  const { toast } = useToast();
  const [book, setBook] = useState<CreateBookPayload>({
    isbn: "",
    title: "",
    author: "",
    genre: "",
    publisher: "",
    language: "",
    description: "",
    image: null,
  });

  const [preview, setPreview] = useState<string | null>(null);
  const [showScanner, setshowScanner] = useState(false)
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    setBook((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  async function imageUrlToFile(url: string) {
    const response = await fetch(url);

    const blob = await response.blob();

    return new File(
        [blob],
        "cover.jpg",
        { type: blob.type }
    );
}
  const handleImageChange = (
      e: React.ChangeEvent<HTMLInputElement>
  ) => {
      const file = e.target.files?.[0];

      if (!file) return;

      setBook((prev) => ({
          ...prev,
          image: file,
      }));

      setPreview(URL.createObjectURL(file));
  };
  const handleScan = async (isbn: string) => {
    console.log(isbn);
    try {
      const data = await fetchBook(isbn).unwrap();
      let file: File | null = null;
      console.log(data);
      setshowScanner(false);
      if (data){
        const cover_url =
        data.cover_urls?.[1] ??
        data.cover_urls?.[0] ??
        null;

        if(cover_url){
           file = await imageUrlToFile(cover_url);
           setPreview(URL.createObjectURL(file));
        }

        setBook(prev => ({
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
        return;
      }

      toast({
        title: "No book found",
        description: `ISBN ${isbn} did not return book details.`,
        variant: "error",
      });
    } catch (error) {
      setshowScanner(false);
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

    if (book.image) {
        formData.append("image", book.image);
    }

    console.log(book);

    createBook(formData as unknown as CreateBookPayload)
      .unwrap()
      .then(() => {
        toast({
          title: "Book created",
          description: "Book submission received. Check the status shortly.",
          variant: "success",
        });
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
    <div className="w-full p-6 rounded-xl bg-white shadow-sm ">
      <div className="flex justify-between">
        <h2 className="mb-6 w-full text-2xl font-bold">
          Add New Book
        </h2>
        <button
          type="button"
          onClick={()=>{setshowScanner(true)}}
          className="flex items-center gap-2 rounded-lg w-48 justify-center py-2 font-medium bg-tertiary-container hover:bg-neutral-200 text-black transition hover:bg-primary-hover"
        >
          <img src={BarcodeIcon} alt="Barcode icon" />
          <span>Scan ISBN</span>
        </button>
      </div>
     
      <form
        onSubmit={handleSubmit}
        className="space-y-5 w-full self-center"
      >
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

        <div className="grid h-80 grid-cols-2 gap-5 items-stretch">
          <TextAreaInput
            label="Description"
            name="description"
            value={book.description}
            rows={6}
            onChange={handleChange}
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
            Create Book
          </button>
        </div>
      </form>
       {showScanner && (
                    <div className="scanner-overlay">
                      <div className="scanner-modal">
                        <div className="scanner-modal-header">
                          <div>
                            <h2 className="scanner-modal-title">Scan ISBN</h2>
                            <p className="scanner-modal-copy">Place the barcode inside the frame.</p>
                          </div>
                          <span className="scanner-status">
                            <span className="scanner-status-dot" />
                            Camera active
                          </span>
                        </div>
                        <div className="scanner-body">
                          <ISBNScanner onScan={handleScan} />
                          <p className="scanner-hint">Hold steady while Lumina reads the ISBN.</p>
                        </div>
                        <div className="scanner-modal-actions">
                          <button className="scanner-close-button" onClick={() => setshowScanner(false)}>Close</button>
                        </div>
                      </div>
                    </div>
                  )}
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
