import { createSlice } from "@reduxjs/toolkit";
import { createAppAsyncThunk } from "../../app/withTypes";
import { ENV } from "../../config/env";

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
}

interface ProfileState {
  loading: boolean;
  error: string | null;
  successMessage: string | null;
}

const initialState: ProfileState = {
  loading: false,
  error: null,
  successMessage: null,
};

export const updateProfile = createAppAsyncThunk<
  User,
  FormData,
  { rejectValue: string }
>("profile/updateProfile", async (formData, { rejectWithValue }) => {
  try {
    const response = await fetch(`${ENV.API_BASE_URL}/api/profile/me`, {
      method: "PATCH",
      credentials: "include",
      body: formData,
    });

    if (!response.ok) {
      const errorData: unknown = await response.json().catch(() => null);

      if (
        typeof errorData === "object" &&
        errorData !== null &&
        "errors" in errorData
      ) {
        const errors = errorData.errors as Record<string, string>;

        const firstError = Object.values(errors)[0] || "Validation failed";
        return rejectWithValue(firstError);
      }

      if (
        typeof errorData === "object" &&
        errorData !== null &&
        "message" in errorData
      ) {
        return rejectWithValue((errorData as { message: string }).message);
      }

      return rejectWithValue("Failed to update profile");
    }

    const data = await response.json();
    return data.data;
  } catch (err) {
    return rejectWithValue("Network error. Please try again.");
  }
});

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = "Profile updated successfully!";
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "An unknown error occurred";
      });
  },
});

export const { clearError, clearSuccess } = profileSlice.actions;
export default profileSlice.reducer;
