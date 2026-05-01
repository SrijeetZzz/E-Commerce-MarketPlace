import api from "./api";
import { SellerApplication, SellerApplicationPayload } from "@/types/seller";
import { BankDetails, BankDetailsPayload } from "@/types/bank";
import { ApiResponse } from "@/types/api";

export const submitSellerApplication = async (
  data: SellerApplicationPayload,
): Promise<SellerApplication> => {
  const res = await api.post<ApiResponse<SellerApplication>>(
    "/seller/application",
    data,
  );

  return res.data.data;
};

export const getMyApplication = async (): Promise<SellerApplication> => {
  const res = await api.get<ApiResponse<SellerApplication>>(
    "/seller/application/me",
  );

  return res.data.data;
};

export const submitBankDetails = async (
  data: BankDetailsPayload,
): Promise<BankDetails> => {
  const res = await api.post<ApiResponse<BankDetails>>(
    "/seller/bank-details",
    data,
  );

  return res.data.data;
};

export const getMyBankDetails = async (): Promise<BankDetails | null> => {
  try {
    const res = await api.get<ApiResponse<BankDetails>>(
      "/seller/bank-details/me",
    );

    return res.data.data;
  } catch {
    return null;
  }
};
