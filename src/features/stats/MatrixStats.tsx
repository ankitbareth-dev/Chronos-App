import { useMemo } from "react";
import { FaChartPie, FaTrophy, FaClock, FaRegSquare } from "react-icons/fa";
import type { Category } from "../categories/categorySlice";

interface Props {
  cellsMap: Map<number, string>;
  categories: Category[];
  totalCellsCount: number;
}

const MatrixStats = ({ cellsMap, categories, totalCellsCount }: Props) => {
  const stats = useMemo(() => {
    let filledCount = 0;
    const categoryCounts: Record<
      string,
      { count: number; name: string; color: string }
    > = {};

    cellsMap.forEach((color) => {
      if (color && color !== "white" && color !== "#ffffff") {
        filledCount++;

        if (!categoryCounts[color]) {
          const cat = categories.find((c) => c.color === color);
          categoryCounts[color] = {
            count: 0,
            name: cat?.name || "Unknown",
            color: color,
          };
        }
        categoryCounts[color].count++;
      }
    });

    const sortedCategories = Object.values(categoryCounts).sort(
      (a, b) => b.count - a.count,
    );
    const topCategory = sortedCategories[0] || null;

    const percentage =
      totalCellsCount > 0
        ? Math.round((filledCount / totalCellsCount) * 100)
        : 0;

    return {
      filledCount,
      remainingCount: totalCellsCount - filledCount,
      percentage,
      topCategory,
      categoryCounts: sortedCategories,
    };
  }, [cellsMap, categories, totalCellsCount]);

  return (
    <section className="w-full bg-ui-card rounded-xl border border-ui-border p-4 sm:p-6 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Completion Card */}
        <div className="bg-ui-bg rounded-lg p-4 border border-ui-border">
          <div className="flex items-center gap-3 mb-2 text-ui-muted">
            <FaChartPie className="text-brand-500" />
            <h3 className="text-xs font-bold uppercase tracking-wider">
              Completion
            </h3>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold text-ui-text">
              {stats.percentage}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-3 overflow-hidden">
            <div
              className="bg-brand-500 h-full transition-all duration-1000"
              style={{ width: `${stats.percentage}%` }}
            />
          </div>
        </div>

        {/* 2. Filled Cells Card */}
        <div className="bg-ui-bg rounded-lg p-4 border border-ui-border">
          <div className="flex items-center gap-3 mb-2 text-ui-muted">
            <FaRegSquare className="text-brand-500" />
            <h3 className="text-xs font-bold uppercase tracking-wider">
              Filled
            </h3>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold text-ui-text">
              {stats.filledCount}
            </span>
            <span className="text-sm text-ui-muted">/ {totalCellsCount}</span>
          </div>
          <p className="text-xs text-ui-muted mt-2">
            {stats.remainingCount} slots remaining
          </p>
        </div>

        {/* 3. Top Category Card */}
        <div className="bg-ui-bg rounded-lg p-4 border border-ui-border flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-2 text-ui-muted">
            <FaTrophy className="text-brand-500" />
            <h3 className="text-xs font-bold uppercase tracking-wider">
              Top Focus
            </h3>
          </div>

          {stats.topCategory ? (
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: stats.topCategory.color }}
                />
                <span className="text-lg font-bold text-ui-text line-clamp-1">
                  {stats.topCategory.name}
                </span>
              </div>
              <p className="text-xs text-ui-muted">
                {stats.topCategory.count} slots assigned
              </p>
            </div>
          ) : (
            <p className="text-sm text-ui-muted italic">No data yet</p>
          )}
        </div>

        {/* 4. Time Analysis (Simple breakdown) */}
        <div className="bg-ui-bg rounded-lg p-4 border border-ui-border">
          <div className="flex items-center gap-3 mb-2 text-ui-muted">
            <FaClock className="text-brand-500" />
            <h3 className="text-xs font-bold uppercase tracking-wider">
              Activity
            </h3>
          </div>
          <div className="flex flex-col gap-2 max-h-[100px] overflow-y-auto pr-1">
            {stats.categoryCounts.length > 0 ? (
              stats.categoryCounts.slice(0, 3).map((cat) => (
                <div key={cat.name} className="flex items-center gap-2">
                  <div
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: cat.color }}
                  />
                  <div className="flex-1">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-ui-text truncate">{cat.name}</span>
                      <span className="font-bold text-ui-text">
                        {cat.count}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${(cat.count / stats.filledCount) * 100}%`,
                          backgroundColor: cat.color,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-ui-muted">No activity recorded.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MatrixStats;
