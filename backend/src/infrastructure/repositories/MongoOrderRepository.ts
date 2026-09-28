import type {
  IOrderRepository,
  CreateOrderInput,
} from "../../domain/repositories/IOrderRepository.js";
import type { Order } from "../../domain/entities/Order.js";
import { OrderModel } from "../database/models/OrderModel.js";

export class MongoOrderRepository implements IOrderRepository {
  async create(input: CreateOrderInput): Promise<Order> {
    const order = await OrderModel.create({
      user: input.userId,
      items: input.items,
      shippingAddress: input.shippingAddress,
      total: input.total,
      status: "pending",
    });
    return this.toEntity(order.toObject());
  }

  async findByUserId(userId: string): Promise<Order[]> {
    const orders = await OrderModel.find({ user: userId })
      .sort({ createdAt: -1 })
      .lean();
    return orders.map(this.toEntity);
  }

  async findById(id: string): Promise<Order | null> {
    const order = await OrderModel.findById(id).lean();
    return order ? this.toEntity(order) : null;
  }

  async updateStatus(id: string, status: string): Promise<Order | null> {
    const order = await OrderModel.findByIdAndUpdate(
      id,
      { status },
      { new: true },
    ).lean();
    return order ? this.toEntity(order) : null;
  }

  private toEntity(doc: unknown): Order {
    const d = doc as Record<string, unknown>;
    return {
      _id: (d._id as object)?.toString(),
      user: (d.user as object)?.toString(),
      items: (d.items as Array<Record<string, unknown>>).map((i) => ({
        product: (i.product as object)?.toString(),
        variantSku: i.variantSku as string,
        quantity: i.quantity as number,
        price: i.price as number,
        productSnapshot: i.productSnapshot as {
          name: string;
          image: string;
          slug: string;
        },
      })),
      shippingAddress: d.shippingAddress as Order["shippingAddress"],
      total: d.total as number,
      status: d.status as Order["status"],
      createdAt: d.createdAt as Date,
      updatedAt: d.updatedAt as Date,
    };
  }
}
