import mongoose, { Schema, type Document } from "mongoose";

export interface OrderItemDoc {
  product: mongoose.Types.ObjectId;
  variantSku: string;
  quantity: number;
  price: number;
  productSnapshot: {
    name: string;
    image: string;
    slug: string;
  };
}

export interface OrderDoc extends Document {
  user: mongoose.Types.ObjectId;
  items: OrderItemDoc[];
  shippingAddress: {
    fullName: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    pincode: string;
  };
  total: number;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
}

const orderItemSchema = new Schema<OrderItemDoc>({
  product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  variantSku: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true },
  productSnapshot: {
    name: String,
    image: String,
    slug: String,
  },
});

const orderSchema = new Schema<OrderDoc>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    items: [orderItemSchema],
    shippingAddress: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      addressLine1: { type: String, required: true },
      addressLine2: String,
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
    },
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true },
);

export const OrderModel = mongoose.model<OrderDoc>("Order", orderSchema);
