import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  selectCategoryState,
} from "../../features/categories/categorySlice";
import CategoryList from "../categories/CategoryList";
import CategoryFormModal from "../categories/CategoryFormModal";
import DeleteCategoryModal from "../categories/DeleteCategoryModal";

const MatrixDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();

  const {
    items: categories,
    loading,
    deletingId,
    savingId,
  } = useAppSelector(selectCategoryState);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState<{
    id: string;
    name: string;
    color: string;
  } | null>(null);

  useEffect(() => {
    if (id) {
      dispatch(fetchCategories(id));
    }
  }, [id, dispatch]);

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
    if (createCategory.fulfilled.match(result)) {
      setIsAddModalOpen(false);
    } else {
      alert("Failed to create category");
    }
  };

  const handleEditSubmit = async ({
    name,
    color,
  }: {
    name: string;
    color: string;
  }) => {
    if (!selectedCategory || !id) return;
    const result = await dispatch(
      updateCategory({
        matrixId: id,
        categoryId: selectedCategory.id,
        name,
        color,
      })
    );
    if (updateCategory.fulfilled.match(result)) {
      setIsEditModalOpen(false);
      setSelectedCategory(null);
    } else {
      alert("Failed to update category");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedCategory || !id) return;
    const result = await dispatch(
      deleteCategory({
        matrixId: id,
        categoryId: selectedCategory.id,
      })
    );
    if (deleteCategory.fulfilled.match(result)) {
      setIsDeleteModalOpen(false);
      setSelectedCategory(null);
    } else {
      alert("Failed to delete category");
    }
  };

  // Navigation handlers
  const handleAddClick = () => setIsAddModalOpen(true);
  const handleEditClick = (category: {
    id: string;
    name: string;
    color: string;
  }) => {
    setSelectedCategory(category);
    setIsEditModalOpen(true);
  };
  const handleDeleteClick = (category: {
    id: string;
    name: string;
    color: string;
  }) => {
    setSelectedCategory(category);
    setIsDeleteModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-ui-bg pb-20 pt-28 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header */}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT COLUMN */}
          <div className="lg:col-span-4 xl:col-span-3">
            <div className="bg-ui-card border border-ui-border rounded-xl shadow-sm overflow-hidden sticky top-28 h-[calc(100vh-9rem)] flex flex-col">
              <CategoryList
                categories={categories}
                loading={loading}
                onAdd={handleAddClick}
                onEdit={handleEditClick}
                onDelete={handleDeleteClick}
                deletingId={deletingId}
                savingId={savingId}
              />
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="lg:col-span-8 xl:col-span-9">
            <div className="bg-ui-card border border-ui-border rounded-xl p-8 text-center text-ui-muted">
              Workspace Content Area
            </div>
          </div>
        </div>
      </div>

      {/* MODALS */}
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
        initialName={selectedCategory?.name}
        initialColor={selectedCategory?.color}
        isLoading={savingId === selectedCategory?.id}
      />

      <DeleteCategoryModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        categoryName={selectedCategory?.name || ""}
        isLoading={deletingId === selectedCategory?.id}
      />
    </div>
  );
};

export default MatrixDetailsPage;
