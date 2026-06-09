import React, { useEffect } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  width?: "440px" | "480px" | "600px";
  title: string;
  children: React.ReactNode;
}

export default function Modal({
  isOpen,
  onClose,
  width = "440px",
  title,
  children,
}: ModalProps) {
  
  // Handle ESC key press to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Map width values
  const widthStyles = {
    "440px": "max-w-[440px]",
    "480px": "max-w-[480px]",
    "600px": "max-w-[600px]",
  };

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center select-none">
      {/* 1. Backdrop overlay - click closes modal */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity"
        title="Click backdrop to close"
      />

      {/* 2. Modal Dialog Container */}
      <div
        className={`relative bg-white border border-gray-200 rounded-xl shadow-2xl p-6 w-full mx-4 z-[510] transition-all duration-300 scale-100 flex flex-col gap-4 max-h-[90vh] ${widthStyles[width]}`}
        role="dialog"
        aria-modal="true"
      >
        {/* Top Row: Title & Close X Button */}
        <div className="flex items-center justify-between pb-2 border-b border-gray-100 select-none flex-shrink-0">
          <h3 className="card-title select-text">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 p-1 rounded hover:bg-gray-100 btn-transition flex-shrink-0"
            title="Close Modal"
          >
            <i className="fa-solid fa-xmark text-xs"></i>
          </button>
        </div>

        {/* Center Body Section */}
        <div className="text-xs text-gray-700 leading-relaxed select-text py-1 overflow-y-auto pr-1">
          {children}
        </div>
      </div>
    </div>
  );
}
