// services/cart.ts
import api from "./api";
import { Cart } from "@/types/cart";

const normalizeCart = (raw: any): Cart => {
  return {
    _id: raw._id,
    userId: raw.userId,
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
    items: (raw.items ?? []).map((item: any) => ({
      _id: item._id,
      quantity: item.quantity,
      priceAtAdd: item.priceAtAdd,
      listing: item.listingId,
    })),
  };
};

export const getCart = async (): Promise<Cart> => {
  const res = await api.get("/cart");

  // 🔍 LOG ONCE to see real shape
  console.log("GET /cart response:", res);

  // Your interceptor returns FULL AxiosResponse,
  // but your backend wraps data as { data: cart }
  // So handle both safely:
  const payload = res?.data?.data ?? res?.data;

  if (!payload) {
    // no cart yet → return empty cart instead of crashing
    return {
      _id: "",
      userId: "",
      createdAt: "",
      updatedAt: "",
      items: [],
    };
  }

  return normalizeCart(payload);
};

export const addToCart = async (listingId: string, quantity = 1) => {
  await api.post("/cart/add", { listingId, quantity });
};

export const removeFromCart = async (listingId: string) => {
  await api.delete(`/cart/remove/${listingId}`);
};

export const updateCart = async (listingId: string, quantity: number) => {
  await api.patch("/cart/update", { listingId, quantity });
};