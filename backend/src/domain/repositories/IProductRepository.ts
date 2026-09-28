import type {
  Product,
  ProductFilters,
  PaginatedProducts,
} from "../entities/Product.js";

export interface IProductRepository {
  findAll(filters: ProductFilters): Promise<PaginatedProducts>;
  findBySlug(slug: string): Promise<Product | null>;
  findById(id: string): Promise<Product | null>;
  create(
    product: Omit<Product, "_id" | "createdAt" | "updatedAt">,
  ): Promise<Product>;
  update(id: string, product: Partial<Product>): Promise<Product | null>;
  delete(id: string): Promise<boolean>;
  decrementStock(
    productId: string,
    variantSku: string,
    quantity: number,
  ): Promise<boolean>;
}
