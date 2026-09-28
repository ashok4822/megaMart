import mongoose, { Schema, type Document } from "mongoose";

export interface ProductVariantDoc {
  sku: string;
  size?: string;
  colour?: string;
  price: number;
  stock: number;
}

export interface ProductDoc extends Document {
  name: string;
  slug: string;
  description: string;
  images: string[];
  category: string;
  brand?: string;
  variants: ProductVariantDoc[];
  tags: string[];
}

const variantSchema = new Schema<ProductVariantDoc>(
  {
    sku: { type: String, required: true },
    size: { type: String },
    colour: { type: String },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0, default: 0 },
  },
  { _id: true },
);

const productSchema = new Schema<ProductDoc>(
  {
    name: { type: String, required: true, trim: true },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: { type: String, required: true },
    images: [{ type: String }],
    category: { type: String, required: true, index: true },
    brand: { type: String, index: true },
    variants: [variantSchema],
    tags: [{ type: String }],
  },
  { timestamps: true },
);

// Indexes for filtering/sorting performance
productSchema.index({ name: "text", description: "text", tags: "text" });
productSchema.index({ "variants.price": 1 });
productSchema.index({ category: 1, "variants.price": 1 });

export const ProductModel = mongoose.model<ProductDoc>(
  "Product",
  productSchema,
);
