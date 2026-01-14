import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaLayerGroup, FaCheck, FaSpinner } from "react-icons/fa";
import { IoArrowBack as BackIcon } from "react-icons/io5";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  selectCategoryState,
} from "../categories/categorySlice";
import {
  fetchMatrixData,
  selectMatrixDataState,
} from "../../features/matrix/matrixDataSlice";
import {
  fetchCells,
  saveCells,
  selectCellState,
} from "../../features/matrix/cellSlice";
import CategoryList from "../categories/CategoryList";
import CategoryFormModal from "../categories/CategoryFormModal";
import DeleteCategoryModal from "../categories/DeleteCategoryModal";
import MatrixGrid from "./MatrixGrid";

const MatrixDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();

  // Redux Selectors
  const {
    items: categories,
    loading: categoriesLoading,
    deletingId,
    savingId,
  } = useAppSelector(selectCategoryState);
  const { data: matrixData, loading: matrixDataLoading } = useAppSelector(
    selectMatrixDataState
  );
  const {
    items: fetchedCells,
    loading: cellsLoading,
    saving: isSavingCells,
  } = useAppSelector(selectCellState);

  // Local States
  const [selectedCategory, setSelectedCategory] = useState<{
    id: string;
    name: string;
    color: string;
  } | null>(null);
  const [localCellColors, setLocalCellColors] = useState<
    Record<number, string>
  >({}); // Unsaved changes
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCategoryForModal, setSelectedCategoryForModal] = useState<{
    id: string;
    name: string;
    color: string;
  } | null>(null);

  // 1. Fetch Data on Mount
  useEffect(() => {
    if (id) {
      dispatch(fetchCategories(id));
      dispatch(fetchMatrixData(id));
      dispatch(fetchCells(id));
    }
  }, [id, dispatch]);

  // 2. Sync Local State when Fetched Data changes (After save or mount)
  useEffect(() => {
    // Convert array of { index, colorHex } to Map { index: colorHex }
    const newMap: Record<number, string> = {};
    fetchedCells.forEach((c) => {
      newMap[c.index] = c.colorHex || "#ffffff";
    });
    setLocalCellColors(newMap);
    setHasUnsavedChanges(false); // Reset change flag
  }, [fetchedCells]);

  // 3. Handle Cell Click
  const handleCellClick = (index: number) => {
    if (!selectedCategory) return;

    // Logic: Toggle. If current cell matches selected color -> Clear (White).
    // Else -> Set to selected color.
    const currentColor = localCellColors[index] || "#ffffff";
    const newColor =
      currentColor === selectedCategory.color
        ? "#ffffff"
        : selectedCategory.color;

    setLocalCellColors((prev) => ({ ...prev, [index]: newColor }));
    setHasUnsavedChanges(true);
  };

  // 4. Handle Save
  const handleSave = async () => {
    if (!id || !hasUnsavedChanges) return;

    // Convert local map back to array for API
    const cellsPayload = Object.entries(localCellColors).map(
      ([index, colorHex]) => ({
        index: parseInt(index, 10),
        colorHex: colorHex === "#ffffff" ? null : colorHex, // Send null for white to clear
      })
    );

    const result = await dispatch(
      saveCells({ matrixId: id, cells: cellsPayload })
    );

    if (saveCells.fulfilled.match(result)) {
      // Refetch cells to ensure sync
      dispatch(fetchCells(id));
      setHasUnsavedChanges(false);
    }
  };

  // Modal Handlers (Existing)
  const handleCreateSubmit = async ({
    name,
    color,
  }: {
    name: string;
    color: string;
  }) => {
    if (!id) return;
    const result = await dispatch(
      createCategory({ name, color, matrixId: id })
    );
    if (createCategory.fulfilled.match(result)) setIsAddModalOpen(false);
  };
  const handleEditSubmit = async ({
    name,
    color,
  }: {
    name: string;
    color: string;
  }) => {
    if (!selectedCategoryForModal || !id) return;
    const result = await dispatch(
      updateCategory({
        matrixId: id,
        categoryId: selectedCategoryForModal.id,
        name,
        color,
      })
    );
    if (updateCategory.fulfilled.match(result)) {
      setIsEditModalOpen(false);
      setSelectedCategoryForModal(null);
    }
  };
  const handleDeleteConfirm = async () => {
    if (!selectedCategoryForModal || !id) return;
    const result = await dispatch(
      deleteCategory({ matrixId: id, categoryId: selectedCategoryForModal.id })
    );
    if (deleteCategory.fulfilled.match(result)) {
      setIsDeleteModalOpen(false);
      setSelectedCategoryForModal(null);
    }
  };

  // Category Handlers
  const handleAddClick = () => setIsAddModalOpen(true);
  const handleEditClick = (category: any) => {
    setSelectedCategoryForModal(category);
    setIsEditModalOpen(true);
  };
  const handleDeleteClick = (category: any) => {
    setSelectedCategoryForModal(category);
    setIsDeleteModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-ui-bg pb-20 pt-28 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT COLUMN: Categories */}
          <div className="lg:col-span-4 xl:col-span-3">
            <div className="bg-ui-card border border-ui-border rounded-xl shadow-sm overflow-hidden sticky top-28 h-[calc(100vh-9rem)] flex flex-col">
              <CategoryList
                categories={categories}
                loading={categoriesLoading}
                onAdd={handleAddClick}
                onEdit={handleEditClick}
                onDelete={handleDeleteClick}
                onSelect={setSelectedCategory} // Pass selection handler
                selectedCategory={selectedCategory} // Pass current selection
                deletingId={deletingId}
                savingId={savingId}
              />
            </div>
          </div>

          {/* RIGHT COLUMN: Matrix Grid */}
          <div className="lg:col-span-8 xl:col-span-9">
            <div className="min-h-[500px] relative">
              {/* Loading State */}
              {(matrixDataLoading || cellsLoading) && (
                <div className="h-[500px] bg-ui-card rounded-xl border border-ui-border flex flex-col items-center justify-center text-ui-muted gap-3 z-50 relative">
                  <FaSpinner className="animate-spin text-3xl text-brand-500" />
                  <span>Initializing Matrix...</span>
                </div>
              )}

              {/* Render Grid */}
              {matrixData && !cellsLoading && (
                <>
                  <MatrixGrid
                    matrixData={matrixData}
                    cells={fetchedCells}
                    localCellColors={localCellColors}
                    selectedCategory={selectedCategory}
                    onCellClick={handleCellClick}
                  />

                  {/* --- FLOATING SAVE BUTTON --- */}
                  {hasUnsavedChanges && (
                    <div className="absolute bottom-8 right-8 animate-in fade-in zoom-in duration-300">
                      <button
                        onClick={handleSave}
                        disabled={isSavingCells}
                        className="bg-brand-600 hover:bg-brand-500 text-white px-6 py-3 rounded-full shadow-xl hover:shadow-2xl flex items-center gap-2 font-semibold transition-all transform hover:-translate-y-1 disabled:opacity-70"
                      >
                        {isSavingCells ? (
                          <>
                            <FaSpinner className="animate-spin text-sm" />{" "}
                            Saving...
                          </>
                        ) : (
                          <>
                            <FaCheck /> Save Changes
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <CategoryFormModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleCreateSubmit}
        title="Add New Category"
        isLoading={savingId === "creating"}
      />
      <CategoryFormModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleEditSubmit}
        title="Edit Category"
        initialName={selectedCategoryForModal?.name}
        initialColor={selectedCategoryForModal?.color}
        isLoading={savingId === selectedCategoryForModal?.id}
      />
      <DeleteCategoryModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        categoryName={selectedCategoryForModal?.name || ""}
        isLoading={deletingId === selectedCategoryForModal?.id}
      />
    </div>
  );
};

export default MatrixDetailsPage;
