import { createSlice } from "@reduxjs/toolkit";
import { createAppAsyncThunk } from "../../app/withTypes";
import { ENV } from "../../config/env";

export interface MatrixData {
  id: string;
  startDate: string; // ISO Date string
  endDate: string; // ISO Date string
  startTime: string; // "HH:mm"
  endTime: string; // "HH:mm"
  interval: number; // Minutes (e.g., 15, 30, 60)
  createdAt: string;
}

interface MatrixDataState {
  data: MatrixData | null;
  loading: boolean;
  error: string | null;
}

const initialState: MatrixDataState = {
  data: null,
  loading: false,
  error: null,
};

export const fetchMatrixData = createAppAsyncThunk<
  MatrixData,
  string,
  { rejectValue: string }
>("matrixData/fetchMatrixData", async (matrixId, { rejectWithValue }) => {
  try {
    const response = await fetch(
      `${ENV.API_BASE_URL}/api/matrix-data/${matrixId}`,
      {
        method: "GET",
        credentials: "include",
      }
    );

    if (!response.ok) throw new Error("Failed to fetch matrix configuration");
    const res = await response.json();
    return res.data; // The backend returns { data: ... }
  } catch (err) {
    return rejectWithValue("Could not load matrix configuration");
  }
});

const matrixDataSlice = createSlice({
  name: "matrixData",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMatrixData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMatrixData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchMatrixData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load";
      });
  },
});

export default matrixDataSlice.reducer;

export const selectMatrixDataState = (state: { matrixData: MatrixDataState }) =>
  state.matrixData;
