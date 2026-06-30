type TextInputProps = {
  label: string;
  name: string;
  value: string | number;
  placeholder?: string;
  required?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
};

export function TextInput({
  label,
  name,
  value,
  placeholder,
  required,
  onChange,
  type
}: TextInputProps) {
  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={name}
        className="text-sm font-medium text-gray-700"
      >
        {label}
      </label>

      <input
        id={name}
        name={name}
        value={value}
        type={type}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="
          rounded-lg border border-gray-300
          px-4 py-2
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