import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";
import { store } from "./store";
import { Header } from "./components/layout/Header";
import { Footer } from "./components/layout/Footer";

// Lazy-loaded pages
const HomePage = lazy(() =>
  import("./pages/home/HomePage").then((m) => ({ default: m.HomePage })),
);
const ProductListPage = lazy(() =>
  import("./pages/products/ProductListPage").then((m) => ({
    default: m.ProductListPage,
  })),
);
const ProductDetailPage = lazy(() =>
  import("./pages/products/ProductDetailPage").then((m) => ({
    default: m.ProductDetailPage,
  })),
);
const CartPage = lazy(() =>
  import("./pages/cart/CartPage").then((m) => ({ default: m.CartPage })),
);
const AuthPage = lazy(() =>
  import("./pages/auth/AuthPage.ts").then((m) => ({ default: m.AuthPage })),
);

const PageLoader: React.FC = () => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "60vh",
    }}
  >
    <div className="spinner" />
  </div>
);

const AppLayout: React.FC = () => (
  <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
    <Header />
    <div style={{ flex: 1 }}>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductListPage />} />
          <Route path="/products/:slug" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/auth/login" element={<AuthPage />} />
          <Route path="/auth/register" element={<AuthPage />} />
          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </div>
    <Footer />
  </div>
);

const App: React.FC = () => (
  <Provider store={store}>
    <BrowserRouter>
      <AppLayout />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            fontFamily: "Inter, sans-serif",
            fontSize: "14px",
            fontWeight: "500",
            borderRadius: "8px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
          },
          success: {
            iconTheme: { primary: "#16A34A", secondary: "#fff" },
          },
          error: {
            iconTheme: { primary: "#DC2626", secondary: "#fff" },
          },
        }}
      />
    </BrowserRouter>
  </Provider>
);

export default App;
