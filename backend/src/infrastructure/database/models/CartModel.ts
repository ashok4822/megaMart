import mongoose, { Schema, type Document } from "mongoose";

export interface CartItemDoc {
  _id: mongoose.Types.ObjectId;
  product: mongoose.Types.ObjectId;
  variantSku: string;
  quantity: number;
  priceAtAdd: number;
  productSnapshot: {
    name: string;
    image: string;
    slug: string;
  };
}

export interface CartDoc extends Document {
  user: mongoose.Types.ObjectId;
  items: CartItemDoc[];
}

const cartItemSchema = new Schema<CartItemDoc>(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    variantSku: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    priceAtAdd: { type: Number, required: true },
    productSnapshot: {
      name: { type: String },
      image: { type: String },
      slug: { type: String },
    },
  },
  { _id: true },
);

const cartSchema = new Schema<CartDoc>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    items: [cartItemSchema],
  },
  { timestamps: true },
);

export const CartModel = mongoose.model<CartDoc>("Cart", cartSchema);
