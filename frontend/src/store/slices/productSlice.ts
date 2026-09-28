import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axiosInstance";
import type { PaginatedProducts, ProductFilters, Product } from "../../types";

interface ProductState {
  list: PaginatedProducts;
  detail: Product | null;
  loading: boolean;
  detailLoading: boolean;
  error: string | null;
  filters: ProductFilters;
}

const initialState: ProductState = {
  list: { products: [], total: 0, page: 1, limit: 12, totalPages: 0 },
  detail: null,
  loading: false,
  detailLoading: false,
  error: null,
  filters: { page: 1, limit: 12 },
};

// ── Thunks ────────────────────────────────────────────────

export const fetchProducts = createAsyncThunk(
  "products/fetchAll",
  async (filters: ProductFilters, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      if (filters.category) params.set("category", filters.category);
      if (filters.minPrice !== undefined)
        params.set("minPrice", String(filters.minPrice));
      if (filters.maxPrice !== undefined)
        params.set("maxPrice", String(filters.maxPrice));
      if (filters.sort) params.set("sort", filters.sort);
      if (filters.q) params.set("q", filters.q);
      if (filters.page) params.set("page", String(filters.page));
      if (filters.limit) params.set("limit", String(filters.limit));

      const { data } = await api.get<{
        success: boolean;
        data: PaginatedProducts;
      }>(`/products?${params}`);
      return data.data;
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch products",
      );
    }
  },
);

export const fetchProductBySlug = createAsyncThunk(
  "products/fetchBySlug",
  async (slug: string, { rejectWithValue }) => {
    try {
      const { data } = await api.get<{ success: boolean; data: Product }>(
        `/products/${slug}`,
      );
      return data.data;
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      return rejectWithValue(
        error.response?.data?.message || "Product not found",
      );
    }
  },
);

// ── Slice ─────────────────────────────────────────────────

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setFilters(state, action) {
      state.filters = { ...state.filters, ...action.payload, page: 1 };
    },
    setPage(state, action) {
      state.filters.page = action.payload;
    },
    clearDetail(state) {
      state.detail = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchProductBySlug.pending, (state) => {
        state.detailLoading = true;
        state.error = null;
      })
      .addCase(fetchProductBySlug.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.detail = action.payload;
      })
      .addCase(fetchProductBySlug.rejected, (state, action) => {
        state.detailLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setFilters, setPage, clearDetail } = productSlice.actions;
export default productSlice.reducer;
