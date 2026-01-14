import { useEffect, useState } from "react";
import { FaTimes, FaCheck } from "react-icons/fa";

interface CategoryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; color: string }) => void;
  initialName?: string;
  initialColor?: string;
  title: string;
  isLoading: boolean;
  error?: string;
}

// Design tokens converted to Hex
const COLOR_PRESETS = [
  "#0284c7", // Blue
  "#059669", // Green
  "#ea580c", // Orange
  "#dc2626", // Red
  "#7c3aed", // Purple
  "#db2777", // Pink
  "#ca8a04", // Yellow
  "#475569", // Slate
];

const CategoryFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialName = "",
  initialColor = COLOR_PRESETS[0],
  title,
  isLoading,
  error,
}: CategoryFormModalProps) => {
  const [name, setName] = useState(initialName);
  const [color, setColor] = useState(initialColor);

  useEffect(() => {
    setName(initialName);
    setColor(initialColor);
  }, [initialName, initialColor, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit({ name, color });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-ui-card w-full max-w-md rounded-xl shadow-2xl border border-ui-border overflow-hidden transform transition-all">
        {/* Header */}
        <div className="px-6 py-4 border-b border-ui-border flex justify-between items-center bg-ui-bg/50">
          <h3 className="text-lg font-bold text-ui-text">{title}</h3>
          <button
            onClick={onClose}
            className="text-ui-muted hover:text-red-500 transition-colors"
          >
            <FaTimes />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-ui-text mb-2">
                Category Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 bg-ui-bg border border-ui-border rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all text-ui-text"
                placeholder="e.g. Work, Personal"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-ui-text mb-2">
                Color Tag
              </label>
              <div className="grid grid-cols-8 gap-2">
                {COLOR_PRESETS.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setColor(preset)}
                    className={`h-8 w-8 rounded-full border-2 transition-transform hover:scale-110 ${
                      color === preset
                        ? "border-ui-text scale-110 ring-2 ring-offset-2 ring-ui-text"
                        : "border-transparent"
                    }`}
                    style={{ backgroundColor: preset }}
                  >
                    {color === preset && (
                      <FaCheck className="text-white text-xs m-auto" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-ui-muted hover:text-ui-text bg-white border border-ui-border rounded-lg hover:shadow-sm transition-all"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !name.trim()}
              className="px-6 py-2 text-sm font-semibold text-white bg-brand-600 rounded-lg hover:bg-brand-500 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
            >
              {isLoading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              ) : (
                "Save"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryFormModal;
