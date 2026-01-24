import { FaExclamationCircle, FaSpinner } from "react-icons/fa";

interface LogoutModalProps {
  isOpen: boolean;
  loading: boolean;
  error: string | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export const LogoutModal = ({
  isOpen,
  loading,
  error,
  onConfirm,
  onCancel,
}: LogoutModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-ui-card rounded-2xl shadow-2xl p-6 max-w-sm w-full mx-auto">
        <h3 className="text-xl font-bold text-ui-text mb-2">Log out?</h3>
        <p className="text-ui-text mb-6">Are you sure you want to log out?</p>

        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2 text-red-600 text-sm">
            <FaExclamationCircle className="mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 px-4 py-2 rounded-xl border border-ui-border text-ui-text hover:bg-ui-bg disabled:opacity-70"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 px-4 py-2 rounded-xl bg-brand-500 text-white hover:bg-brand-600 disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {loading ? <FaSpinner className="animate-spin" /> : "Log out"}
          </button>
        </div>
      </div>
    </div>
  );
};
