export type BankVerificationStatus = "PENDING" | "VERIFIED" | "REJECTED";
/*
Database entity returned from backend
*/
export interface BankDetails {
  _id: string;
  sellerId: string;
  accountNumber: string;
  ifscCode: string;
  accountHolderName: string;
  documentUrl: string;
  status: BankVerificationStatus;
  rejectionReason?: string;
  verifiedAt?: string;
  createdAt: string;
  updatedAt: string;
}

/*
POST /seller/bank-details payload
*/
export interface BankDetailsPayload {
  accountNumber: string;
  ifscCode: string;
  accountHolderName: string;
  documentUrl: string;
}
