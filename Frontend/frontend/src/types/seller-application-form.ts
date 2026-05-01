import { BusinessType } from "./seller";

export interface SellerApplicationForm {
  businessName: string;
  businessType: BusinessType | "";
  gstNumber: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  documents: string[];
}