import api from "./api";

import {
 SellerOrdersResponse,
 FulfillmentStatus
} from "@/types/order";


/* =====================================
BUYER
===================================== */

export const checkout = async (
 payload:any
)=>{
 const res=
 await api.post(
  "/orders/checkout",
  payload
 );

 return res.data?.data || res.data;
};



export const getMyOrders = async ()=>{
 const res=
 await api.get("/orders");

 return res.data?.data || [];
};



export const getOrderById = async(
 id:string
)=>{
 const res=
 await api.get(
  `/orders/${id}`
 );

 return res.data?.data;
};



/* =====================================
SELLER
===================================== */

export interface SellerOrderFilters{

 page?:number;
 limit?:number;

 fulfillmentStatus?:
 | "NEW"
 | "PACKING"
 | "SHIPPED"
 | "DELIVERED";

 orderStatus?:
 | "PLACED"
 | "CONFIRMED"
 | "CANCELLED";

 sort?:
 | "newest"
 | "oldest"
 | "amountHigh"
 | "amountLow";

 dateFrom?:string;
 dateTo?:string;

}



/* =========================
Get Seller Orders
returns:
{
 data,
 pagination,
 counts
}
========================= */

export const getSellerOrders = async(
 filters:SellerOrderFilters={}
)=>{

 const params=
 new URLSearchParams();


 if(filters.page){
  params.append(
   "page",
   String(filters.page)
  );
 }

 if(filters.limit){
  params.append(
   "limit",
   String(filters.limit)
  );
 }

 if(filters.fulfillmentStatus){
  params.append(
   "fulfillmentStatus",
   filters.fulfillmentStatus
  );
 }

 if(filters.orderStatus){
  params.append(
   "orderStatus",
   filters.orderStatus
  );
 }

 if(filters.sort){
  params.append(
   "sort",
   filters.sort
  );
 }

 if(filters.dateFrom){
  params.append(
   "dateFrom",
   filters.dateFrom
  );
 }

 if(filters.dateTo){
  params.append(
   "dateTo",
   filters.dateTo
  );
 }


 const query=
 params.toString();


 const res=
 await api.get<SellerOrdersResponse>(
  `/orders/seller/orders${
   query ? `?${query}`:""
  }`
 );


 return res.data.data;
};



/* =========================
Update Fulfillment Status
========================= */

export const updateOrderItemStatus = async(
 orderId:string,
 itemId:string,
 status:
 | "NEW"
 | "PACKING"
 | "SHIPPED"
 | "DELIVERED"
)=>{

 const res=
 await api.patch(
  `/orders/seller/orders/${orderId}/items/${itemId}/status`,
  {status}
 );

 return res.data?.data || res.data;
};