export type SellerUser = {
  _id: string;
  name: string;
  email: string;
};

export type SellerApplication = {
  _id: string;

  userId: SellerUser;

  businessName: string;
  businessType?: "INDIVIDUAL" | "COMPANY" | "PARTNERSHIP";
  gstNumber?: string;

  phone?: string;
  address: string;
  city?: string;
  state?: string;
  pincode?: string;

  documents: string[];

  status: "PENDING" | "APPROVED" | "REJECTED";

  rejectionReason?: string;
  reviewedAt?: string;

  createdAt: string;
  updatedAt: string;
};

export interface GetSellerApplicationsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  sort?: string;
}

export interface SellerApplicationListResponse {
  success: boolean;
  data: SellerApplication[];
  pagination: Pagination;
}

export type BankUser = {
  _id: string;
  name: string;
  email: string;
};

export type BankDetails = {
  _id: string;

  sellerId: BankUser;

  accountNumber: string;
  ifscCode: string;
  accountHolderName: string;

  documentUrl: string;

  status: "PENDING" | "VERIFIED" | "REJECTED";

  rejectionReason?: string;
  verifiedAt?: string;

  createdAt: string;
  updatedAt: string;
};

export interface GetBankDetailsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  sort?: string;
}

export interface BankDetailsListResponse {
  data: BankDetails[];
  pagination: Pagination;
}
export type ListingSeller = {
  _id: string;
  name: string;
  email: string;
  shopName?: string;
  phone?: string;
};
export type ListingProduct = {
  _id: string;
  title: string;
  description: string;

  brand: string;

  categoryId: Category;
  subCategoryId: SubCategory;

  images: string[];
};

export type ProductListing = {
  _id: string;

  productId: ListingProduct;
  sellerId: ListingSeller;

  price: number;
  stock: number;
  reservedStock: number;

  status: "ACTIVE" | "PENDING_APPROVAL" | "REJECTED" | "PAUSED";

  approvalReason?: string;

  createdAt: string;
  updatedAt: string;
};

export interface GetListingsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  sort?: string;
  sellerId?: string;
}

export interface ProductListingListResponse {
  data: ProductListing[];
  pagination: Pagination;
}

export interface Category {
  _id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface SubCategory {
  _id: string;
  name: string;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  _id: string;
  title: string;
  description: string;
  brand: string;

  categoryId: {
    _id: string;
    name: string;
  };

  subCategoryId: {
    _id: string;
    name: string;
  };

  images: string[];

  tags: string[];

  priceRange: {
    min: number;
    max: number;
  };

  avgRating: number;
  totalReviews: number;

  createdAt: string;
  updatedAt: string;
}

export interface ProductPayload {
  title: string;
  description: string;
  brand: string;

  categoryId: string;
  subCategoryId: string;

  tags: string[];

  priceRange: {
    min: number;
    max: number;
  };
}
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface ProductListResponse {
  data: Product[];
  pagination: Pagination;
}

export interface GetProductsParams {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  categoryId?: string;
  subCategoryId?: string;
  minPrice?: string;
  maxPrice?: string;
}

//============Users==============//
export interface Address {
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

export type UserRole = "BUYER" | "SELLER" | "ADMIN" | "AGENT";

export interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: UserRole;
  isVerified: boolean;
  isActive: boolean;
  addresses: Address[];
  createdAt: string;
  updatedAt: string;
}

export interface UserListResponse {
  success: boolean;
  data: User[];
  pagination: Pagination;
}

export interface UserResponse {
  success: boolean;
  data: User;
}

export interface UpdateUserStatusPayload {
  isActive: boolean;
}
