export type ListingStatus = "ACTIVE" | "PAUSED" | "OUT_OF_STOCK" | "PENDING_APPROVAL" | "REJECTED";

/* ------------------------ Sort ------------------------- */
export type ListingSort = "newest" | "oldest" | "stockHigh" | "stockLow" | "priceLow" | "priceHigh" | "pendingFirst";

/* ------------------------ Product Snapshot ------------------------- */
export interface ListingProduct {
  _id: string;
  title: string;
  description?: string;
  brand?: string;
  images: string[];
  tags: string[];
  priceRange?: { min: number; max: number; };
}

/* ------------------------ Listing ------------------------- */
export interface SellerListing {
  _id: string;
  productId: string; // FIXED (was wrong)
  sellerId: string; // added because API returns it
  product: ListingProduct; // populated product join
  price: number;
  stock: number;
  reservedStock?: number;
  status: ListingStatus;
  rejectionReason?: string;
  createdAt: string;
  updatedAt?: string;
}

/* ------------------------ Filters ------------------------- */
export interface SellerListingFilters {
  page?: number;
  limit?: number;
  status?: "all" | ListingStatus;
  lowStock?: "true" | "false";
  sort?: ListingSort;
  search?: string;
}

/* ------------------------ Pagination ------------------------- */
export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/* ------------------------ Dashboard Counts ------------------------- */
export interface ListingCounts {
  total: number;
  active: number;
  paused: number;
  outOfStock: number;
  pendingApproval: number;
  rejected: number;
  lowStock: number;
}

/* ------------------------ Payload ------------------------- */
export interface SellerListingsPayload {
  data: SellerListing[];
  pagination: PaginationMeta;
  counts: ListingCounts;
}

/* ------------------------ API Response ------------------------- */
export interface SellerListingsResponse {
  success: boolean;
  data: SellerListingsPayload;
}

/* ------------------------ Create Listing ------------------------- */
export interface CreateListingPayload {
  productId: string;
  price: number;
  stock: number;
}

/* ------------------------ Update Listing ------------------------- */
export type SellerUpdatableStatus = "ACTIVE" | "PAUSED";

export interface UpdateListingPayload {
  price?: number;
  stock?: number;
  status?: SellerUpdatableStatus;
}