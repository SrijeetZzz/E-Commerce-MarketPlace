export interface ListingInCart {
  _id: string;
  productId: string;
  sellerId: string;
  price: number;
  stock: number;
  status: "ACTIVE" | "INACTIVE";
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  _id: string;
  listing: ListingInCart; 
  quantity: number;
  priceAtAdd: number;
}

export interface Cart {
  _id: string;
  userId: string;
  items: CartItem[];
  createdAt: string;
  updatedAt: string;
}