import type { IProductRepository } from "../../../domain/repositories/IProductRepository.js";
import type {
  PaginatedProducts,
  ProductFilters,
} from "../../../domain/entities/Product.js";

export class GetProductsUseCase {
  constructor(private readonly productRepo: IProductRepository) {}

  async execute(filters: ProductFilters): Promise<PaginatedProducts> {
    // Defaults
    const normalizedFilters: ProductFilters = {
      ...filters,
      page: filters.page && filters.page > 0 ? filters.page : 1,
      limit:
        filters.limit && filters.limit > 0 ? Math.min(filters.limit, 100) : 12,
    };
    return this.productRepo.findAll(normalizedFilters);
  }
}
