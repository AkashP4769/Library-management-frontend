import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";

type ToastVariant = "success" | "error" | "info";

type ToastInput = {
  title: string;
  description?: string;
  variant?: ToastVariant;
};

type ToastItem = Required<Pick<ToastInput, "title" | "variant">> & {
  id: number;
  description?: string;
};

type ToastContextValue = {
  toast: (toast: ToastInput) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

const icons = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const toast = useCallback(
    ({ title, description, variant = "info" }: ToastInput) => {
      const id = Date.now() + Math.random();
      setToasts((current) => [
        ...current,
        { id, title, description, variant },
      ]);

      window.setTimeout(() => dismiss(id), 3600);
    },
    [dismiss],
  );

  const value = useMemo(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toast-viewport" role="status" aria-live="polite">
        {toasts.map((item) => {
          const Icon = icons[item.variant];

          return (
            <div
              className={`toast-card toast-card-${item.variant}`}
              key={item.id}
            >
              <Icon className="toast-icon" size={20} />
              <div className="toast-content">
                <strong>{item.title}</strong>
                {item.description && <p>{item.description}</p>}
              </div>
              <button
                className="toast-close"
                onClick={() => dismiss(item.id)}
                aria-label="Dismiss notification"
              >
                <X size={16} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used inside ToastProvider");
  }

  return context;
}
