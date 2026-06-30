import { useEffect, useState } from "react";

type SuccessBannerProps = {
  message: string;
  isVisible: boolean;
};

export function SuccessBanner({ message, isVisible }: SuccessBannerProps) {
  const [visible, setVisible] = useState(isVisible);
  const [shouldRender, setShouldRender] = useState(isVisible);

  useEffect(() => {
    if (!isVisible) {
      setVisible(false);
      const timer = window.setTimeout(() => {
        setShouldRender(false);
      }, 250);
      return () => window.clearTimeout(timer);
    }

    setShouldRender(true);
    setVisible(true);

    const timer = window.setTimeout(() => {
      setVisible(false);
    }, 3000);

    return () => window.clearTimeout(timer);
  }, [isVisible]);

  if (!shouldRender) return null;

  return (
    <div
      className={`fixed right-4 top-4 z-50 rounded-lg border border-neutral-300 bg-neutral-100 px-4 py-3 shadow-lg text-neutral-800 transition-transform  ease-in ${visible ? "translate-x-0" : "translate-x-[120%]"}`}
    >
      <p className="font-medium">{message}</p>
    </div>
  );
}
