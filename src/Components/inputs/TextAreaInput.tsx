type TextAreaInputProps = {
  label: string;
  name: string;
  value: string;
  placeholder?: string;
  rows?: number;
  onChange: (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => void;
};

export function TextAreaInput({
  label,
  name,
  value,
  placeholder,
  rows = 5,
  onChange,
}: TextAreaInputProps) {
  return (
    <div className="flex h-full flex-col gap-2">
      <label
        htmlFor={name}
        className="text-sm font-medium text-gray-700"
      >
        {label}
      </label>

      <textarea
        id={name}
        name={name}
        rows={rows}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="
            flex-1
            rounded-lg border border-gray-300
            px-4 py-2
            resize-none
            outline-none
            transition
            focus:border-blue-500
            focus:ring-2
            focus:ring-blue-200
        "
      />
    </div>
  );
}