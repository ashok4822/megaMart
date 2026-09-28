import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice.ts";
import productReducer from "./slices/productSlice.ts";
import cartReducer from "./slices/cartSlice.ts";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer,
    cart: cartReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
