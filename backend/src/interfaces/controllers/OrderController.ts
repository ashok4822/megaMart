import type { Response, NextFunction } from "express";
import { z } from "zod";
import { CreateOrderUseCase } from "../../application/usecases/order/CreateOrderUseCase.js";
import type { AuthenticatedRequest } from "../middleware/authMiddleware.js";

const shippingAddressSchema = z.object({
  fullName: z.string().min(2),
  phone: z.string().min(10),
  addressLine1: z.string().min(5),
  addressLine2: z.string().optional(),
  city: z.string().min(2),
  state: z.string().min(2),
  pincode: z.string().regex(/^\d{6}$/, "Pincode must be 6 digits"),
});

const createOrderSchema = z.object({
  shippingAddress: shippingAddressSchema,
});

export class OrderController {
  constructor(private readonly createOrderUseCase: CreateOrderUseCase) {}

  createOrder = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { shippingAddress } = createOrderSchema.parse(req.body);
      const order = await this.createOrderUseCase.execute({
        userId: req.user!.userId,
        shippingAddress,
      });
      res.status(201).json({ success: true, data: order });
    } catch (error) {
      next(error);
    }
  };
}
