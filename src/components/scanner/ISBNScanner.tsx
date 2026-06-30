import { useZxing } from "react-zxing";

type Props = {
  onScan: (isbn: string) => void;
};

export default function ISBNScanner({ onScan }: Props) {
  const { ref } = useZxing({
    onDecodeResult(result) {
      console.log(result);

      onScan(result.rawValue);
    },
  });

  return (
    <video
      ref={ref}
      style={{
        width: "100%",
        borderRadius: 12,
      }}
    />
  );
}