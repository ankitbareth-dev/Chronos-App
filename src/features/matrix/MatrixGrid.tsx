import { useMemo } from "react";
import { type MatrixData } from "../matrix/matrixDataSlice";
import { type Cell } from "./cellSlice";

interface MatrixGridProps {
  matrixData: MatrixData;
  cells: Cell[]; // The fetched data
  localCellColors: Record<number, string>; // The working state (unsaved changes)
  selectedCategory: { color: string } | null; // Check if selection exists
  onCellClick: (index: number) => void;
}

const MatrixGrid = ({
  matrixData,
  cells,
  localCellColors,
  selectedCategory,
  onCellClick,
}: MatrixGridProps) => {
  // Generate dates...
  const dates = useMemo(() => {
    const start = new Date(matrixData.startDate);
    const end = new Date(matrixData.endDate);
    const days: Date[] = [];
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      days.push(new Date(d));
    }
    return days;
  }, [matrixData.startDate, matrixData.endDate]);

  // Generate time slots...
  const timeSlots = useMemo(() => {
    const slots: string[] = [];
    const [startHour, startMin] = matrixData.startTime.split(":").map(Number);
    const [endHour, endMin] = matrixData.endTime.split(":").map(Number);
    const interval = matrixData.interval;
    let currentMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;
    while (currentMinutes < endMinutes) {
      const h = Math.floor(currentMinutes / 60);
      const m = currentMinutes % 60;
      slots.push(
        `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`
      );
      currentMinutes += interval;
    }
    return slots;
  }, [matrixData.startTime, matrixData.endTime, matrixData.interval]);

  // Get Color: Priority -> Local Changes > Fetched Data > Default White
  const getCellColor = (rowIndex: number, colIndex: number) => {
    const totalColumns = dates.length;
    const index = rowIndex * totalColumns + colIndex;

    if (localCellColors[index] !== undefined) {
      return localCellColors[index];
    }

    const cellData = cells.find((c) => c.index === index);
    return cellData?.colorHex || "#ffffff";
  };

  const formatDateHeader = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      weekday: "short",
    });
  };

  // VISUAL STATE: If no category selected, look "light"
  const gridOpacityClass = selectedCategory
    ? "opacity-100"
    : "opacity-50 grayscale-[30%] pointer-events-none";

  return (
    <div className="h-full flex flex-col bg-ui-card border border-ui-border rounded-xl shadow-sm overflow-hidden transition-all duration-300">
      {/* --- Header Row (Dates) --- */}
      <div
        className={`flex border-b border-ui-border bg-ui-bg/80 backdrop-blur z-10 shrink-0 ${gridOpacityClass}`}
      >
        {/* ... Header Content ... */}
        <div className="w-16 min-w-[4rem] flex-shrink-0 border-r border-ui-border p-2 text-center bg-ui-bg">
          <span className="text-[10px] font-bold text-ui-muted uppercase tracking-wider">
            Time
          </span>
        </div>
        <div className="flex-1 overflow-x-auto">
          <div className="flex" style={{ minWidth: `${dates.length * 70}px` }}>
            {dates.map((date, idx) => (
              <div
                key={date.toISOString()}
                className={`flex-1 text-center p-2 border-r border-ui-border/50 text-xs font-medium text-ui-text truncate ${
                  idx === 0 ? "bg-brand-50/50" : ""
                }`}
              >
                {formatDateHeader(date)}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- Grid Body --- */}
      <div className="flex-1 overflow-y-auto overflow-x-auto custom-scrollbar relative">
        <div
          className="flex flex-col"
          style={{ minWidth: `${dates.length * 70 + 64}px` }}
        >
          {timeSlots.map((time, rowIndex) => (
            <div
              key={time}
              className={`flex border-b border-ui-border/40 last:border-0 hover:bg-ui-bg/40 transition-colors ${gridOpacityClass}`}
            >
              <div className="w-16 min-w-[4rem] flex-shrink-0 border-r border-ui-border p-2 flex items-center justify-center bg-ui-bg/50 sticky left-0 z-10">
                <span className="text-[10px] font-medium text-ui-text">
                  {time}
                </span>
              </div>

              <div className="flex flex-1">
                {dates.map((date, colIndex) => {
                  const index = rowIndex * dates.length + colIndex;
                  const bgColor = getCellColor(rowIndex, colIndex);

                  return (
                    <div
                      key={`${date.toISOString()}-${time}`}
                      onClick={() => onCellClick(index)} // NEW: Click Handler
                      className="flex-1 min-w-[70px] h-10 border-r border-ui-border/30 hover:border-brand-300 hover:bg-brand-50/50 transition-all cursor-pointer group relative"
                      style={{ backgroundColor: bgColor }}
                    >
                      <div className="absolute inset-0 bg-brand-500/0 group-hover:bg-brand-500/5 transition-colors pointer-events-none"></div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MatrixGrid;
