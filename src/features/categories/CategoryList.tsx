import { useState, useEffect } from "react";
import { FaPlus, FaPen, FaSpinner, FaPalette } from "react-icons/fa";
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
}

const CategoryList = ({ matrixId }: Props) => {
  const dispatch = useAppDispatch();
  const { categories, loading, creating } = useAppSelector(selectCategoryState);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState<Category | null>(null);

  const [name, setName] = useState("");
  const [color, setColor] = useState(PRESET_COLORS[0]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (matrixId) {
      dispatch(fetchCategories(matrixId));
    }
  }, [dispatch, matrixId]);

  const openCreateModal = () => {
    setEditingCat(null);
    setName("");
    setColor(PRESET_COLORS[0]);
    setError("");
    setIsModalOpen(true);
  };

  const openEditModal = (cat: Category) => {
    setEditingCat(cat);
    setName(cat.name);
    setColor(cat.color);
    setError("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCat(null);
    setName("");
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Name is required");
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
      } else {
        await dispatch(
          createCategory({
            matrixId,
            name,
            color,
          }),
        ).unwrap();
      }
      closeModal();
    } catch (err) {
      setError(typeof err === "string" ? err : "Operation failed");
    }
  };

  const handleDelete = async () => {
    if (!editingCat) return;
    try {
      await dispatch(
        deleteCategory({
          matrixId,
          categoryId: editingCat.id,
        }),
      ).unwrap();
      closeModal();
    } catch (err) {
      setError(typeof err === "string" ? err : "Failed to delete");
    }
  };

  return (
    <section className="w-full bg-ui-card rounded-xl border border-ui-border p-4 sm:p-6 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
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

      {/* Categories Grid/Chips */}
      {loading ? (
        <div className="flex gap-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-10 w-24 bg-ui-bg rounded-full animate-pulse"
            />
          ))}
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
              className="group relative flex items-center gap-2 px-4 py-2 rounded-full border border-ui-border/50 text-sm font-medium transition-all hover:shadow-md hover:-translate-y-0.5"
              style={{
                backgroundColor: `${cat.color}15`, // 15 is opacity in hex
                color: cat.color,
                borderColor: cat.color,
              }}
            >
              <span className="truncate max-w-[100px] sm:max-w-[150px]">
                {cat.name}
              </span>

              {/* Edit Button - Visible on hover or always accessible */}
              <button
                onClick={() => openEditModal(cat)}
                className="opacity-60 hover:opacity-100 p-1 rounded-full hover:bg-white/20 transition-all"
                title="Edit Category"
              >
                <FaPen className="w-3 h-3" />
              </button>
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
              onClick={closeModal}
            ></div>
            <div className="bg-ui-card rounded-xl shadow-2xl border border-ui-border w-full max-w-sm p-6 relative z-10 animate-in fade-in zoom-in duration-200">
              <h3 className="text-lg font-bold text-ui-text mb-4">
                {editingCat ? "Edit Category" : "New Category"}
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="bg-red-50 text-red-600 px-3 py-2 rounded-lg text-xs border border-red-100">
                    {error}
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
                    className="w-full px-3 py-2 border border-ui-border rounded-lg bg-ui-bg text-ui-text focus:ring-1 focus:ring-brand-500 outline-none"
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
                        onClick={() => setColor(c)}
                        className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${
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
                  {editingCat && (
                    <button
                      type="button"
                      onClick={handleDelete}
                      className="text-red-500 hover:text-red-600 text-sm font-medium px-3 py-2"
                    >
                      Delete
                    </button>
                  )}

                  <div className="flex gap-2 ml-auto">
                    <button
                      type="button"
                      onClick={closeModal}
                      disabled={creating}
                      className="px-4 py-2 rounded-lg text-sm font-medium text-ui-muted hover:bg-ui-bg transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={creating}
                      className="px-4 py-2 rounded-lg bg-brand-600 text-white text-sm font-medium hover:bg-brand-500 disabled:opacity-70 flex items-center gap-2"
                    >
                      {creating ? (
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
    </section>
  );
};

export default CategoryList;
