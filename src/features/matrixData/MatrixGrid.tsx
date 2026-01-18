import { useEffect, useMemo } from "react";
import {
  FaSpinner,
  FaExclamationTriangle,
  FaSave,
  FaBan,
} from "react-icons/fa";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  fetchMatrixData,
  selectMatrixDataState,
} from "../../features/matrixData/matrixDataSlice";
import {
  fetchCells,
  saveCells,
  selectCellState,
  type Cell,
} from "../cells/cellSlice";
import type { Category } from "../categories/categorySlice";

interface Props {
  matrixId: string;
  selectedCategory: Category | null;
  localEdits: Map<number, string>;
  setLocalEdits: React.Dispatch<React.SetStateAction<Map<number, string>>>;
  hasChanges: boolean;
  setHasChanges: React.Dispatch<React.SetStateAction<boolean>>;
}

const MatrixGrid = ({
  matrixId,
  selectedCategory,
  localEdits,
  setLocalEdits,
  hasChanges,
  setHasChanges,
}: Props) => {
  const dispatch = useAppDispatch();
  const { data, loading, error } = useAppSelector(selectMatrixDataState);
  const {
    cells,
    loading: cellsLoading,
    saving,
  } = useAppSelector(selectCellState);

  const cellsToRender = useMemo(() => {
    const map = new Map<number, string>();

    cells.forEach((c) => map.set(c.index, c.colorHex));

    localEdits.forEach((color, index) => {
      map.set(index, color);
    });
    return map;
  }, [cells, localEdits]);

  useEffect(() => {
    if (matrixId) {
      dispatch(fetchMatrixData(matrixId));
      dispatch(fetchCells(matrixId));
    }
  }, [dispatch, matrixId]);

  const handleCellClick = (index: number) => {
    if (!selectedCategory) return;

    const newMap = new Map(localEdits);

    const currentRenderedColor = cellsToRender.get(index);

    if (currentRenderedColor === selectedCategory.color) {
      newMap.delete(index);

      newMap.set(index, "#ffffff");
    } else {
      newMap.set(index, selectedCategory.color);
    }

    setLocalEdits(newMap);
    setHasChanges(true);
  };

  const handleSave = async () => {
    const cellsToSave: Cell[] = Array.from(localEdits.entries()).map(
      ([index, colorHex]) => ({
        index,
        colorHex,
      }),
    );

    try {
      await dispatch(saveCells({ matrixId, cells: cellsToSave })).unwrap();

      setLocalEdits(new Map());
      setHasChanges(false);

      dispatch(fetchCells(matrixId));
    } catch (err) {
      console.error("Save failed", err);
    }
  };

  const addMinutes = (time: string, minutesToAdd: number): string => {
    const [h, m] = time.split(":").map(Number);
    const date = new Date();
    date.setHours(h, m + minutesToAdd);
    return `${date.getHours().toString().padStart(2, "0")}:${date
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;
  };

  const generateDates = (startStr: string, endStr: string): Date[] => {
    const dates: Date[] = [];
    const current = new Date(startStr);
    const end = new Date(endStr);
    while (current <= end) {
      dates.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    return dates;
  };

  const generateTimeSlots = (
    startStr: string,
    endStr: string,
    intervalMinutes: number,
  ): string[] => {
    const slots: string[] = [];
    const [startH, startM] = startStr.split(":").map(Number);
    const [endH, endM] = endStr.split(":").map(Number);

    let currentMinutes = startH * 60 + startM;
    const endMinutes = endH * 60 + endM;

    while (currentMinutes < endMinutes) {
      const h = Math.floor(currentMinutes / 60);
      const m = currentMinutes % 60;
      const timeStr = `${h.toString().padStart(2, "0")}:${m
        .toString()
        .padStart(2, "0")}`;
      slots.push(timeStr);
      currentMinutes += intervalMinutes;
    }
    return slots;
  };

  if (loading || cellsLoading) {
    return (
      <div className="w-full h-[400px] bg-ui-card rounded-xl border border-ui-border shadow-sm animate-pulse" />
    );
  }

  if (error) {
    return (
      <div className="w-full bg-ui-card rounded-xl border border-red-100 p-8 flex flex-col items-center justify-center text-center shadow-sm h-[400px]">
        <div className="bg-red-50 p-3 rounded-full mb-4">
          <FaExclamationTriangle className="text-red-500 w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-ui-text mb-1">
          Failed to load Matrix
        </h3>
        <p className="text-sm text-ui-muted">{error}</p>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const dates = generateDates(data.startDate, data.endDate);
  const timeSlots = generateTimeSlots(
    data.startTime,
    data.endTime,
    data.interval,
  );

  const isDisabled = !selectedCategory;

  return (
    <section className="w-full flex flex-col h-full">
      <div
        className={`
          bg-ui-card rounded-xl border border-ui-border shadow-sm overflow-hidden 
          transition-all duration-300 relative
          ${isDisabled ? "opacity-40 blur-[0.5px] pointer-events-none" : "opacity-100"}
        `}
      >
        <div className="p-3 border-b border-ui-border flex justify-between items-center bg-ui-bg/50 shrink-0">
          <h2 className="text-sm font-bold text-ui-text uppercase tracking-wider">
            Time Matrix
          </h2>
          <div className="text-[10px] text-ui-muted bg-white px-2 py-0.5 rounded border border-ui-border">
            {data.interval} min slots
          </div>
        </div>

        <div className="overflow-auto max-h-[400px] w-full relative">
          <table className="w-full border-collapse-separate border-spacing-[2px] text-[10px]">
            <thead className="sticky top-0 z-20 bg-ui-card shadow-sm">
              <tr className="text-ui-muted font-semibold">
                <th className="sticky left-0 z-30 bg-ui-card p-2 text-left min-w-[70px] border-b border-r border-ui-border">
                  <div className="flex flex-col justify-center h-full min-h-[40px]">
                    <span className="font-bold text-ui-text">Date</span>
                  </div>
                </th>

                {timeSlots.map((slot) => {
                  const endSlot = addMinutes(slot, data.interval);
                  return (
                    <th
                      key={slot}
                      className="p-1 text-center min-w-[75px] border-b border-ui-border whitespace-nowrap"
                    >
                      <div className="h-full flex flex-col justify-center min-h-[40px]">
                        <span className="text-[10px] text-ui-text font-medium">
                          {slot} - {endSlot}
                        </span>
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {dates.map((date, rowIndex) => (
                <tr key={date.toISOString()} className="group">
                  <td className="sticky left-0 z-10 bg-ui-card p-2 text-ui-text font-bold border-r border-ui-border whitespace-nowrap group-hover:bg-ui-bg transition-colors">
                    <div className="flex items-center h-full min-h-[30px]">
                      {date.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                  </td>

                  {timeSlots.map((slot, colIndex) => {
                    const cellIndex = rowIndex * timeSlots.length + colIndex;
                    const color = cellsToRender.get(cellIndex);

                    return (
                      <td
                        key={`${date.toISOString()}-${slot}`}
                        className="p-0.5 text-center hover:bg-brand-50/50 transition-colors cursor-crosshair align-middle"
                        onClick={() => handleCellClick(cellIndex)}
                      >
                        <div
                          className="h-8 w-full rounded-md border border-ui-border/20 hover:scale-[1.05] transition-all shadow-sm"
                          style={{
                            backgroundColor:
                              color === "#ffffff" ? "white" : color || "white",
                            borderColor:
                              color && color !== "#ffffff"
                                ? color
                                : "rgba(0,0,0,0.05)",
                          }}
                        />
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>

          {dates.length === 0 && (
            <div className="p-12 text-center text-ui-muted text-sm">
              No dates configured for this matrix.
            </div>
          )}
        </div>

        {/* Sticky Save Button */}
        {hasChanges && (
          <div className="sticky bottom-0 bg-ui-card/95 backdrop-blur border-t border-ui-border p-3 flex justify-end items-center gap-3 z-30 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
            <span className="text-xs text-ui-muted animate-pulse">
              Unsaved changes
            </span>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white text-xs font-bold rounded-lg hover:bg-brand-500 disabled:opacity-70 transition-all"
            >
              {saving ? (
                <>
                  <FaSpinner className="animate-spin" /> Saving...
                </>
              ) : (
                <>
                  <FaSave /> Save Changes
                </>
              )}
            </button>
          </div>
        )}

        {isDisabled && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40">
            <div className="bg-ui-bg/90 backdrop-blur-md px-4 py-3 rounded-xl shadow-2xl border border-ui-border text-center max-w-[90%] sm:max-w-xs">
              <FaBan className="text-brand-500 text-2xl mb-2 mx-auto" />
              <p className="text-sm font-bold text-ui-text mb-1">
                Grid Disabled
              </p>
              <p className="text-xs text-ui-muted leading-snug">
                Select a category above to enable filling
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default MatrixGrid;
