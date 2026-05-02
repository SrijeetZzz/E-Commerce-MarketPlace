import api from "./api";
import {
  DashboardSummary,
  OrdersOverTime,
  RevenueOverTime,
  TopProduct,
  RecentOrder
} from "@/types/dashboard";

export const getDashboardSummary = async (range: string): Promise<DashboardSummary> => {
  const res = await api.get(`/seller/dashboard/summary?range=${range}`);
  return res.data.data;
};

export const getOrdersOverTime = async (range: string): Promise<OrdersOverTime[]> => {
  const res = await api.get(`/seller/dashboard/orders-over-time?range=${range}`);
  return res.data.data;
};

export const getRevenueOverTime = async (range: string): Promise<RevenueOverTime[]> => {
  const res = await api.get(`/seller/dashboard/revenue-over-time?range=${range}`);
  return res.data.data;
};

export const getTopProducts = async (
  range: string,
  categoryId?: string,
  subCategoryId?: string
): Promise<TopProduct[]> => {
  const res = await api.get("/seller/dashboard/top-products", {
    params: { range, categoryId, subCategoryId }
  });

  return res.data.data;
};

export const getRecentOrders = async (): Promise<RecentOrder[]> => {
  const res = await api.get("/seller/dashboard/recent-orders");
  return res.data.data;
};