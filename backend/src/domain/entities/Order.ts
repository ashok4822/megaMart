export type OrderStatus =
  | "pending"
  | "confirmed"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface OrderItem {
  product: string; // Product ID
  variantSku: string;
  quantity: number;
  price: number;
  productSnapshot: {
    name: string;
    image: string;
    slug: string;
  };
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
}

export interface Order {
  _id?: string;
  user: string; //User ID
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  total: number;
  status: OrderStatus;
  createdAt?: Date;
  updatedAt?: Date;
}
