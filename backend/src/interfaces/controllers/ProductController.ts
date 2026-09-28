// ============================================================
// INTERFACES LAYER - Product Controller
// ============================================================

import type { Request, Response, NextFunction } from "express";
import { GetProductsUseCase } from "../../application/usecases/product/GetProductsUseCase.js";
import { GetProductBySlugUseCase } from "../../application/usecases/product/GetProductBySlugUseCase.js";
import type {
  ProductFilters,
  SortOrder,
} from "../../domain/entities/Product.js";

export class ProductController {
  constructor(
    private readonly getProductsUseCase: GetProductsUseCase,
    private readonly getProductBySlugUseCase: GetProductBySlugUseCase,
  ) {}

  getProducts = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const filters: ProductFilters = {
        category: req.query.category as string | undefined,
        minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
        maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
        sort: req.query.sort as SortOrder | undefined,
        q: req.query.q as string | undefined,
        page: req.query.page ? Number(req.query.page) : 1,
        limit: req.query.limit ? Number(req.query.limit) : 12,
      };

      const result = await this.getProductsUseCase.execute(filters);

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  getProductBySlug = async (
    req: Request<{ slug: string }>,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const product = await this.getProductBySlugUseCase.execute(
        req.params.slug,
      );
      res.json({ success: true, data: product });
    } catch (error) {
      next(error);
    }
  };
}
