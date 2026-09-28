import type { ICartRepository } from "../../domain/repositories/ICartRepository.js";
import type { CartItem, CartWithTotal } from "../../domain/entities/Cart.js";
import { CartModel } from "../database/models/CartModel.js";

export class MongoCartRepository implements ICartRepository {
  async findByUserId(userId: string): Promise<CartWithTotal | null> {
    const cart = await CartModel.findOne({ user: userId }).lean();
    if (!cart) return null;
    return this.toEntityWithTotal(cart);
  }

  async addItem(userId: string, item: CartItem): Promise<CartWithTotal> {
    // Check if same product+variant already in cart → increment quantity
    const cart = await CartModel.findOne({ user: userId });

    if (!cart) {
      const newCart = await CartModel.create({
        user: userId,
        items: [item],
      });
      return this.toEntityWithTotal(newCart.toObject());
    }

    const existingIdx = cart.items.findIndex(
      (i) =>
        i.product.toString() === item.product &&
        i.variantSku === item.variantSku,
    );

    if (existingIdx >= 0) {
      cart.items[existingIdx].quantity += item.quantity;
    } else {
      cart.items.push(item as unknown as (typeof cart.items)[0]);
    }

    await cart.save();
    return this.toEntityWithTotal(cart.toObject());
  }

  async updateItem(
    userId: string,
    itemId: string,
    quantity: number,
  ): Promise<CartWithTotal | null> {
    const cart = await CartModel.findOneAndUpdate(
      { user: userId, "items._id": itemId },
      { $set: { "items.$.quantity": quantity } },
      { new: true },
    ).lean();
    return cart ? this.toEntityWithTotal(cart) : null;
  }

  async removeItem(
    userId: string,
    itemId: string,
  ): Promise<CartWithTotal | null> {
    const cart = await CartModel.findOneAndUpdate(
      { user: userId },
      { $pull: { items: { _id: itemId } } },
      { new: true },
    ).lean();
    return cart ? this.toEntityWithTotal(cart) : null;
  }

  async clearCart(userId: string): Promise<void> {
    await CartModel.findOneAndUpdate({ user: userId }, { $set: { items: [] } });
  }

  async upsertCart(userId: string, items: CartItem[]): Promise<CartWithTotal> {
    const cart = await CartModel.findOneAndUpdate(
      { user: userId },
      { $set: { items } },
      { new: true, upsert: true },
    ).lean();
    return this.toEntityWithTotal(cart!);
  }

  private toEntityWithTotal(doc: unknown): CartWithTotal {
    const d = doc as Record<string, unknown>;
    const items = (
      d.items as Array<{
        _id: object;
        product: object;
        variantSku: string;
        quantity: number;
        priceAtAdd: number;
        productSnapshot: { name: string; image: string; slug: string };
      }>
    ).map((i) => ({
      _id: i._id?.toString(),
      product: i.product?.toString(),
      variantSku: i.variantSku,
      quantity: i.quantity,
      priceAtAdd: i.priceAtAdd,
      productSnapshot: i.productSnapshot,
    }));

    const subtotal = items.reduce(
      (sum, item) => sum + item.priceAtAdd * item.quantity,
      0,
    );
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

    return {
      _id: (d._id as object)?.toString(),
      user: (d.user as object)?.toString(),
      items,
      subtotal,
      itemCount,
    };
  }
}
