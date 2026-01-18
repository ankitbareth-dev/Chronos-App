// In MatrixDetailsPage.tsx

import { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import CategoryList from "../categories/CategoryList";
import MatrixGrid from "../matrixData/MatrixGrid";
import MatrixStats from "../stats/MatrixStats";
import {
  fetchMatrixData,
  selectMatrixDataState,
} from "../../features/matrixData/matrixDataSlice";
import { fetchCells, selectCellState } from "../cells/cellSlice";
import type { Category } from "../categories/categorySlice";

const MatrixDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();

  const { data, loading } = useAppSelector(selectMatrixDataState);
  const { cells, loading: cellsLoading } = useAppSelector(selectCellState);
  const { categories } = useAppSelector((state) => state.category);

  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );

  const [localEdits, setLocalEdits] = useState(new Map<number, string>());
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchMatrixData(id));
      dispatch(fetchCells(id));
    }
  }, [dispatch, id]);

  const cellsToRender = useMemo(() => {
    const map = new Map<number, string>();
    cells.forEach((c) => map.set(c.index, c.colorHex));
    localEdits.forEach((color, index) => {
      map.set(index, color);
    });
    return map;
  }, [cells, localEdits]);

  const totalCellsCount = useMemo(() => {
    if (!data) return 0;

    const [startH, startM] = data.startTime.split(":").map(Number);
    const [endH, endM] = data.endTime.split(":").map(Number);
    const startMin = startH * 60 + startM;
    const endMin = endH * 60 + endM;
    const slotCount = (endMin - startMin) / data.interval;

    const datesCount =
      Math.ceil(
        (new Date(data.endDate).getTime() -
          new Date(data.startDate).getTime()) /
          (1000 * 60 * 60 * 24),
      ) + 1;

    return Math.floor(datesCount * slotCount);
  }, [data]);

  if (!id) return null;

  return (
    <div className="min-h-screen bg-ui-bg pb-20 pt-28 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1800px] mx-auto space-y-6">
        <CategoryList
          matrixId={id}
          activeCategoryId={selectedCategory?.id}
          onSelect={setSelectedCategory}
        />

        {!loading && !cellsLoading && data && (
          <MatrixStats
            cellsMap={cellsToRender}
            categories={categories}
            totalCellsCount={totalCellsCount}
          />
        )}

        <MatrixGrid
          matrixId={id}
          selectedCategory={selectedCategory}
          localEdits={localEdits}
          setLocalEdits={setLocalEdits}
          hasChanges={hasChanges}
          setHasChanges={setHasChanges}
        />
      </div>
    </div>
  );
};

export default MatrixDetailsPage;
