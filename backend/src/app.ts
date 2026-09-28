import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

// Infrastructure
import { MongoProductRepository } from "./infrastructure/repositories/MongoProductRepository.js";
import { MongoUserRepository } from "./infrastructure/repositories/MongoUserRepository.js";
import { MongoCartRepository } from "./infrastructure/repositories/MongoCartRepository.js";
import { MongoOrderRepository } from "./infrastructure/repositories/MongoOrderRepository.js";

// Use Cases
import { GetProductsUseCase } from "./application/usecases/product/GetProductsUseCase.js";
import { GetProductBySlugUseCase } from "./application/usecases/product/GetProductBySlugUseCase.js";
import {
  RegisterUseCase,
  LoginUseCase,
} from "./application/usecases/auth/AuthUseCases.js";
import {
  GetCartUseCase,
  AddToCartUseCase,
  UpdateCartItemUseCase,
  RemoveCartItemUseCase,
} from "./application/usecases/cart/CartUseCases.js";
import { CreateOrderUseCase } from "./application/usecases/order/CreateOrderUseCase.js";

// Controllers
import { ProductController } from "./interfaces/controllers/ProductController.js";
import { AuthController } from "./interfaces/controllers/AuthController.js";
import { CartController } from "./interfaces/controllers/CartController.js";
import { OrderController } from "./interfaces/controllers/OrderController.js";

// Routes
import { createProductRouter } from "./interfaces/routes/productRoutes.js";
import { createAuthRouter } from "./interfaces/routes/authRoutes.js";
import { createCartRouter } from "./interfaces/routes/cartRoutes.js";
import { createOrderRouter } from "./interfaces/routes/orderRoutes.js";

// Middleware
import {
  errorHandler,
  notFound,
} from "./interfaces/middleware/errorMiddleware.js";

export function createApp() {
  // ── Repositories (Infrastructure Layer) ──────────────────
  const productRepo = new MongoProductRepository();
  const userRepo = new MongoUserRepository();
  const cartRepo = new MongoCartRepository();
  const orderRepo = new MongoOrderRepository();

  // ── Use Cases (Application Layer) ────────────────────────
  const getProductsUseCase = new GetProductsUseCase(productRepo);
  const getProductBySlugUseCase = new GetProductBySlugUseCase(productRepo);
  const registerUseCase = new RegisterUseCase(userRepo);
  const loginUseCase = new LoginUseCase(userRepo);
  const getCartUseCase = new GetCartUseCase(cartRepo);
  const addToCartUseCase = new AddToCartUseCase(cartRepo, productRepo);
  const updateCartItemUseCase = new UpdateCartItemUseCase(
    cartRepo,
    productRepo,
  );
  const removeCartItemUseCase = new RemoveCartItemUseCase(cartRepo);
  const createOrderUseCase = new CreateOrderUseCase(
    orderRepo,
    cartRepo,
    productRepo,
  );

  // ── Controllers (Interface Layer) ────────────────────────
  const productController = new ProductController(
    getProductsUseCase,
    getProductBySlugUseCase,
  );
  const authController = new AuthController(registerUseCase, loginUseCase);
  const cartController = new CartController(
    getCartUseCase,
    addToCartUseCase,
    updateCartItemUseCase,
    removeCartItemUseCase,
  );
  const orderController = new OrderController(createOrderUseCase);

  // ── Express App ───────────────────────────────────────────
  const app = express();

  // Security middleware
  app.use(helmet());
  app.use(
    cors({
      origin: process.env.FRONTEND_URL || "http://localhost:5173",
      credentials: true,
    }),
  );

  // Rate limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
  });
  app.use("/api/", limiter);

  // Body parsing
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Logging
  if (process.env.NODE_ENV !== "test") {
    app.use(morgan("dev"));
  }

  // Health check
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // ── Routes ────────────────────────────────────────────────
  app.use("/api/products", createProductRouter(productController));
  app.use("/api/auth", createAuthRouter(authController));
  app.use("/api/cart", createCartRouter(cartController));
  app.use("/api/orders", createOrderRouter(orderController));

  // ── Error Handlers ────────────────────────────────────────
  app.use(notFound);
  app.use(errorHandler);

  return app;
}
