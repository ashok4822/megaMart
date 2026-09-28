import type { Order, OrderItem, ShippingAddress } from "../entities/Order.js";

export interface CreateOrderInput {
  userId: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  total: number;
}

export interface IOrderRepository {
  create(input: CreateOrderInput): Promise<Order>;
  findByUserId(userId: string): Promise<Order[]>;
  findById(id: string): Promise<Order | null>;
  updateStatus(id: string, status: string): Promise<Order | null>;
}
