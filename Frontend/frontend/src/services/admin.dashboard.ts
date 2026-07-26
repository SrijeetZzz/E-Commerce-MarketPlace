import api  from "@/services/api";


import {
  DashboardAnalytics,
  DashboardStats,
  DashboardTables,
} from "@/types/admin.dashboard";
import { ApiResponse } from "@/types/api";

export const getDashboardStats = async (
  range: string = "30d"
): Promise<DashboardStats> => {
  const res = await api.get<ApiResponse<DashboardStats>>(
    `/admin/dashboard/stats?range=${range}`
  );

  return res.data.data;
};

export const getDashboardAnalytics = async (
  range: string = "30d"
): Promise<DashboardAnalytics> => {
  const res = await api.get<ApiResponse<DashboardAnalytics>>(
    `/admin/dashboard/analytics?range=${range}`
  );

  return res.data.data;
};

export const getDashboardTables = async (
  range: string = "30d"
): Promise<DashboardTables> => {
  const res = await api.get<ApiResponse<DashboardTables>>(
    `/admin/dashboard/tables?range=${range}`
  );

  return res.data.data;
};