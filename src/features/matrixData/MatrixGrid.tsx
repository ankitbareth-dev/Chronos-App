import { useEffect } from "react";
import { FaExclamationTriangle } from "react-icons/fa";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  fetchMatrixData,
  selectMatrixDataState,
} from "../../features/matrixData/matrixDataSlice";

interface Props {
  matrixId: string;
}

const MatrixGrid = ({ matrixId }: Props) => {
  const dispatch = useAppDispatch();
  const { data, loading, error } = useAppSelector(selectMatrixDataState);

  useEffect(() => {
    if (matrixId) {
      dispatch(fetchMatrixData(matrixId));
    }
  }, [dispatch, matrixId]);

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

  if (loading) {
    return (
      <div className="w-full bg-ui-card rounded-xl border border-ui-border p-6 shadow-sm animate-pulse min-h-[400px]" />
    );
  }

  if (error) {
    return (
      <div className="w-full bg-ui-card rounded-xl border border-red-100 p-8 flex flex-col items-center justify-center text-center shadow-sm">
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

  return (
    <section className="w-full bg-ui-card rounded-xl border border-ui-border shadow-sm overflow-hidden flex flex-col">
      {/* Compact Header */}
      <div className="p-3 border-b border-ui-border flex justify-between items-center bg-ui-bg/50">
        <h2 className="text-sm font-bold text-ui-text uppercase tracking-wider">
          Time Matrix
        </h2>
        <div className="text-[10px] text-ui-muted bg-white px-2 py-0.5 rounded border border-ui-border">
          {data.interval} min slots
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-[10px]">
          <thead>
            <tr className="bg-ui-bg border-b border-ui-border text-ui-muted font-semibold">
              {/* Sticky Date Column Header */}
              <th className="sticky left-0 z-10 bg-ui-bg p-2 text-left min-w-[70px] border-r border-ui-border shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                Date
              </th>

              {/* Time Slot Headers with Ranges */}
              {timeSlots.map((slot) => {
                const endSlot = addMinutes(slot, data.interval);
                return (
                  <th
                    key={slot}
                    className="p-1 text-center min-w-[75px] font-medium whitespace-nowrap vertical-top"
                  >
                    <div className="flex flex-col items-center leading-none">
                      <span className="text-xs text-ui-text">{slot}</span>
                      <span className="text-[9px] text-ui-muted font-normal">
                        - {endSlot}
                      </span>
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {dates.map((date) => (
              <tr
                key={date.toISOString()}
                className="border-b border-ui-border/50 hover:bg-brand-50/30 transition-colors group"
              >
                {/* Compact Date Column */}
                <td className="sticky left-0 z-10 bg-ui-card p-2 text-ui-text font-bold border-r border-ui-border whitespace-nowrap group-hover:bg-ui-bg/50 transition-colors">
                  {/* "Jan 17 just it" */}
                  {date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </td>

                {/* Compact Cells */}
                {timeSlots.map((slot) => (
                  <td
                    key={`${date.toISOString()}-${slot}`}
                    className="p-0.5 text-center border-r border-ui-border/50 last:border-r-0 hover:bg-brand-100 transition-colors cursor-crosshair align-middle"
                  >
                    <div className="h-6 w-full max-w-[60px] mx-auto rounded-sm border border-ui-border/30 hover:border-brand-300 hover:bg-brand-50 transition-all" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {dates.length === 0 && (
        <div className="p-8 text-center text-ui-muted text-xs">
          No dates configured for this matrix.
        </div>
      )}
    </section>
  );
};

export default MatrixGrid;
