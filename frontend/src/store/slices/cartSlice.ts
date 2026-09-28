import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axiosInstance";
import type { Cart } from "../../types";

interface CartState {
  cart: Cart | null;
  loading: boolean;
  checkoutLoading: boolean;
  error: string | null;
}

const initialState: CartState = {
  cart: null,
  loading: false,
  checkoutLoading: false,
  error: null,
};

// ── Thunks ────────────────────────────────────────────────

export const fetchCart = createAsyncThunk(
  "cart/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get<{ success: boolean; data: Cart }>("/cart");
      return data.data;
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch cart",
      );
    }
  },
);

export const addToCart = createAsyncThunk(
  "cart/addItem",
  async (
    payload: { productId: string; variantSku: string; quantity: number },
    { rejectWithValue },
  ) => {
    try {
      const { data } = await api.post<{ success: boolean; data: Cart }>(
        "/cart/items",
        payload,
      );
      return data.data;
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      return rejectWithValue(
        error.response?.data?.message || "Failed to add to cart",
      );
    }
  },
);

export const updateCartItem = createAsyncThunk(
  "cart/updateItem",
  async (
    payload: { itemId: string; quantity: number },
    { rejectWithValue },
  ) => {
    try {
      const { data } = await api.patch<{ success: boolean; data: Cart }>(
        `/cart/items/${payload.itemId}`,
        { quantity: payload.quantity },
      );
      return data.data;
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      return rejectWithValue(
        error.response?.data?.message || "Failed to update cart",
      );
    }
  },
);

export const removeCartItem = createAsyncThunk(
  "cart/removeItem",
  async (itemId: string, { rejectWithValue }) => {
    try {
      const { data } = await api.delete<{ success: boolean; data: Cart }>(
        `/cart/items/${itemId}`,
      );
      return data.data;
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      return rejectWithValue(
        error.response?.data?.message || "Failed to remove item",
      );
    }
  },
);

// ── Slice ─────────────────────────────────────────────────

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearCart(state) {
      state.cart = null;
    },
    clearCartError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    const setCart = (state: CartState, action: { payload: Cart }) => {
      state.loading = false;
      state.checkoutLoading = false;
      state.cart = action.payload;
      state.error = null;
    };
    const setError = (state: CartState, action: { payload: unknown }) => {
      state.loading = false;
      state.checkoutLoading = false;
      state.error = action.payload as string;
    };

    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCart.fulfilled, setCart)
      .addCase(fetchCart.rejected, setError)
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(addToCart.fulfilled, setCart)
      .addCase(addToCart.rejected, setError)
      .addCase(updateCartItem.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateCartItem.fulfilled, setCart)
      .addCase(updateCartItem.rejected, setError)
      .addCase(removeCartItem.pending, (state) => {
        state.loading = true;
      })
      .addCase(removeCartItem.fulfilled, setCart)
      .addCase(removeCartItem.rejected, setError);
  },
});

export const { clearCart, clearCartError } = cartSlice.actions;
export default cartSlice.reducer;
