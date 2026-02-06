"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { CheckCircle, XCircle, AlertCircle, X } from "lucide-react";

type ToastType = "success" | "error" | "info";

interface Toast {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastContextType {
  showToast: (type: ToastType, message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (type: ToastType, message: string) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, message }]);

    // Auto remove after 5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 5000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => {
          const icon = {
            success: <CheckCircle className="h-5 w-5 text-green-500" />,
            error: <XCircle className="h-5 w-5 text-red-500" />,
            info: <AlertCircle className="h-5 w-5 text-blue-500" />,
          }[toast.type];

          const bg = {
            success: "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800",
            error: "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800",
            info: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800",
          }[toast.type];

          return (
            <div
              key={toast.id}
              className={`flex items-center gap-3 p-4 rounded-lg border ${bg} shadow-lg animate-in slide-in-from-right`}
            >
              {icon}
              <p className="flex-1 text-sm text-text-primary-light dark:text-text-primary-dark">
                {toast.message}
              </p>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-text-secondary-light dark:text-text-secondary-dark hover:text-text-primary-light dark:hover:text-text-primary-dark"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
