import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";
import { createAppAsyncThunk } from "../../app/withTypes";
import { ENV } from "../../config/env";

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
}

interface AuthApiResponse {
  success: boolean;
  user: {
    id: string;
    name: string;
    email: string;
    avatarUrl: string;
  };
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  initialLoading: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  initialLoading: true,
  loading: false,
  error: null,
};

export const checkAuth = createAppAsyncThunk<
  AuthApiResponse,
  void,
  { rejectValue: string }
>("auth/checkAuth", async (_, { rejectWithValue }) => {
  try {
    const res = await fetch(`${ENV.API_BASE_URL}/api/auth/check-auth`, {
      method: "GET",
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error("Not authenticated");
    }

    const data = await res.json();
    return data;
  } catch (err: unknown) {
    if (err instanceof Error) {
      return rejectWithValue(err.message);
    }
    return rejectWithValue("Unexpected error occurred");
  }
});

export const login = createAppAsyncThunk<User, string, { rejectValue: string }>(
  "auth/login",
  async (idToken, { rejectWithValue }) => {
    try {
      const res = await fetch(`${ENV.API_BASE_URL}/api/auth/google`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ idToken }),
      });

      if (!res.ok) {
        const errorBody: unknown = await res.json().catch(() => null);

        if (
          typeof errorBody === "object" &&
          errorBody !== null &&
          "message" in errorBody &&
          typeof (errorBody as { message: unknown }).message === "string"
        ) {
          return rejectWithValue((errorBody as { message: string }).message);
        }

        return rejectWithValue("Login failed");
      }

      const data: AuthApiResponse = await res.json();

      return {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        avatarUrl: data.user.avatarUrl,
      };
    } catch (err: unknown) {
      if (err instanceof Error) {
        return rejectWithValue(err.message);
      }
      return rejectWithValue("Unexpected error occurred");
    }
  }
);

export const logout = createAppAsyncThunk<void, void, { rejectValue: string }>(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await fetch(`${ENV.API_BASE_URL}/api/auth/logout`, {
        credentials: "include",
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        return rejectWithValue(err.message);
      }
      return rejectWithValue("Logout failed");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(checkAuth.pending, (state) => {
        state.initialLoading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.initialLoading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.initialLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = action.payload ?? "Authentication check failed";
      })
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Login failed";
      })
      .addCase(logout.pending, (state) => {
        state.loading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Logout failed";
      });
  },
});

export const selectAuth = (state: RootState) => state.auth;

export default authSlice.reducer;
