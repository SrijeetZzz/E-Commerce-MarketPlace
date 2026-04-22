// @/types/order.ts

export interface Address {
  _id: string;
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}
export interface AddressForm  {
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
};

export interface OrderItem {
  listingId: {
    _id: string;
    productId: {
      title: string;
      images: string[];
    };
  };
  quantity: number;
  price: number;
}

export type OrderStatus = "PLACED" | "CONFIRMED" | "CANCELLED";

export interface Order {
  _id: string;
  totalAmount: number;
  status: OrderStatus;
  items: OrderItem[];
  createdAt: string;
  address?: Address;
}