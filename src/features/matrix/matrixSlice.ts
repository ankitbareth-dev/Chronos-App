import { createSlice } from "@reduxjs/toolkit";
import { createAppAsyncThunk } from "../../app/withTypes";
import { ENV } from "../../config/env";

export interface Matrix {
  id: string;
  name: string;
  createdAt: string;
}

interface MatrixState {
  matrices: Matrix[];
  loading: boolean;
  error: string | null;
  deletingId: string | null;
}

const initialState: MatrixState = {
  matrices: [],
  loading: false,
  error: null,
  deletingId: null,
};

// 1. Fetch Matrices
export const fetchMatrices = createAppAsyncThunk<Matrix[]>(
  "matrix/fetchMatrices",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${ENV.API_BASE_URL}/api/matrix`, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) throw new Error("Failed to fetch matrices");

      const data = await response.json();
      return data.data;
    } catch (err) {
      return rejectWithValue("Could not load matrices");
    }
  }
);

// 2. Create Matrix
// Note: We accept generic object here, the specific typing is handled by the Modal
export const createMatrix = createAppAsyncThunk<
  Matrix,
  any,
  { rejectValue: string }
>("matrix/createMatrix", async (matrixData, { rejectWithValue }) => {
  try {
    const response = await fetch(`${ENV.API_BASE_URL}/api/matrix`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(matrixData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      // Handle validation errors if backend sends them
      if (errorData?.errors) return rejectWithValue("Validation failed");
      throw new Error("Failed to create matrix");
    }

    const data = await response.json();
    return data.data;
  } catch (err) {
    return rejectWithValue("Network error");
  }
});

// 3. Delete Matrix
export const deleteMatrix = createAppAsyncThunk<
  void,
  string,
  { rejectValue: string }
>("matrix/deleteMatrix", async (matrixId, { rejectWithValue }) => {
  try {
    const response = await fetch(`${ENV.API_BASE_URL}/api/matrix/${matrixId}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!response.ok) throw new Error("Failed to delete");

    return;
  } catch (err) {
    return rejectWithValue("Could not delete matrix");
  }
});

const matrixSlice = createSlice({
  name: "matrix",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchMatrices.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMatrices.fulfilled, (state, action) => {
        state.loading = false;
        state.matrices = action.payload;
      })
      .addCase(fetchMatrices.rejected, (state) => {
        state.loading = false;
      })

      // Create
      .addCase(createMatrix.fulfilled, (state, action) => {
        state.matrices.unshift(action.payload); // Add to top of list
      })

      // Delete
      .addCase(deleteMatrix.pending, (state, action) => {
        state.deletingId = action.meta.arg;
      })
      .addCase(deleteMatrix.fulfilled, (state, action) => {
        state.deletingId = null;
        state.matrices = state.matrices.filter((m) => m.id !== action.meta.arg);
      })
      .addCase(deleteMatrix.rejected, (state) => {
        state.deletingId = null;
      });
  },
});

export default matrixSlice.reducer;

export const selectMatrixState = (state: { matrix: MatrixState }) =>
  state.matrix;
