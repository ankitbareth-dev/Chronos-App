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

  return (
    <section className="w-full flex flex-col h-full">
      <div className="bg-ui-card rounded-xl border border-ui-border shadow-sm overflow-auto max-h-[600px] w-full">
        <table className="w-full border-collapse-separate border-spacing-[2px] text-[10px]">
          <thead className="sticky top-0 z-20 bg-ui-card shadow-sm">
            <tr className="text-ui-muted font-semibold">
              <th className="sticky left-0 z-30 bg-ui-card p-2 text-left min-w-[70px] border-b border-r border-ui-border">
                <div className="flex flex-col justify-center h-full min-h-[40px]">
                  <span className="font-bold text-ui-text">Date</span>
                </div>
              </th>

              {/* Time Slot Headers with Single Line Ranges */}
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
            {dates.map((date) => (
              <tr key={date.toISOString()} className="group">
                {/* Date Column (Sticky Left) */}
                <td className="sticky left-0 z-10 bg-ui-card p-2 text-ui-text font-bold border-r border-ui-border whitespace-nowrap group-hover:bg-ui-bg transition-colors">
                  <div className="flex items-center h-full min-h-[30px]">
                    {date.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                </td>

                {/* Compact Grid Cells - Rounded like the reference */}
                {timeSlots.map((slot) => (
                  <td
                    key={`${date.toISOString()}-${slot}`}
                    className="p-0.5 text-center hover:bg-brand-50 transition-colors cursor-crosshair align-middle"
                  >
                    <div className="h-8 w-full rounded-md border border-ui-border/20 hover:border-brand-300 hover:shadow-sm hover:scale-[1.05] transition-all bg-white" />
                  </td>
                ))}
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
    </section>
  );
};

export default MatrixGrid;
