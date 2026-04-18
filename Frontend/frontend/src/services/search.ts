import api from "./api";

export const searchProducts = async (query: string) => {
  if (!query) return [];

  const res = await api.get(`/products/search?q=${query}`);
  return res.data || [];
};