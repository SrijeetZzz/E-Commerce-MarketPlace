export interface DashboardStats {
  totalUsers: number;
  totalSellers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  pendingKyc: number;
}

export interface RevenueTrend {
  date: string;
  revenue: number;
  orders: number;
}

export interface OrderStatus {
  status: string;
  value: number;
}

export interface CategorySales {
  category: string;
  totalSold: number;
  revenue: number;
}

export interface UserGrowth {
  date: string;
  users: number;
}

export interface DashboardAnalytics {
  revenueTrend: RevenueTrend[];
  orderStatus: OrderStatus[];
  categorySales: CategorySales[];
  userGrowth: UserGrowth[];
}

export interface RecentOrder {
  _id: string;
  buyerName: string;
  buyerEmail: string;
  totalAmount: number;
  totalItems: number;
  status: string;
  createdAt: string;
}

export interface RecentUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  isVerified: boolean;
  isActive: boolean;
  createdAt: string;
}

export interface TopProduct {
  _id: string;
  title: string;
  image: string;
  totalSold: number;
  revenue: number;
}

export interface TopSeller {
  _id: string;
  businessName: string;
  orders: number;
  revenue: number;
}

export interface LowStockProduct {
  _id: string;
  title: string;
  seller: string;
  stock: number;
  price: number;
}

export interface DashboardTables {
  recentOrders: RecentOrder[];
  recentUsers: RecentUser[];
  topProducts: TopProduct[];
  topSellers: TopSeller[];
  lowStockProducts: LowStockProduct[];
}