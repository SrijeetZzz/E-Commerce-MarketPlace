import api from "./api";

import {
  CreateListingPayload,
  UpdateListingPayload,
  SellerListingFilters,
  SellerListingsResponse,
} from "@/types/listings";

/* =========================
CREATE
========================= */

export const createListing = async (data: CreateListingPayload) => {
  const res = await api.post("/seller/listings", data);

  return res.data?.data || res.data;
};

/* =========================
GET MY LISTINGS (Paginated)
========================= */

export const getMyListings = async (filters: SellerListingFilters = {}) => {
  const params = new URLSearchParams();

  if (filters.page) params.append("page", String(filters.page));
  if (filters.limit) params.append("limit", String(filters.limit));

  if (filters.status && filters.status !== "all") {
    params.append("status", filters.status);
  }

  if (filters.lowStock === "true") {
    params.append("lowStock", "true");
  }

  if (filters.sort) {
    params.append("sort", filters.sort);
  }

  // Ensure search is appended to the query string
  if (filters.search) {
    params.append("search", filters.search);
  }

  const query = params.toString();

  const res = await api.get<SellerListingsResponse>(
    `/seller/listings${query ? `?${query}` : ""}`,
  );

  return res.data.data;
};

/* =========================
UPDATE
========================= */

export const updateListing = async (
  listingId: string,
  data: UpdateListingPayload,
) => {
  const res = await api.patch(`/seller/listings/${listingId}`, data);

  return res.data?.data || res.data;
};

/* =========================
Quick stock add
========================= */

export const addStock = async (
  listingId: string,
  currentStock: number,
  qty: number = 5,
) => {
  const res = await api.patch(`/seller/listings/${listingId}`, {
    stock: currentStock + qty,
  });

  return res.data?.data || res.data;
};

/* =========================
Duplicate
========================= */

export const duplicateListing = async (listing: any) => {
  const res = await api.post("/seller/listings", {
    productId: listing.productId._id,

    price: listing.price,

    stock: listing.stock,
  });

  return res.data?.data || res.data;
};

/* =========================
Delete
========================= */

export const deleteListing = async (listingId: string) => {
  const res = await api.delete(`/seller/listings/${listingId}`);

  return res.data?.data || res.data;
};
