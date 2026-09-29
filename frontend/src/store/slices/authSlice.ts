import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axiosInstance";
import type { User } from "../../types";

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

// Rehydrate user from sessionStorage (lightweight – no token stored client-side)
const storedUser = sessionStorage.getItem("megamart_user");

const initialState: AuthState = {
  user: storedUser ? JSON.parse(storedUser) : null,
  loading: false,
  error: null,
};

// ── Thunks ────────────────────────────────────────────────

export const registerUser = createAsyncThunk(
  "auth/register",
  async (
    payload: { name: string; email: string; password: string },
    { rejectWithValue },
  ) => {
    try {
      // Server sets HttpOnly cookie; response only contains user info
      const { data } = await api.post<{ success: boolean; data: { user: User } }>(
        "/auth/register",
        payload,
      );
      return data.data.user;
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      return rejectWithValue(
        error.response?.data?.message || "Registration failed",
      );
    }
  },
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async (payload: { email: string; password: string }, { rejectWithValue }) => {
    try {
      // Server sets HttpOnly cookie; response only contains user info
      const { data } = await api.post<{ success: boolean; data: { user: User } }>(
        "/auth/login",
        payload,
      );
      return data.data.user;
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  },
);

export const logoutUser = createAsyncThunk("auth/logout", async () => {
  // Ask the server to clear the HttpOnly cookie
  await api.post("/auth/logout");
});

// ── Slice ─────────────────────────────────────────────────

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    const handlePending = (state: AuthState) => {
      state.loading = true;
      state.error = null;
    };
    const handleRejected = (state: AuthState, action: { payload: unknown }) => {
      state.loading = false;
      state.error = action.payload as string;
    };

    builder
      // Register
      .addCase(registerUser.pending, handlePending)
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        // Only persist non-sensitive user info (no token!)
        sessionStorage.setItem("megamart_user", JSON.stringify(action.payload));
      })
      .addCase(registerUser.rejected, handleRejected)

      // Login
      .addCase(loginUser.pending, handlePending)
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        sessionStorage.setItem("megamart_user", JSON.stringify(action.payload));
      })
      .addCase(loginUser.rejected, handleRejected)

      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        sessionStorage.removeItem("megamart_user");
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
