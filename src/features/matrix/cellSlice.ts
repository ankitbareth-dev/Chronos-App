import { createSlice } from "@reduxjs/toolkit";
import { createAppAsyncThunk } from "../../app/withTypes";
import { ENV } from "../../config/env";

export interface Cell {
  index: number;
  colorHex: string | null;
}

interface CellState {
  items: Cell[];
  loading: boolean;
  saving: boolean; // New: for save loading state
  error: string | null;
}

const initialState: CellState = {
  items: [],
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
    const res = await response.json();
    return res.data;
  } catch (err) {
    return rejectWithValue("Could not load cells");
  }
});

// --- NEW SAVE ACTION ---
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
      body: JSON.stringify({ cells }), // Expects { cells: [...] }
    });
    if (!response.ok) throw new Error("Failed to save cells");
    const res = await response.json();
    return; // Void
  } catch (err) {
    return rejectWithValue("Could not save cells");
  }
});

const cellSlice = createSlice({
  name: "cell",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCells.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCells.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        // Reset saving state when fetching fresh data
        state.saving = false;
      })
      .addCase(fetchCells.rejected, (state) => {
        state.loading = false;
      })
      // Save Cases
      .addCase(saveCells.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(saveCells.fulfilled, (state) => {
        state.saving = false;
      })
      .addCase(saveCells.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload || "Failed to save";
      });
  },
});

export default cellSlice.reducer;

export const selectCellState = (state: { cell: CellState }) => state.cell;
