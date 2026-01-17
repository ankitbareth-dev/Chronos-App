import { useParams } from "react-router-dom";
import CategoryList from "../categories/CategoryList";
import MatrixGrid from "../matrixData/MatrixGrid";

const MatrixDetailsPage = () => {
  const { id } = useParams<{ id: string }>();

  if (!id) return null;

  return (
    <div className="min-h-screen bg-ui-bg pb-20 pt-28 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <CategoryList matrixId={id} />

        <MatrixGrid matrixId={id} />
      </div>
    </div>
  );
};

export default MatrixDetailsPage;
