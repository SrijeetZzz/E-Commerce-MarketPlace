export interface DashboardSummary {
  totalOrders: number;
  revenue: number;
  aov: number;
  activeListings: number;
  lowStockItems: number;
  statusBreakdown: {
    NEW: number;
    PACKING: number;
    SHIPPED: number;
    DELIVERED: number;
  };
}

export interface OrdersOverTime {
  _id: string; // date
  orders: number;
}

export interface RevenueOverTime {
  _id: string; // date
  revenue: number;
}

export interface TopProduct {
  _id: string;
  productName: string;
  quantitySold: number;
  revenue: number;
}

export interface RecentOrder {
  _id: string; // itemId
  orderId: string;
  productName: string;
  status: string;
  amount: number;
  date: string;
}