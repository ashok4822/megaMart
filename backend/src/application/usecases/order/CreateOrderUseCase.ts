import type { IOrderRepository } from "../../../domain/repositories/IOrderRepository.js";
import type { ICartRepository } from "../../../domain/repositories/ICartRepository.js";
import type { IProductRepository } from "../../../domain/repositories/IProductRepository.js";
import type { Order } from "../../../domain/entities/Order.js";
import type { ShippingAddress } from "../../../domain/entities/Order.js";
import { AppError } from "../../../shared/errors/AppError.js";

export interface CreateOrderInput {
  userId: string;
  shippingAddress: ShippingAddress;
}

export class CreateOrderUseCase {
  constructor(
    private readonly orderRepo: IOrderRepository,
    private readonly cartRepo: ICartRepository,
    private readonly productRepo: IProductRepository,
  ) {}

  async execute(input: CreateOrderInput): Promise<Order> {
    const { userId, shippingAddress } = input;

    // Fetch cart
    const cart = await this.cartRepo.findByUserId(userId);
    if (!cart || cart.items.length === 0) {
      throw new AppError("Cart is empty", 400);
    }

    // Validate stock and build order items (pre-checkout stale cart check)
    const orderItems = [];
    let total = 0;

    for (const item of cart.items) {
      const product = await this.productRepo.findById(item.product);
      if (!product) {
        throw new AppError(
          `Product "${item.productSnapshot?.name || item.product}" is no longer available`,
          400,
        );
      }

      const variant = product.variants.find((v) => v.sku === item.variantSku);
      if (!variant) {
        throw new AppError(
          `Variant ${item.variantSku} for "${product.name}" is no longer available`,
          400,
        );
      }

      if (variant.stock < item.quantity) {
        throw new AppError(
          `"${product.name}" (${item.variantSku}) has only ${variant.stock} unit(s) left. Please update your cart.`,
          400,
        );
      }

      orderItems.push({
        product: item.product,
        variantSku: item.variantSku,
        quantity: item.quantity,
        price: variant.price, // Always use current price, not priceAtAdd
        productSnapshot: {
          name: product.name,
          image: product.images[0] || "",
          slug: product.slug,
        },
      });

      total += variant.price * item.quantity;
    }

    // Atomically decrement stock for each variant
    // IMPORTANT: This uses findOneAndUpdate with $inc to prevent race conditions
    for (const item of orderItems) {
      const success = await this.productRepo.decrementStock(
        item.product,
        item.variantSku,
        item.quantity,
      );
      if (!success) {
        throw new AppError(
          `Failed to reserve stock for item. Another checkout may have taken the last unit. Please refresh your cart.`,
          409,
        );
      }
    }

    // Create order
    const order = await this.orderRepo.create({
      userId,
      items: orderItems,
      shippingAddress,
      total,
    });

    // Clear cart after successful order
    await this.cartRepo.clearCart(userId);

    return order;
  }
}
