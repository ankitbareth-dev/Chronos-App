import { FaExclamationTriangle, FaTrash, FaSpinner } from "react-icons/fa";

interface DeleteCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  categoryName: string;
  isLoading: boolean;
}

const DeleteCategoryModal = ({
  isOpen,
  onClose,
  onConfirm,
  categoryName,
  isLoading,
}: DeleteCategoryModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-ui-card w-full max-w-sm rounded-xl shadow-2xl border border-ui-border overflow-hidden transform transition-all">
        {/* Header with Warning Icon */}
        <div className="bg-red-50 p-6 flex justify-center border-b border-red-100">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-red-500 shadow-sm">
            <FaExclamationTriangle className="text-xl" />
          </div>
        </div>

        {/* Body */}
        <div className="p-6 text-center">
          <h3 className="text-lg font-bold text-ui-text mb-2">
            Delete Category?
          </h3>
          <p className="text-sm text-ui-muted leading-relaxed">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-ui-text">"{categoryName}"</span>
            ? This action cannot be undone.
          </p>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-ui-bg/50 border-t border-ui-border flex gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 px-4 py-2 text-sm font-medium text-ui-muted hover:text-ui-text bg-white border border-ui-border rounded-lg hover:shadow-sm transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 px-4 py-2 text-sm font-semibold text-white bg-red-500 rounded-lg hover:bg-red-600 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <FaSpinner className="animate-spin text-xs" /> Deleting...
              </>
            ) : (
              <>
                <FaTrash className="text-xs" /> Delete
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteCategoryModal;
