import type { IProductRepository } from "../../../domain/repositories/IProductRepository.js";
import type { Product } from "../../../domain/entities/Product.js";
import { AppError } from "../../../shared/errors/AppError.js";

export class GetProductBySlugUseCase {
  constructor(private readonly productRepo: IProductRepository) {}

  async execute(slug: string): Promise<Product> {
    const product = await this.productRepo.findBySlug(slug);
    if (!product) {
      throw new AppError(`Product not found: ${slug}`, 404);
    }
    return product;
  }
}
