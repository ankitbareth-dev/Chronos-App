import { useState } from "react";
import { useParams } from "react-router-dom";
import CategoryList from "../categories/CategoryList";
import MatrixGrid from "../matrixData/MatrixGrid";
import type { Category } from "../categories/categorySlice";

const MatrixDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );

  if (!id) return null;

  return (
    <div className="min-h-screen bg-ui-bg pb-20 pt-28 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1800px] mx-auto space-y-6">
        <CategoryList
          matrixId={id}
          activeCategoryId={selectedCategory?.id}
          onSelect={setSelectedCategory}
        />

        <MatrixGrid matrixId={id} selectedCategory={selectedCategory} />
      </div>
    </div>
  );
};

export default MatrixDetailsPage;
