import { createSlice } from "@reduxjs/toolkit";
import { createAppAsyncThunk } from "../../app/withTypes";
import { ENV } from "../../config/env";

export interface MatrixData {
  id: string;
  matrixId: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  interval: number;
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
      },
    );
    if (!response.ok) throw new Error("Failed to fetch matrix data");
    const result = await response.json();
    return result.data;
  } catch (err: unknown) {
    if (err instanceof Error) {
      return rejectWithValue(err.message);
    }
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
        state.error = action.payload || "Failed to load data";
      });
  },
});

export default matrixDataSlice.reducer;

export const selectMatrixDataState = (state: { matrixData: MatrixDataState }) =>
  state.matrixData;
