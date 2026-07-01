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
    <div className="scanner-video-shell">
      <video ref={ref} className="scanner-video" />
      <div className="scanner-frame" aria-hidden="true" />
    </div>
  );
}
