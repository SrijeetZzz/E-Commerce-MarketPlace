import api from "./api";

export const addToCart = async (listingId: string, quantity = 1) => {
  const res = await api.post("/cart/add", {
    listingId,
    quantity,
  });

  return res;
};

export const getCart = async () => {
  return await api.get("/cart");
};

export const removeFromCart = async (listingId: string) => {
  return await api.delete(`/cart/remove/${listingId}`);
};

export const updateCart = async (listingId: string, quantity: number) => {
  return await api.patch("/cart/update", {
    listingId,
    quantity,
  });
};