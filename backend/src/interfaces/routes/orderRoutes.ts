import { Router } from "express";
import type { OrderController } from "../controllers/OrderController.js";
import { authenticate } from "../middleware/authMiddleware.js";

export function createOrderRouter(controller: OrderController): Router {
  const router = Router();

  // POST /api/orders (protected)
  router.post("/", authenticate, controller.createOrder);

  return router;
}
