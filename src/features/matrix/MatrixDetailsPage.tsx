import { useParams } from "react-router-dom";
import CategoryList from "../categories/CategoryList";

const MatrixDetailsPage = () => {
  const { id } = useParams<{ id: string }>();

  if (!id) return null;

  return (
    <div className="min-h-screen bg-ui-bg pb-20 pt-28 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <CategoryList matrixId={id} />

        <section className="w-full min-h-[400px] bg-ui-card border border-ui-border rounded-xl p-8 flex items-center justify-center text-center text-ui-muted border-dashed">
          <div>
            <div className="text-4xl mb-4 opacity-20">⏳</div>
            <p className="text-lg font-medium">Matrix Grid Area</p>
            <p className="text-sm mt-2">
              This area will render the time slots and tasks.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default MatrixDetailsPage;
