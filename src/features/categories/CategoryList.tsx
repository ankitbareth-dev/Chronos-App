import { useState, useEffect } from "react";
import {
  FaPlus,
  FaPen,
  FaSpinner,
  FaPalette,
  FaTrash,
  FaExclamationTriangle,
} from "react-icons/fa";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  selectCategoryState,
  type Category,
} from "./categorySlice";
import ModalPortal from "../../components/ModalPortal";
import {
  ToastItem,
  type LocalToast,
  type ToastType,
} from "../../components/Toast";

const PRESET_COLORS = [
  "#0284c7",
  "#059669",
  "#ea580c",
  "#dc2626",
  "#7c3aed",
  "#ca8a04",
  "#475569",
];

interface Props {
  matrixId: string;
  activeCategoryId?: string | null;
  onSelect?: (category: Category | null) => void;
}

const CategoryList = ({ matrixId, activeCategoryId, onSelect }: Props) => {
  const dispatch = useAppDispatch();
  const { categories, loading, error } = useAppSelector(selectCategoryState);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState<Category | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [color, setColor] = useState(PRESET_COLORS[0]);
  const [formError, setFormError] = useState("");

  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [toasts, setToasts] = useState<LocalToast[]>([]);

  const handleCategoryClick = (cat: Category) => {
    if (activeCategoryId === cat.id) {
      onSelect?.(null);
    } else {
      onSelect?.(cat);
    }
  };

  const showToast = (message: string, type: ToastType) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  useEffect(() => {
    if (matrixId) {
      dispatch(fetchCategories(matrixId))
        .unwrap()
        .catch((err) => {
          console.error(err);
        });
    }
  }, [dispatch, matrixId]);

  const openCreateModal = () => {
    setEditingCat(null);
    setName("");
    setColor(PRESET_COLORS[0]);
    setFormError("");
    setIsModalOpen(true);
  };

  const openEditModal = (cat: Category) => {
    setEditingCat(cat);
    setName(cat.name);
    setColor(cat.color);
    setFormError("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCat(null);
    setName("");
    setFormError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setIsSaving(true);

    if (!name.trim()) {
      setFormError("Name is required");
      setIsSaving(false);
      return;
    }

    try {
      if (editingCat) {
        await dispatch(
          updateCategory({
            matrixId,
            categoryId: editingCat.id,
            name,
            color,
          }),
        ).unwrap();
        showToast("Category updated successfully", "success");
      } else {
        await dispatch(
          createCategory({
            matrixId,
            name,
            color,
          }),
        ).unwrap();
        showToast("Category created successfully", "success");
      }

      closeModal();
    } catch (err) {
      const msg = typeof err === "string" ? err : "Operation failed";
      setFormError(msg);
      showToast(msg, "error");
    } finally {
      setIsSaving(false);
    }
  };

  const promptDelete = (cat: Category) => {
    setConfirmDeleteId(cat.id);
  };

  const confirmDelete = async () => {
    if (!confirmDeleteId) return;
    setDeletingId(confirmDeleteId);

    try {
      await dispatch(
        deleteCategory({
          matrixId,
          categoryId: confirmDeleteId,
        }),
      ).unwrap();
      showToast("Category deleted", "success");

      setConfirmDeleteId(null);
    } catch (err) {
      const msg = typeof err === "string" ? err : "Failed to delete";
      showToast(msg, "error");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <section className="w-full bg-ui-card rounded-xl border border-ui-border p-4 sm:p-6 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
      {/* Toast Container */}
      <div className="fixed bottom-6 right-6 z-[60] flex flex-col gap-3 pointer-events-none">
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

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold text-ui-text flex items-center gap-2">
          <FaPalette className="text-brand-500" />
          Categories
        </h2>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-3 py-1.5 bg-brand-50 text-brand-600 hover:bg-brand-100 rounded-lg text-sm font-medium transition-colors"
        >
          <FaPlus className="text-xs" />
          <span className="hidden sm:inline">Add New</span>
        </button>
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="flex gap-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-10 w-24 bg-ui-bg rounded-full animate-pulse"
            />
          ))}
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-100 rounded-lg p-4 flex flex-col items-center text-center">
          <FaExclamationTriangle className="text-red-500 text-2xl mb-2" />
          <h3 className="text-red-700 font-medium mb-1">
            Failed to load categories
          </h3>
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      ) : categories.length === 0 ? (
        <div className="text-center py-8 text-ui-muted text-sm bg-ui-bg/50 rounded-lg border border-dashed border-ui-border">
          No categories defined yet.
        </div>
      ) : (
        <div className="flex flex-wrap gap-3">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => handleCategoryClick(cat)}
              className={`group relative flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all hover:shadow-md cursor-pointer ${
                activeCategoryId === cat.id
                  ? "ring-2 ring-brand-200 border-brand-500"
                  : "border-ui-border/50"
              }`}
              style={{
                backgroundColor: `${cat.color}15`,
                color: cat.color,
                borderColor: cat.color,
              }}
            >
              <span className="truncate max-w-[100px] sm:max-w-[150px]">
                {cat.name}
              </span>

              {/* Action Buttons Container */}
              <div className="flex items-center gap-1 pl-1 border-l border-black/10">
                {/* Edit Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openEditModal(cat);
                  }}
                  className="opacity-60 hover:opacity-100 p-1.5 rounded-full hover:bg-white/20 transition-all"
                  title="Edit Category"
                >
                  <FaPen className="w-3 h-3" />
                </button>

                {/* Delete Button on Item */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    promptDelete(cat);
                  }}
                  disabled={deletingId === cat.id}
                  className="opacity-60 hover:opacity-100 p-1.5 rounded-full hover:bg-red-500 hover:text-white hover:border-red-500 transition-all disabled:opacity-50"
                  title="Delete Category"
                >
                  {deletingId === cat.id ? (
                    <FaSpinner className="animate-spin w-3 h-3" />
                  ) : (
                    <FaTrash className="w-3 h-3" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <ModalPortal>
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-ui-text/20 backdrop-blur-sm"
              onClick={() => !isSaving && closeModal()} // Prevent closing while saving
            ></div>
            <div className="bg-ui-card rounded-xl shadow-2xl border border-ui-border w-full max-w-sm p-6 relative z-10 animate-in fade-in zoom-in duration-200">
              <h3 className="text-lg font-bold text-ui-text mb-4">
                {editingCat ? "Edit Category" : "New Category"}
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                {formError && (
                  <div className="bg-red-50 text-red-600 px-3 py-2 rounded-lg text-xs border border-red-100">
                    {formError}
                  </div>
                )}

                {/* Name Input */}
                <div>
                  <label className="block text-xs font-semibold text-ui-muted mb-1 uppercase tracking-wider">
                    Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={isSaving}
                    className="w-full px-3 py-2 border border-ui-border rounded-lg bg-ui-bg text-ui-text focus:ring-1 focus:ring-brand-500 outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="e.g. Work, Personal"
                    autoFocus
                  />
                </div>

                {/* Color Picker */}
                <div>
                  <label className="block text-xs font-semibold text-ui-muted mb-2 uppercase tracking-wider">
                    Color
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {PRESET_COLORS.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => !isSaving && setColor(c)}
                        disabled={isSaving}
                        className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed ${
                          color === c
                            ? "border-ui-text ring-2 ring-offset-2 ring-brand-200"
                            : "border-transparent"
                        }`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-between pt-4 mt-4 border-t border-ui-border">
                  <div className="flex gap-2 ml-auto">
                    <button
                      type="button"
                      onClick={closeModal}
                      disabled={isSaving}
                      className="px-4 py-2 rounded-lg text-sm font-medium text-ui-muted hover:bg-ui-bg transition-colors disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="px-4 py-2 rounded-lg bg-brand-600 text-white text-sm font-medium hover:bg-brand-500 disabled:opacity-70 flex items-center gap-2"
                    >
                      {isSaving ? (
                        <FaSpinner className="animate-spin w-3 h-3" />
                      ) : (
                        "Save"
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </ModalPortal>
      )}

      {/* Delete Confirmation Modal */}
      {confirmDeleteId && (
        <ModalPortal>
          <div className="fixed inset-0 z-[55] flex items-center justify-center p-4">
            {/* Prevent closing via backdrop while deleting */}
            <div
              className="absolute inset-0 bg-ui-text/20 backdrop-blur-sm"
              onClick={() => !deletingId && setConfirmDeleteId(null)}
            ></div>
            <div className="bg-ui-card rounded-xl shadow-2xl border border-ui-border w-full max-w-sm p-6 relative z-10 animate-in fade-in zoom-in duration-200">
              <div className="flex items-start gap-4">
                <div className="bg-red-50 p-3 rounded-full shrink-0">
                  <FaExclamationTriangle className="text-red-600 w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-ui-text mb-1">
                    Delete Category?
                  </h3>
                  <p className="text-sm text-ui-muted leading-relaxed">
                    Are you sure you want to delete this category? This action
                    cannot be undone.
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => !deletingId && setConfirmDeleteId(null)}
                  disabled={Boolean(deletingId)}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-ui-muted hover:bg-ui-bg hover:text-ui-text transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={Boolean(deletingId)}
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-red-600 text-white hover:bg-red-700 shadow-sm transition-all active:scale-95 flex items-center gap-2 disabled:opacity-70"
                >
                  {deletingId === confirmDeleteId ? (
                    <>
                      <FaSpinner className="animate-spin w-3 h-3" /> Deleting
                    </>
                  ) : (
                    "Delete"
                  )}
                </button>
              </div>
            </div>
          </div>
        </ModalPortal>
      )}
    </section>
  );
};

export default CategoryList;
