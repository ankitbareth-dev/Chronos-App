import { createSlice } from "@reduxjs/toolkit";
import { createAppAsyncThunk } from "../../app/withTypes";
import { ENV } from "../../config/env";

export interface Category {
  id: string;
  name: string;
  color: string; // Added color
  matrixId: string;
}

interface CategoryState {
  items: Category[];
  loading: boolean;
  error: string | null;
  deletingId: string | null;
  savingId: string | null;
}

const initialState: CategoryState = {
  items: [],
  loading: false,
  error: null,
  deletingId: null,
  savingId: null,
};

// --- CREATE ---
// POST /api/categories/:matrixId
export const createCategory = createAppAsyncThunk<
  Category,
  { name: string; color: string; matrixId: string },
  { rejectValue: string }
>(
  "category/createCategory",
  async ({ name, color, matrixId }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${ENV.API_BASE_URL}/api/categories/${matrixId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ name, color }),
        }
      );
      if (!response.ok) throw new Error("Failed to create category");
      const data = await response.json();
      return data.data;
    } catch (err) {
      return rejectWithValue("Could not create category");
    }
  }
);

// --- EDIT ---
// PUT /api/categories/:matrixId/:categoryId
export const updateCategory = createAppAsyncThunk<
  Category,
  { matrixId: string; categoryId: string; name: string; color: string },
  { rejectValue: string }
>(
  "category/updateCategory",
  async ({ matrixId, categoryId, name, color }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${ENV.API_BASE_URL}/api/categories/${matrixId}/${categoryId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ name, color }),
        }
      );
      if (!response.ok) throw new Error("Failed to update category");
      const data = await response.json();
      return data.data;
    } catch (err) {
      return rejectWithValue("Could not update category");
    }
  }
);

// --- DELETE ---
// DELETE /api/categories/:matrixId/:categoryId
export const deleteCategory = createAppAsyncThunk<
  { categoryId: string }, // Return payload for removal
  { matrixId: string; categoryId: string },
  { rejectValue: string }
>(
  "category/deleteCategory",
  async ({ matrixId, categoryId }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${ENV.API_BASE_URL}/api/categories/${matrixId}/${categoryId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      if (!response.ok) throw new Error("Failed to delete");
      return { categoryId }; // Return ID to remove from state
    } catch (err) {
      return rejectWithValue("Could not delete category");
    }
  }
);

// ... (fetchCategories remains mostly the same, just ensure it handles the 'color' field)

export const fetchCategories = createAppAsyncThunk<
  Category[],
  string,
  { rejectValue: string }
>("category/fetchCategories", async (matrixId, { rejectWithValue }) => {
  try {
    const response = await fetch(
      `${ENV.API_BASE_URL}/api/categories/${matrixId}`,
      {
        method: "GET",
        credentials: "include",
      }
    );
    if (!response.ok) throw new Error("Failed to fetch categories");
    const data = await response.json();
    return data.data;
  } catch (err) {
    return rejectWithValue("Could not load categories");
  }
});

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    clearCategories: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchCategories.rejected, (state) => {
        state.loading = false;
      })
      // Create
      .addCase(createCategory.pending, (state) => {
        state.savingId = "creating";
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.savingId = null;
        state.items.unshift(action.payload);
      })
      .addCase(createCategory.rejected, (state) => {
        state.savingId = null;
      })
      // Update
      .addCase(updateCategory.pending, (state, action) => {
        state.savingId = action.meta.arg.categoryId;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.savingId = null;
        const index = state.items.findIndex((c) => c.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updateCategory.rejected, (state) => {
        state.savingId = null;
      })
      // Delete
      .addCase(deleteCategory.pending, (state, action) => {
        state.deletingId = action.meta.arg.categoryId;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.deletingId = null;
        state.items = state.items.filter(
          (c) => c.id !== action.payload.categoryId
        );
      })
      .addCase(deleteCategory.rejected, (state) => {
        state.deletingId = null;
      });
  },
});

export default categorySlice.reducer;

export const selectCategoryState = (state: { category: CategoryState }) =>
  state.category;
