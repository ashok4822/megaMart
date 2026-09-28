export interface ProductVarient {
  _id?: string;
  sku: string;
  size?: string;
  colour?: string;
  price: number;
  stock: number;
}

export interface Product {
  _id?: string;
  name: string;
  slug: string;
  description: string;
  images: string[];
  category: string;
  brand?: string;
  variants: ProductVarient[];
  tags: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export type SortOrder = "price_asc" | "price_desc" | "newest" | "name_asc";

export interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: SortOrder;
  q?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedProducts {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
