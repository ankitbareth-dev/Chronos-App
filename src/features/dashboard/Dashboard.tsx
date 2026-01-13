import { useEffect, useState } from "react";
import {
  FaPlus,
  FaTrash,
  FaLayerGroup,
  FaCalendarAlt,
  FaRegClock,
  FaSpinner,
  FaCheckCircle,
} from "react-icons/fa";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  fetchMatrices,
  deleteMatrix,
  selectMatrixState,
} from "../../features/matrix/matrixSlice";
import CreateMatrixModal from "../matrix/CreateMatrixModal";

const Dashboard = () => {
  const dispatch = useAppDispatch();
  const { matrices, loading, deletingId } = useAppSelector(selectMatrixState);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchMatrices());
  }, [dispatch]);

  const handleDelete = (matrixId: string) => {
    if (window.confirm("Are you sure you want to delete this matrix?")) {
      dispatch(deleteMatrix(matrixId));
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
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-ui-text tracking-tight">
              Dashboard
            </h1>
            <p className="mt-2 text-ui-muted text-base">
              Manage your time matrices and team schedules.
            </p>
          </div>

          {/* Conditionally Render Header Button: Only show if we have data */}
          {!isEmpty && (
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-brand-600 text-white text-sm font-semibold rounded-lg hover:bg-brand-500 transition-all shadow-sm hover:shadow-md active:scale-95"
            >
              <FaPlus className="text-xs" /> New Matrix
            </button>
          )}
        </div>

        {/* --- Loading State --- */}
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

        {/* --- Empty State --- */}
        {isEmpty && (
          <div className="flex flex-col items-center justify-center min-h-[400px] text-center bg-ui-card rounded-2xl border border-ui-border shadow-sm relative overflow-hidden">
            {/* Decorative Background Blur */}
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

        {/* --- Matrix Grid --- */}
        {!loading && !isEmpty && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {matrices.map((matrix) => (
              <div
                key={matrix.id}
                className="bg-ui-card rounded-xl shadow-sm border border-ui-border hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group relative overflow-hidden flex flex-col justify-between h-full"
              >
                {/* Top Accent Bar */}
                <div className="h-1.5 w-full bg-gradient-to-r from-brand-400 to-brand-600"></div>

                <div className="p-6 flex-1 flex flex-col">
                  {/* Header Area */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1 pr-2">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-50 text-green-700 ring-1 ring-green-600/20">
                          <FaCheckCircle className="mr-1 text-[10px]" />
                          Active
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-ui-text leading-tight">
                        {matrix.name}
                      </h3>
                    </div>

                    {/* Delete Action */}
                    <button
                      onClick={() => handleDelete(matrix.id)}
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

                  {/* Details */}
                  <div className="mt-auto space-y-3">
                    <div className="flex items-center gap-3 text-sm text-ui-muted">
                      <FaCalendarAlt className="text-brand-500 w-4" />
                      <span>Created on {formatDate(matrix.createdAt)}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-ui-muted">
                      <FaRegClock className="text-brand-500 w-4" />
                      <span className="font-mono text-xs bg-ui-bg px-2 py-1 rounded border border-ui-border">
                        ID: {matrix.id.slice(0, 8)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Mobile FAB: Only show when empty, otherwise header button exists */}
      {isEmpty && (
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="fixed bottom-6 right-6 sm:hidden w-14 h-14 bg-brand-600 text-white rounded-full shadow-xl flex items-center justify-center text-xl z-40 hover:bg-brand-500 active:scale-90 transition-all"
        >
          <FaPlus />
        </button>
      )}

      {/* Modals */}
      <CreateMatrixModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
};

export default Dashboard;
