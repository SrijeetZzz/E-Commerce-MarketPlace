export interface Address {
  _id: string;
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  isDefault?: boolean;
}

export interface AddressForm {
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
}

/* ========================= Order Status ========================= */
export type OrderStatus = "PLACED" | "CONFIRMED" | "CANCELLED";

/* ========================= Fulfillment ========================= */
export type FulfillmentStatus = "NEW" | "PACKING" | "SHIPPED" | "DELIVERED";

/* Separate seller filter tabs (UI concern, not domain concern) */
export type SellerOrderTab = "all" | "NEW" | "PACKING" | "SHIPPED" | "DELIVERED";

/* ========================= Seller Buyer ========================= */
export interface SellerOrderBuyer {
  _id: string;
  name: string;
  email: string;
}

/* ========================= Product Snapshot ========================= */
export interface OrderProduct {
  _id: string;
  title: string;
  images: string[];
}

/* ========================= Listing Snapshot ========================= */
export interface OrderListing {
  _id: string;
  sellerId: string;
  productId: OrderProduct;
  price?: number;
  stock?: number;
  reservedStock?: number;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

/* ========================= Order Item ========================= */
export interface OrderItem {
  _id: string;
  listingId: OrderListing;
  quantity: number;
  price: number;
  fulfillmentStatus: FulfillmentStatus;
  trackingId: string | null;
  shippedAt: string | null;
  deliveredAt: string | null;
}

/* ========================= Order ========================= */
export interface Order {
  _id: string;
  totalAmount: number;
  sellerAmount?: number; // seller-only subtotal returned by backend
  status: OrderStatus;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
  address?: Address;
  buyerId?: SellerOrderBuyer;
}

/* ========================= Pagination ========================= */
export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/* ========================= Dashboard Counts ========================= */
export interface SellerOrderCounts {
  NEW: number;
  PACKING: number;
  SHIPPED: number;
  DELIVERED: number;
}

/* ========================= Payload ========================= */
export interface SellerOrdersPayload {
  data: Order[];
  pagination: PaginationMeta;
  counts: SellerOrderCounts;
}

/* ========================= API Response ========================= */
export interface SellerOrdersResponse {
  success: boolean;
  data: SellerOrdersPayload;
}