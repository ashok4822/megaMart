import type { Response, NextFunction } from "express";
import { z } from "zod";
import {
  GetCartUseCase,
  AddToCartUseCase,
  UpdateCartItemUseCase,
  RemoveCartItemUseCase,
} from "../../application/usecases/cart/CartUseCases.js";
import type { AuthenticatedRequest } from "../middleware/authMiddleware.js";

const addItemSchema = z.object({
  productId: z.string().min(1),
  variantSku: z.string().min(1),
  quantity: z.number().int().min(1).default(1),
});

const updateItemSchema = z.object({
  quantity: z.number().int().min(1),
});

export class CartController {
  constructor(
    private readonly getCartUseCase: GetCartUseCase,
    private readonly addToCartUseCase: AddToCartUseCase,
    private readonly updateCartItemUseCase: UpdateCartItemUseCase,
    private readonly removeCartItemUseCase: RemoveCartItemUseCase,
  ) {}

  getCart = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const cart = await this.getCartUseCase.execute(req.user!.userId);
      res.json({ success: true, data: cart });
    } catch (error) {
      next(error);
    }
  };

  addItem = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { productId, variantSku, quantity } = addItemSchema.parse(req.body);
      const cart = await this.addToCartUseCase.execute(
        req.user!.userId,
        productId,
        variantSku,
        quantity,
      );
      res.status(201).json({ success: true, data: cart });
    } catch (error) {
      next(error);
    }
  };

  updateItem = async (
    req: AuthenticatedRequest<{ id: string }>,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { quantity } = updateItemSchema.parse(req.body);
      const cart = await this.updateCartItemUseCase.execute(
        req.user!.userId,
        req.params.id,
        quantity,
      );
      res.json({ success: true, data: cart });
    } catch (error) {
      next(error);
    }
  };

  removeItem = async (
    req: AuthenticatedRequest<{ id: string }>,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const cart = await this.removeCartItemUseCase.execute(
        req.user!.userId,
        req.params.id,
      );
      res.json({ success: true, data: cart });
    } catch (error) {
      next(error);
    }
  };
}
