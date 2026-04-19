import api from "./api";
import { ProductDetail, ProductListItem  } from "@/types/product";
import { ApiResponse } from "@/types/api";

export const fetchProducts = async (
  url: string
): Promise<ApiResponse<ProductListItem []>> => {
  const res = await api.get(url);

  const payload = res?.data ?? res;

  return payload;
};

export const searchProducts = async (
  query: string
): Promise<ProductListItem []> => {
  if (!query) return [];

  const res = await api.get(`/products/search?q=${query}`);

  const payload = res?.data ?? res;

  return payload.data;
};

export const getProductById = async (
  id: string
): Promise<ProductDetail> => {
  const res = await api.get(`/products/${id}`);

  const payload = res?.data ?? res;

  return payload.data;
};