import { useEffect, useState } from "react";
import {
  FaPlus,
  FaTrash,
  FaLayerGroup,
  FaCalendarAlt,
  FaSpinner,
  FaPen,
  FaCheck,
  FaTimes,
  FaExclamationCircle,
  FaCheckCircle,
} from "react-icons/fa";
import { type Matrix } from "../../features/matrix/matrixSlice";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  fetchMatrices,
  deleteMatrix,
  editMatrix,
  selectMatrixState,
} from "../../features/matrix/matrixSlice";
import CreateMatrixModal from "../matrix/CreateMatrixModal";

type ToastType = "success" | "error" | "info";

interface LocalToast {
  id: string;
  message: string;
  type: ToastType;
}

const ToastItem: React.FC<{ toast: LocalToast; onRemove: () => void }> = ({
  toast,
  onRemove,
}) => {
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
        return null;
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

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { matrices, loading, deletingId } = useAppSelector(selectMatrixState);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [toasts, setToasts] = useState<LocalToast[]>([]);

  const showToast = (message: string, type: ToastType) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  useEffect(() => {
    dispatch(fetchMatrices())
      .unwrap()
      .catch(() => {
        showToast("Failed to load matrices", "error");
      });
  }, [dispatch]);

  const handleDelete = async (matrixId: string) => {
    try {
      await dispatch(deleteMatrix(matrixId)).unwrap();
      showToast("Matrix deleted successfully", "success");
    } catch (error) {
      const errorMessage =
        typeof error === "string" ? error : "Failed to delete matrix";
      showToast(errorMessage, "error");
    }
  };

  const startEdit = (matrix: Matrix) => {
    setEditingId(matrix.id);
    setEditingName(matrix.name);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingName("");
  };

  const saveEdit = async () => {
    if (!editingId || !editingName.trim()) return;

    try {
      await dispatch(editMatrix({ id: editingId, name: editingName })).unwrap();
      showToast("Matrix name updated", "success");
      setEditingId(null);
      setEditingName("");
    } catch (error) {
      const errorMessage =
        typeof error === "string" ? error : "Failed to update name";
      showToast(errorMessage, "error");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const isEmpty = !loading && matrices.length === 0;

  return (
    <div className="min-h-screen bg-ui-bg pb-20 pt-28 px-4 sm:px-6 lg:px-8">
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 pointer-events-none">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <ToastItem
              toast={toast}
              onRemove={() =>
                setToasts((prev) => prev.filter((t) => t.id !== toast.id))
              }
            />
          </div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-10 gap-4">
          {!isEmpty && (
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-brand-600 text-white text-sm font-semibold rounded-lg hover:bg-brand-500 transition-all shadow-sm hover:shadow-md active:scale-95"
            >
              <FaPlus className="text-xs" /> New Matrix
            </button>
          )}
        </div>

        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="bg-ui-card border border-ui-border rounded-xl p-6 h-40 animate-pulse"
              >
                <div className="h-6 bg-ui-bg rounded w-3/4 mb-6"></div>
                <div className="h-4 bg-ui-bg rounded w-1/2 mb-2"></div>
                <div className="h-10 bg-ui-bg rounded w-full"></div>
              </div>
            ))}
          </div>
        )}

        {isEmpty && (
          <div className="flex flex-col items-center justify-center min-h-[400px] text-center bg-ui-card rounded-2xl border border-ui-border shadow-sm relative overflow-hidden">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-brand-100/50 rounded-full blur-3xl -z-10"></div>
            <div className="bg-brand-50/80 p-5 rounded-full mb-6 ring-4 ring-white">
              <FaLayerGroup className="w-10 h-10 text-brand-600" />
            </div>
            <h2 className="text-2xl font-bold text-ui-text mb-3">
              No matrices yet
            </h2>
            <p className="text-ui-muted max-w-md mb-8 leading-relaxed">
              Start organizing your day by creating your first time matrix. It
              only takes a minute to set up.
            </p>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-flex items-center gap-2 px-8 py-3 bg-brand-600 text-white rounded-lg font-semibold hover:bg-brand-500 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              <FaPlus /> Create Matrix
            </button>
          </div>
        )}

        {!loading && !isEmpty && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {matrices.map((matrix) => (
              <div
                key={matrix.id}
                onClick={() => navigate(`/dashboard/matrix/${matrix.id}`)}
                className="bg-ui-card rounded-xl shadow-sm border border-ui-border hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group relative overflow-hidden flex flex-col justify-between h-full cursor-pointer"
              >
                <div className="h-1.5 w-full bg-gradient-to-r from-brand-400 to-brand-600"></div>

                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1 pr-2">
                      {editingId === matrix.id ? (
                        <div className="flex items-center gap-2 mb-1">
                          <input
                            type="text"
                            value={editingName}
                            onChange={(e) => setEditingName(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && saveEdit()}
                            className="text-lg font-bold text-ui-text bg-ui-bg border border-brand-500 rounded px-2 py-0.5 w-full focus:outline-none"
                            autoFocus
                          />
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              saveEdit();
                            }}
                            className="text-brand-500 hover:bg-brand-50 p-1 rounded"
                          >
                            <FaCheck />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              cancelEdit();
                            }}
                            className="text-ui-muted hover:text-red-500 hover:bg-red-50 p-1 rounded"
                          >
                            <FaTimes />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-bold text-ui-text leading-tight">
                            {matrix.name}
                          </h3>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              startEdit(matrix);
                            }}
                            className="text-ui-muted hover:text-brand-500 hover:bg-brand-50 p-1.5 rounded-lg transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                            title="Edit Name"
                          >
                            <FaPen className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(matrix.id);
                      }}
                      disabled={deletingId === matrix.id}
                      className="text-ui-muted hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 disabled:opacity-50"
                      title="Delete Matrix"
                    >
                      {deletingId === matrix.id ? (
                        <FaSpinner className="animate-spin w-4 h-4" />
                      ) : (
                        <FaTrash className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  <div className="mt-auto space-y-3">
                    <div className="flex items-center gap-3 text-sm text-ui-muted">
                      <FaCalendarAlt className="text-brand-500 w-4" />
                      <span>Created on {formatDate(matrix.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isEmpty && (
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="fixed bottom-6 right-6 sm:hidden w-14 h-14 bg-brand-600 text-white rounded-full shadow-xl flex items-center justify-center text-xl z-40 hover:bg-brand-500 active:scale-90 transition-all"
        >
          <FaPlus />
        </button>
      )}

      <CreateMatrixModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
};

export default Dashboard;
