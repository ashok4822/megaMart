import { Router } from "express";
import type { ProductController } from "../controllers/ProductController.js";

export function createProductRouter(controller: ProductController): Router {
  const router = Router();

  // GET /api/products?category=&minPrice=&maxPrice=&sort=&q=&page=&limit=
  router.get("/", controller.getProducts);

  // GET /api/products/:slug
  router.get("/:slug", controller.getProductBySlug);

  return router;
}
