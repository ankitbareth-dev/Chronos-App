import { useState } from "react";
import { FaTimes, FaSpinner, FaExclamationCircle } from "react-icons/fa";
import { useAppDispatch } from "../../app/hooks";
import { createMatrix } from "./matrixSlice";

interface MatrixFormData {
  name: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  interval: number;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const CreateMatrixModal = ({ isOpen, onClose }: Props) => {
  const dispatch = useAppDispatch();

  const [formData, setFormData] = useState<MatrixFormData>({
    name: "",
    startDate: new Date().toISOString().split("T")[0],
    endDate: "",
    startTime: "09:00",
    endTime: "18:00",
    interval: 60,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,

      [name]: name === "interval" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (new Date(formData.endDate) < new Date(formData.startDate)) {
      setError("End date cannot be before start date.");
      setLoading(false);
      return;
    }

    try {
      const resultAction = await dispatch(createMatrix(formData));

      if (createMatrix.rejected.match(resultAction)) {
        const errorMessage = resultAction.payload || "Failed to create matrix.";
        setError(
          typeof errorMessage === "string" ? errorMessage : "Unknown error",
        );
        setLoading(false);
      } else {
        setLoading(false);
        onClose();
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError("An unexpected error occurred.");
      }

      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-ui-card rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up">
        {/* Header */}
        <div className="bg-ui-bg px-6 py-4 border-b border-ui-border flex justify-between items-center">
          <h2 className="text-lg font-bold text-ui-text">Create New Matrix</h2>
          <button
            onClick={onClose}
            disabled={loading}
            className="text-ui-muted hover:text-ui-text transition-colors"
          >
            <FaTimes />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Error Display */}
          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm flex items-start gap-2 border border-red-100">
              <FaExclamationCircle className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-ui-text mb-1">
              Matrix Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-ui-border rounded-lg bg-ui-bg text-ui-text focus:ring-1 focus:ring-brand-500 outline-none"
              placeholder="e.g. Weekly Sprint"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Start Date */}
            <div>
              <label className="block text-sm font-medium text-ui-text mb-1">
                Start Date
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-ui-border rounded-lg bg-ui-bg text-ui-text outline-none"
              />
            </div>

            {/* End Date */}
            <div>
              <label className="block text-sm font-medium text-ui-text mb-1">
                End Date
              </label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-ui-border rounded-lg bg-ui-bg text-ui-text outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Start Time */}
            <div>
              <label className="block text-sm font-medium text-ui-text mb-1">
                Start Time
              </label>
              <input
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-ui-border rounded-lg bg-ui-bg text-ui-text outline-none"
              />
            </div>

            {/* End Time */}
            <div>
              <label className="block text-sm font-medium text-ui-text mb-1">
                End Time
              </label>
              <input
                type="time"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-ui-border rounded-lg bg-ui-bg text-ui-text outline-none"
              />
            </div>
          </div>

          {/* Interval */}
          <div>
            <label className="block text-sm font-medium text-ui-text mb-1">
              Interval (minutes)
            </label>
            <input
              type="number"
              name="interval"
              value={formData.interval}
              onChange={handleChange}
              min="1"
              max="1440"
              required
              className="w-full px-3 py-2 border border-ui-border rounded-lg bg-ui-bg text-ui-text outline-none"
            />
          </div>

          {/* Actions */}
          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 rounded-lg text-sm font-medium text-ui-muted hover:bg-ui-bg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-lg bg-brand-600 text-white text-sm font-medium hover:bg-brand-500 disabled:opacity-70 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin" /> Creating...
                </>
              ) : (
                "Create Matrix"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateMatrixModal;
