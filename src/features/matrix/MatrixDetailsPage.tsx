import { useParams } from "react-router-dom";

const MatrixDetailsPage = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-xl font-semibold">{id}</div>
    </div>
  );
};

export default MatrixDetailsPage;
