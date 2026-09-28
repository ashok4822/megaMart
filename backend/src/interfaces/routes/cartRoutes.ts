import { Router } from "express";
import type { CartController } from "../controllers/CartController.js";
import { authenticate } from "../middleware/authMiddleware.js";

export function createCartRouter(controller: CartController): Router {
  const router = Router();

  // All cart routes require authentication
  router.use(authenticate);

  // GET /api/cart
  router.get("/", controller.getCart);

  // POST /api/cart/items
  router.post("/items", controller.addItem);

  // PATCH /api/cart/items/:id
  router.patch("/items/:id", controller.updateItem);

  // DELETE /api/cart/items/:id
  router.delete("/items/:id", controller.removeItem);

  return router;
}
