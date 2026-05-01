export type SellerApplicationStatus = "PENDING" | "APPROVED" | "REJECTED";

export type BusinessType = "INDIVIDUAL" | "COMPANY" | "PARTNERSHIP";

export interface SellerApplication {
  _id: string;
  userId: string;
  businessName: string;
  businessType: BusinessType;
  gstNumber?: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  documents: string[];
  status: SellerApplicationStatus;
  rejectionReason?: string;
  reviewedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SellerApplicationPayload {
  businessName: string;
  businessType: BusinessType;
  gstNumber?: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  documents: string[];
}