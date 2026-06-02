"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

export type ToastType = "success" | "info" | "warning" | "error";

interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
  icon?: string;
}

interface ToastContextType {
  showToast: (message: string, type: ToastType, icon?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((message: string, type: ToastType, icon?: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    
    setToasts((prevToasts) => [...prevToasts, { id, message, type, icon }]);

    // Auto-dismiss after 3200ms as specified in requirements
    setTimeout(() => {
      setToasts((prevToasts) => prevToasts.filter((t) => t.id !== id));
    }, 3200);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prevToasts) => prevToasts.filter((t) => t.id !== id));
  };

  // Map variants to styling and default Font Awesome icons
  const typeStyles = {
    success: {
      border: "border-l-[3px] border-l-green border-green/10 bg-green-50/95 text-green",
      icon: "fa-circle-check",
    },
    info: {
      border: "border-l-[3px] border-l-blue border-blue/10 bg-blue-50/95 text-blue",
      icon: "fa-circle-info",
    },
    warning: {
      border: "border-l-[3px] border-l-amber border-amber/10 bg-amber-50/95 text-amber",
      icon: "fa-triangle-exclamation",
    },
    error: {
      border: "border-l-[3px] border-l-red border-red/10 bg-red-50/95 text-red",
      icon: "fa-circle-exclamation",
    },
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Toast Container Portal fixed at bottom-right */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-2 z-[600] max-w-[360px] w-full pointer-events-none">
        {toasts.map((toast) => {
          const activeStyle = typeStyles[toast.type] || typeStyles.info;
          const activeIcon = toast.icon || activeStyle.icon;
          
          return (
            <div
              key={toast.id}
              className={`flex items-start justify-between gap-3 p-4 rounded-r-lg shadow-lg pointer-events-auto select-none animate-fade-in border ${
                activeStyle.border
              }`}
            >
              <div className="flex gap-2 items-start">
                <i className={`fa-solid ${activeIcon} text-sm flex-shrink-0 mt-0.5`}></i>
                <span className="text-xs font-medium text-gray-900 select-text leading-snug">
                  {toast.message}
                </span>
              </div>

              {/* Manual Close Button */}
              <button
                onClick={() => removeToast(toast.id)}
                className="text-gray-400 hover:text-gray-700 p-0.5 rounded hover:bg-gray-100/50 flex-shrink-0 btn-transition"
                title="Dismiss Alert"
              >
                <i className="fa-solid fa-xmark text-[11px]"></i>
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
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
