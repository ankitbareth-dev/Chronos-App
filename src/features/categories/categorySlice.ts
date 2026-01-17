import { createSlice } from "@reduxjs/toolkit";
import { createAppAsyncThunk } from "../../app/withTypes";
import { ENV } from "../../config/env";

export interface Category {
  id: string;
  name: string;
  color: string;
  matrixId: string;
}

interface CategoryState {
  categories: Category[];
  loading: boolean;
  error: string | null;
  creating: boolean;
}

const initialState: CategoryState = {
  categories: [],
  loading: false,
  error: null,
  creating: false,
};

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
      },
    );
    if (!response.ok) throw new Error("Failed to fetch categories");
    const data = await response.json();
    return data.data;
  } catch (err: unknown) {
    if (err instanceof Error) {
      return rejectWithValue(err.message);
    }
    return rejectWithValue("Could not load categories");
  }
});

export const createCategory = createAppAsyncThunk<
  Category,
  { matrixId: string; name: string; color: string },
  { rejectValue: string }
>(
  "category/createCategory",
  async ({ matrixId, name, color }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${ENV.API_BASE_URL}/api/categories/${matrixId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ name, color }),
        },
      );
      if (!response.ok) throw new Error("Failed to create category");
      const data = await response.json();
      return data.data;
    } catch (err: unknown) {
      if (err instanceof Error) {
        return rejectWithValue(err.message);
      }
      return rejectWithValue("Network error");
    }
  },
);

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
        },
      );
      if (!response.ok) throw new Error("Failed to update category");
      const data = await response.json();
      return data.data;
    } catch (err: unknown) {
      if (err instanceof Error) {
        return rejectWithValue(err.message);
      }
      return rejectWithValue("Could not update category");
    }
  },
);

export const deleteCategory = createAppAsyncThunk<
  { matrixId: string; categoryId: string },
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
        },
      );
      if (!response.ok) throw new Error("Failed to delete category");

      return { matrixId, categoryId };
    } catch (err: unknown) {
      if (err instanceof Error) {
        return rejectWithValue(err.message);
      }
      return rejectWithValue("Could not delete category");
    }
  },
);

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state) => {
        state.loading = false;
      })

      .addCase(createCategory.pending, (state) => {
        state.creating = true;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.creating = false;
        state.categories.push(action.payload);
      })
      .addCase(createCategory.rejected, (state) => {
        state.creating = false;
      })

      .addCase(updateCategory.fulfilled, (state, action) => {
        const index = state.categories.findIndex(
          (c) => c.id === action.payload.id,
        );
        if (index !== -1) {
          state.categories[index] = action.payload;
        }
      })

      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.categories = state.categories.filter(
          (c) => c.id !== action.payload.categoryId,
        );
      });
  },
});

export default categorySlice.reducer;

export const selectCategoryState = (state: { category: CategoryState }) =>
  state.category;
