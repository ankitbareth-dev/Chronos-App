import { FaTag, FaPen, FaTrash, FaSpinner } from "react-icons/fa";

export interface Category {
  id: string;
  name: string;
  color: string;
}

interface CategoryListProps {
  categories: Category[];
  loading: boolean;
  onAdd: () => void;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
  onSelect: (category: Category | null) => void; // NEW
  selectedCategory: Category | null; // NEW
  deletingId: string | null;
  savingId: string | null;
}

const CategoryList = ({
  categories,
  loading,
  onAdd,
  onEdit,
  onDelete,
  onSelect,
  selectedCategory,
  deletingId,
  savingId,
}: CategoryListProps) => {
  const getRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  return (
    <div className="flex flex-col h-full">
      <div className="px-6 py-5 border-b border-ui-border bg-ui-card/50 backdrop-blur-sm sticky top-0 z-10">
        <h2 className="text-base font-bold text-ui-text uppercase tracking-wide flex items-center gap-2">
          <FaTag className="text-brand-600 text-sm" />
          Categories
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
        {loading ? (
          /* ... Loader ... */
          <div className="flex justify-center py-10">
            <div className="w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          categories.map((category) => {
            const isDeleting = deletingId === category.id;
            const isSaving = savingId === category.id;
            const isSelected = selectedCategory?.id === category.id; // NEW CHECK

            const bgStyle = {
              backgroundColor: getRgba(category.color, isSelected ? 0.2 : 0.1),
            }; // Highlight selected
            const textStyle = { color: category.color };
            const borderStyle = {
              borderColor: getRgba(category.color, isSelected ? 0.5 : 0.2),
            }; // Highlight border

            return (
              <div
                key={category.id}
                onClick={() => {
                  // Toggle selection
                  if (isSelected) {
                    onSelect(null);
                  } else {
                    onSelect(category);
                  }
                }}
                className={`group flex items-center justify-between p-3 rounded-lg border hover:shadow-sm transition-all cursor-pointer ${
                  isSelected ? "shadow-md" : ""
                }`}
                style={{ ...bgStyle, ...borderStyle }}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-3 h-3 rounded-full flex-shrink-0 ${
                      isSelected ? "ring-2 ring-offset-1" : ""
                    }`}
                    style={{
                      backgroundColor: category.color,
                      ringColor: category.color,
                    }}
                  />
                  <span
                    className={`text-sm font-medium truncate ${
                      isSelected ? "font-bold" : ""
                    }`}
                    style={textStyle}
                  >
                    {category.name}
                  </span>
                  {isSelected && (
                    <span className="text-[10px] text-brand-600 ml-auto mr-2 animate-pulse">
                      Active
                    </span>
                  )}
                </div>

                {/* Hide edit/delete when actively painting to avoid confusion, or keep them */}
                <div
                  className="flex items-center gap-1 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => onEdit(category)}
                    disabled={isDeleting || isSaving}
                    className="p-1.5 rounded hover:bg-white/50 disabled:cursor-not-allowed"
                    style={textStyle}
                  >
                    <FaPen className="text-xs" />
                  </button>
                  <button
                    onClick={() => onDelete(category)}
                    disabled={isDeleting || isSaving}
                    className="p-1.5 rounded text-red-500 opacity-70 hover:opacity-100 hover:bg-red-100/50 disabled:cursor-not-allowed"
                  >
                    {isDeleting ? (
                      <FaSpinner className="animate-spin text-xs" />
                    ) : (
                      <FaTrash className="text-xs" />
                    )}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="p-4 border-t border-ui-border bg-ui-bg/30">
        <button
          onClick={onAdd}
          disabled={loading || savingId === "creating"}
          className="w-full py-2.5 px-4 bg-white border border-ui-border text-sm font-semibold text-brand-600 rounded-lg hover:bg-brand-50 hover:border-brand-300 hover:shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {savingId === "creating" ? (
            <span className="w-4 h-4 border-2 border-brand-500 border-t-transparent rounded-full animate-spin"></span>
          ) : (
            <span>+ Add Category</span>
          )}
        </button>
      </div>
    </div>
  );
};

export default CategoryList;
