import { useState } from "react";
import { TextInput } from '@/Components/inputs/TextInput';
import { TextAreaInput } from "@/Components/inputs/TextAreaInput";
import { useCreateBookMutation } from "@/api-service/books/books.api";
import type { CreateBookPayload } from "@/api-service/books/types";


export function AddBookForm() {
  const [createBook] = useCreateBookMutation();

  const [book, setBook] = useState<CreateBookPayload>({
    isbn: "",
    title: "",
    author: "",
    genre: "",
    publisher: "",
    language: "",
    description: "",
    image: "",
  });

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log(book);

    createBook(book);
  };

  return (
    <div className="w-full p-6 rounded-xl bg-white shadow-sm ">
      <div className="flex justify-between">
        <h2 className="mb-6 w-full text-2xl font-bold">
          Add New Book
        </h2>
        <button>
            <img src="" alt="" />
            <p>Scan ISBN</p>
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

        <TextAreaInput
          label="Description"
          name="description"
          value={book.description}
          rows={6}
          onChange={handleChange}
        />

        <div className="flex justify-end">
          <button
            type="submit"
            className="
              rounded-lg bg-primary-container
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
    </div>
  );
}