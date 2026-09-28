export interface CartItem {
  _id?: string;
  product: string; // Product ID reference
  variantSku: string;
  quantity: number;
  priceAtAdd: number; // Price snapshot at time of adding
  productSnapShot?: {
    name: string;
    image: string;
    slug: string;
  };
}

export interface Cart {
  _id?: string;
  user: string; // User ID reference
  items: CartItem[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CartWithTotal extends Cart {
  subtotal: number;
  itemCount: number;
}
