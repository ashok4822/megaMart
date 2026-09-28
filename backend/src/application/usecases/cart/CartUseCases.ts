import type { ICartRepository } from "../../../domain/repositories/ICartRepository.js";
import type { IProductRepository } from "../../../domain/repositories/IProductRepository.js";
import type { CartItem, CartWithTotal } from "../../../domain/entities/Cart.js";
import { AppError } from "../../../shared/errors/AppError.js";

export class GetCartUseCase {
  constructor(private readonly cartRepo: ICartRepository) {}

  async execute(userId: string): Promise<CartWithTotal> {
    const cart = await this.cartRepo.findByUserId(userId);
    return cart || { user: userId, items: [], subtotal: 0, itemCount: 0 };
  }
}

export class AddToCartUseCase {
  constructor(
    private readonly cartRepo: ICartRepository,
    private readonly productRepo: IProductRepository,
  ) {}

  async execute(
    userId: string,
    productId: string,
    variantSku: string,
    quantity: number,
  ): Promise<CartWithTotal> {
    const product = await this.productRepo.findById(productId);
    if (!product) throw new AppError("Product not found", 404);

    const variant = product.variants.find((v) => v.sku === variantSku);
    if (!variant) throw new AppError("Product variant not found", 404);
    if (variant.stock < quantity) throw new AppError("Insufficient stock", 400);

    const item: CartItem = {
      product: productId,
      variantSku,
      quantity,
      priceAtAdd: variant.price,
      productSnapshot: {
        name: product.name,
        image: product.images[0] || "",
        slug: product.slug,
      },
    };

    return this.cartRepo.addItem(userId, item);
  }
}

export class UpdateCartItemUseCase {
  constructor(
    private readonly cartRepo: ICartRepository,
    private readonly productRepo: IProductRepository,
  ) {}

  async execute(
    userId: string,
    itemId: string,
    quantity: number,
  ): Promise<CartWithTotal> {
    if (quantity < 1) throw new AppError("Quantity must be at least 1", 400);

    // Get cart to find product and validate stock
    const cart = await this.cartRepo.findByUserId(userId);
    if (!cart) throw new AppError("Cart not found", 404);

    const cartItem = cart.items.find((i) => i._id?.toString() === itemId);
    if (!cartItem) throw new AppError("Cart item not found", 404);

    const product = await this.productRepo.findById(cartItem.product);
    if (!product) throw new AppError("Product no longer available", 404);

    const variant = product.variants.find((v) => v.sku === cartItem.variantSku);
    if (!variant || variant.stock < quantity) {
      throw new AppError(
        variant
          ? `Only ${variant.stock} units available`
          : "Variant out of stock",
        400,
      );
    }

    const updated = await this.cartRepo.updateItem(userId, itemId, quantity);
    if (!updated) throw new AppError("Failed to update cart", 500);
    return updated;
  }
}

export class RemoveCartItemUseCase {
  constructor(private readonly cartRepo: ICartRepository) {}

  async execute(userId: string, itemId: string): Promise<CartWithTotal> {
    const updated = await this.cartRepo.removeItem(userId, itemId);
    if (!updated) throw new AppError("Item not found in cart", 404);
    return updated;
  }
}
