import { createSlice } from "@reduxjs/toolkit";
import { createAppAsyncThunk } from "../../app/withTypes";
import { ENV } from "../../config/env";

export interface Cell {
  index: number;
  colorHex: string;
}

interface CellState {
  cells: Cell[];
  loading: boolean;
  saving: boolean;
  error: string | null;
}

const initialState: CellState = {
  cells: [],
  loading: false,
  saving: false,
  error: null,
};

export const fetchCells = createAppAsyncThunk<
  Cell[],
  string,
  { rejectValue: string }
>("cell/fetchCells", async (matrixId, { rejectWithValue }) => {
  try {
    const response = await fetch(`${ENV.API_BASE_URL}/api/cell/${matrixId}`, {
      method: "GET",
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to fetch cells");
    const result = await response.json();
    return result.data;
  } catch (err: unknown) {
    if (err instanceof Error) {
      return rejectWithValue(err.message);
    }
    return rejectWithValue("Could not load cells");
  }
});

export const saveCells = createAppAsyncThunk<
  void,
  { matrixId: string; cells: Cell[] },
  { rejectValue: string }
>("cell/saveCells", async ({ matrixId, cells }, { rejectWithValue }) => {
  try {
    const response = await fetch(`${ENV.API_BASE_URL}/api/cell/${matrixId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ cells }),
    });
    if (!response.ok) throw new Error("Failed to save cells");
    const result = await response.json();
    return result.data;
  } catch (err: unknown) {
    if (err instanceof Error) {
      return rejectWithValue(err.message);
    }
    return rejectWithValue("Could not save cells");
  }
});

const cellSlice = createSlice({
  name: "cell",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchCells.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCells.fulfilled, (state, action) => {
        state.loading = false;
        state.cells = action.payload;
      })
      .addCase(fetchCells.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load cells";
      })
      // Save
      .addCase(saveCells.pending, (state) => {
        state.saving = true;
      })
      .addCase(saveCells.fulfilled, (state) => {
        state.saving = false;
      })
      .addCase(saveCells.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload || "Failed to save cells";
      });
  },
});

export default cellSlice.reducer;

export const selectCellState = (state: { cell: CellState }) => state.cell;
