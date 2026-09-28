import { Router } from "express";
import type { AuthController } from "../controllers/AuthController.ts";

export function createAuthRouter(controller: AuthController): Router {
  const router = Router();

  // POST /api/auth/register
  router.post("/register", controller.register);

  // POST /api/auth/login
  router.post("/login", controller.login);

  return router;
}
