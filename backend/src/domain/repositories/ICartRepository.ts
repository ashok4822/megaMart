import type { Cart, CartItem, CartWithTotal } from "../entities/Cart.js";

export interface ICartRepository {
  findByUserId(userId: string): Promise<CartWithTotal | null>;
  addItem(userId: string, item: CartItem): Promise<CartWithTotal>;
  updateItem(
    userId: string,
    itemId: string,
    quantity: number,
  ): Promise<CartWithTotal | null>;
  removeItem(userId: string, itemId: string): Promise<CartWithTotal | null>;
  clearCart(userId: string): Promise<void>;
  upsertCart(userId: string, items: CartItem[]): Promise<CartWithTotal>;
}
