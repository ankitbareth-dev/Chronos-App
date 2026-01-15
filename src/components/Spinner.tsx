import { FaSpinner } from "react-icons/fa";

const Spinner = () => {
  return (
    <div className="h-screen w-screen flex items-center justify-center bg-ui-bg">
      <div className="flex flex-col items-center gap-3">
        <FaSpinner className="text-4xl text-brand-500 animate-spin" />
        <p className="text-ui-muted">Loading...</p>
      </div>
    </div>
  );
};

export default Spinner;
