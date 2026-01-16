import { useEffect, useState } from "react";
import {
  FaCheckCircle,
  FaExclamationCircle,
  FaInfoCircle,
  FaTimes,
} from "react-icons/fa";

export type ToastType = "success" | "error" | "info";

export interface LocalToast {
  id: string;
  message: string;
  type: ToastType;
}

export const ToastItem: React.FC<{
  toast: LocalToast;
  onRemove: () => void;
}> = ({ toast, onRemove }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setIsVisible(true));
  }, []);

  const getIcon = () => {
    switch (toast.type) {
      case "success":
        return <FaCheckCircle className="text-brand-500 text-xl" />;
      case "error":
        return <FaExclamationCircle className="text-red-500 text-xl" />;
      default:
        return <FaInfoCircle className="text-brand-400 text-xl" />;
    }
  };

  return (
    <div
      className={`
        relative flex items-center gap-3 w-[320px] sm:w-[380px]
        bg-ui-card border border-ui-border shadow-xl rounded-xl p-4
        transform transition-all duration-500 ease-out
        ${
          isVisible
            ? "translate-x-0 opacity-100"
            : "translate-x-[120%] opacity-0"
        }
      `}
    >
      <div className="flex-shrink-0">{getIcon()}</div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-ui-text break-words leading-snug">
          {toast.message}
        </p>
      </div>
      <button
        onClick={onRemove}
        className="flex-shrink-0 text-ui-muted hover:text-ui-text transition-colors p-1 rounded-full hover:bg-gray-50"
      >
        <FaTimes className="text-xs" />
      </button>
    </div>
  );
};
