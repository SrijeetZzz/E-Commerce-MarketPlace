import api from "./api";
import {
  GetListingsParams,
  GetProductsParams,
  ProductListing,
  ProductListingListResponse,
  ProductListResponse,
  SellerApplication,
  SellerUser,
} from "@/types/admin";
import { ApiResponse } from "@/types/api";
import {
  Product,
  ProductPayload,
  Category,
  SubCategory,
  GetSellerApplicationsParams,
  SellerApplicationListResponse,
  UserListResponse,
  UserResponse,
  UpdateUserStatusPayload,
} from "@/types/admin";

/* ---------------- SELLERS ---------------- */

export const getSellerApplications = async (
  params: GetSellerApplicationsParams,
) => {
  const res = await api.get<SellerApplicationListResponse>(
    "/admin/seller/applications",
    {
      params,
    },
  );

  return res.data;
};
export const approveSellerApplication = async (id: string): Promise<void> => {
  await api.patch(`/admin/seller/application/${id}/approve`);
};

export const rejectSellerApplication = async (
  id: string,
  reason: string,
): Promise<void> => {
  await api.patch(`/admin/seller/application/${id}/reject`, {
    reason,
  });
};
/* ---------------- BANK KYC ---------------- */

import { BankDetailsListResponse, GetBankDetailsParams } from "@/types/admin";

export const getBankDetails = async (
  params: GetBankDetailsParams,
): Promise<BankDetailsListResponse> => {
  const res = await api.get<BankDetailsListResponse>("/admin/bank-details", {
    params,
  });

  return res.data;
};

export const verifyBank = async (id: string): Promise<void> => {
  await api.patch(`/admin/bank-details/${id}/verify`);
};

export const rejectBank = async (id: string, reason: string): Promise<void> => {
  await api.patch(`/admin/bank-details/${id}/reject`, {
    reason,
  });
};
/* ---------------- LISTINGS ---------------- */

export const getListings = async (
  params: GetListingsParams,
): Promise<ProductListingListResponse> => {
  const res = await api.get<ProductListingListResponse>("/admin/listings", {
    params,
  });

  return res.data;
};

/* ---------------- LISTING DETAILS ---------------- */

export const getListingById = async (id: string): Promise<ProductListing> => {
  const res = await api.get<ApiResponse<ProductListing>>(
    `/admin/listings/${id}`,
  );

  return res.data.data;
};

export const approveListing = async (id: string): Promise<void> => {
  await api.patch(`/admin/listings/${id}/approve`);
};

export const rejectListing = async (
  id: string,
  reason: string,
): Promise<void> => {
  await api.patch(`/admin/listings/${id}/reject`, {
    reason,
  });
};

export const getSellers = async (): Promise<SellerUser[]> => {
  const res = await api.get<ApiResponse<SellerUser[]>>("/admin/sellers");

  return res.data.data;
};
//-------------PRODUCTS---------------------

export const getProducts = async (
  params: GetProductsParams,
): Promise<ProductListResponse> => {
  const res = await api.get("/products", {
    params,
  });

  return {
    data: res.data.data,
    pagination: res.data.pagination,
  };
};
export const createProduct = async (formData: FormData): Promise<Product> => {
  const res = await api.post("/products", formData);

  return res.data.data;
};

export const updateProduct = async (
  id: string,
  payload: ProductPayload,
): Promise<Product> => {
  const res = await api.patch(`/products/${id}`, payload);

  return res.data.data;
};

export const deleteProduct = async (id: string) => {
  await api.delete(`/products/${id}`);
};

export const getCategories = async (): Promise<Category[]> => {
  const res = await api.get("/categories");

  return res.data.data;
};

export const getSubCategories = async (
  categoryId?: string
): Promise<SubCategory[]> => {
  const res = await api.get("/categories/subcategories", {
    params: categoryId ? { categoryId } : {},
  });

  return res.data.data;
};
// CREATE CATEGORY
export const createCategory = async (payload: {
  name: string;
}) => {
  const res = await api.post("/categories", payload);

  return res.data;
};

// UPDATE CATEGORY
export const updateCategory = async (
  id: string,
  payload: {
    name: string;
  }
) => {
  const res = await api.patch(`/categories/${id}`, payload);

  return res.data;
};

// DELETE CATEGORY
export const deleteCategory = async (id: string) => {
  const res = await api.delete(`/categories/${id}`);

  return res.data;
};

// CREATE SUBCATEGORY
export const createSubCategory = async (payload: {
  name: string;
  categoryId: string;
}) => {
  const res = await api.post(
    "/categories/subcategories",
    payload
  );

  return res.data;
};

// UPDATE SUBCATEGORY
export const updateSubCategory = async (
  id: string,
  payload: {
    name: string;
    categoryId: string;
  }
) => {
  const res = await api.patch(
    `/categories/subcategories/${id}`,
    payload
  );

  return res.data;
};

// DELETE SUBCATEGORY
export const deleteSubCategory = async (id: string) => {
  const res = await api.delete(
    `/categories/subcategories/${id}`
  );

  return res.data;
};

//================Users==================//

interface GetUsersParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  isActive?: string;
  sort?: string;
}

export const getUsers = async ({
  page,
  limit,
  search,
  role,
  isActive,
  sort = "latest",
}: GetUsersParams): Promise<UserListResponse> => {
  const params: Record<string, unknown> = {
    page,
    limit,
    sortBy: "createdAt",
    order: sort === "oldest" ? "asc" : "desc",
  };

  if (search?.trim()) {
    params.search = search.trim();
  }

  if (role) {
    params.role = role;
  }

  if (isActive !== "" && isActive !== undefined) {
    params.isActive = isActive;
  }

  const response = await api.get<UserListResponse>("/admin/users", {
    params,
  });

  return response.data;
};

export const getUserById = async (id: string): Promise<UserResponse> => {
  const response = await api.get<UserResponse>(`/admin/users/${id}`);

  return response.data;
};

export const updateUserStatus = async (
  id: string,
  payload: UpdateUserStatusPayload,
): Promise<UserResponse> => {
  const response = await api.patch<UserResponse>(
    `/admin/users/${id}/status`,
    payload,
  );

  return response.data;
};
