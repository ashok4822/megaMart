// ============================================================
// TYPE DEFINITIONS - Shared between frontend layers
// ============================================================

export interface ProductVariant {
  _id?: string;
  sku: string;
  size?: string;
  colour?: string;
  price: number;
  stock: number;
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  images: string[];
  category: string;
  brand?: string;
  variants: ProductVariant[];
  tags: string[];
  createdAt?: string;
}

export interface PaginatedProducts {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: "price_asc" | "price_desc" | "newest" | "name_asc";
  q?: string;
  page?: number;
  limit?: number;
}

// ── User / Auth ─────────────────────────────────────────────

export interface User {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin";
}

export interface AuthTokens {
  token: string;
  user: User;
}

// ── Cart ────────────────────────────────────────────────────

export interface CartItem {
  _id: string;
  product: string;
  variantSku: string;
  quantity: number;
  priceAtAdd: number;
  productSnapshot: {
    name: string;
    image: string;
    slug: string;
  };
}

export interface Cart {
  _id?: string;
  user: string;
  items: CartItem[];
  subtotal: number;
  itemCount: number;
}

// ── Order ───────────────────────────────────────────────────

export interface ShippingAddress {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
}

export interface Order {
  _id: string;
  user: string;
  items: Array<{
    product: string;
    variantSku: string;
    quantity: number;
    price: number;
    productSnapshot: { name: string; image: string; slug: string };
  }>;
  shippingAddress: ShippingAddress;
  total: number;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  createdAt: string;
}

// ── API Response ─────────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}
