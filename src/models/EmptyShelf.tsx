type Props = {
  message: string;
};

export default function EmptyShelf({ message }: Props) {
  return (
    <div className="col-span-full rounded-xl border-2 border-dashed border-gray-300 py-12 text-center">
      <p className="text-gray-500">{message}</p>
    </div>
  );
}
