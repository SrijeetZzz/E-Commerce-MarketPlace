// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { getCart, updateCart, removeFromCart } from "@/services/cart";
// import { Cart } from "@/types/cart";
// import {
//   Trash2,
//   Plus,
//   Minus,
//   ShoppingBag,
//   ShieldCheck,
//   Truck,
//   Store,
//   Calendar,
//   TicketPercent,
//   Info,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { Separator } from "@/components/ui/separator";
// import { Badge } from "@/components/ui/badge";

// const CartPage = () => {
//   const [cart, setCart] = useState<Cart | null>(null);
//   const [loading, setLoading] = useState(true);
//   const baseUrl = "http://localhost:5000";
//   const CONVENIENCE_FEE = 50;
//   const router = useRouter();

//   // 🔥 Helper to calculate expected delivery (e.g., 4 days from now)
//   const getDeliveryDate = () => {
//     const date = new Date();
//     date.setDate(date.getDate() + 4);
//     return date.toLocaleDateString("en-IN", {
//       day: "numeric",
//       month: "short",
//       weekday: "short",
//     });
//   };

//   const fetchCart = async () => {
//     try {
//       const data = await getCart();
//       setCart(data);
//     } catch (err) {
//       console.error("Cart fetch failed", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchCart();
//   }, []);

//   const handleUpdate = async (listingId: string, quantity: number) => {
//     if (quantity < 1) return;
//     try {
//       await updateCart(listingId, quantity);
//       fetchCart();
//     } catch (err) {
//       console.error("Update failed", err);
//     }
//   };

//   const handleRemove = async (listingId: string) => {
//     try {
//       await removeFromCart(listingId);
//       fetchCart();
//     } catch (err) {
//       console.error("Remove failed", err);
//     }
//   };

//   if (loading)
//     return (
//       <div className="flex items-center justify-center min-h-[60vh]">
//         <div className="flex flex-col items-center gap-2">
//           <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
//           <p className="text-muted-foreground animate-pulse">
//             Setting up your bag...
//           </p>
//         </div>
//       </div>
//     );

//   if (!cart || cart.items.length === 0) {
//     return (
//       <div className="max-w-7xl mx-auto px-4 py-24 flex flex-col items-center justify-center text-center">
//         <div className="bg-slate-100 p-6 rounded-full mb-6">
//           <ShoppingBag size={64} className="text-slate-400" />
//         </div>
//         <h2 className="text-3xl font-bold tracking-tight">Your bag is empty</h2>
//         <p className="text-muted-foreground mt-2 max-w-sm">
//           Everything looks a bit lonely here. Add some items to your bag and
//           make it happy!
//         </p>
//         <Button
//           className="mt-8 rounded-full px-10 h-12 text-base font-semibold"
//           onClick={() => (window.location.href = "/")}
//         >
//           Start Shopping
//         </Button>
//       </div>
//     );
//   }

//   const subtotal = cart.items.reduce(
//     (sum, item) => sum + item.priceAtAdd * item.quantity,
//     0,
//   );
//   const shipping = subtotal > 1000 ? 0 : 100;
//   const total = subtotal + shipping + CONVENIENCE_FEE;

//   return (
//     <div className="bg-slate-50/50 min-h-screen pb-20">
//       <div className="max-w-7xl mx-auto px-4 md:px-6 pt-10">
//         <div className="flex items-baseline gap-3 mb-8">
//           <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
//             Shopping Bag
//           </h1>
//           <Badge variant="secondary" className="text-sm rounded-full px-3">
//             {cart.items.length} {cart.items.length === 1 ? "Item" : "Items"}
//           </Badge>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
//           {/* LEFT: Items List */}
//           <div className="lg:col-span-8 space-y-4">
//             {cart.items.map((item) => {
//               const product = item.listing.productId;
//               const sellerName =
//                 item.listing.sellerId?.name || "Official Store";
//               const imageUrl = product.images?.[0]
//                 ? `${baseUrl}${product.images[0]}`
//                 : "/placeholder.png";

//               return (
//                 <Card
//                   key={item._id}
//                   className="border-none shadow-sm overflow-hidden transition-all hover:shadow-md"
//                 >
//                   <CardContent className="p-4 md:p-6">
//                     <div className="flex gap-4 md:gap-6">
//                       {/* Image container */}
//                       <div className="w-28 h-28 md:w-36 md:h-36 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-100">
//                         <img
//                           src={imageUrl}
//                           alt={product.title}
//                           className="w-full h-full object-cover transition-transform hover:scale-105"
//                         />
//                       </div>

//                       {/* Content details */}
//                       <div className="grow flex flex-col justify-between py-1">
//                         <div>
//                           <div className="flex justify-between items-start gap-4">
//                             <div>
//                               <h3 className="font-bold text-lg text-slate-900 leading-snug hover:text-primary cursor-pointer transition-colors">
//                                 {product.title}
//                               </h3>
//                               <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-1.5">
//                                 <Store size={14} className="text-slate-400" />
//                                 Sold by:{" "}
//                                 <span className="font-semibold text-slate-700">
//                                   {sellerName}
//                                 </span>
//                               </p>
//                             </div>
//                             <div className="text-right">
//                               <p className="font-black text-xl text-slate-900">
//                                 ₹
//                                 {(
//                                   item.priceAtAdd * item.quantity
//                                 ).toLocaleString()}
//                               </p>
//                               {item.quantity > 1 && (
//                                 <p className="text-[10px] text-muted-foreground">
//                                   ₹{item.priceAtAdd.toLocaleString()} per unit
//                                 </p>
//                               )}
//                             </div>
//                           </div>

//                           <div className="mt-4 flex items-center gap-2 text-[11px] font-bold text-emerald-700 bg-emerald-50 w-fit px-2.5 py-1.5 rounded-lg border border-emerald-100">
//                             <Calendar size={14} />
//                             Delivery by{" "}
//                             <span className="ml-0.5">{getDeliveryDate()}</span>
//                           </div>
//                         </div>

//                         <div className="flex justify-between items-center mt-6 pt-4 border-t border-slate-50">
//                           <div className="flex items-center bg-slate-100 rounded-xl p-1 shadow-inner">
//                             <Button
//                               variant="ghost"
//                               size="icon"
//                               className="h-8 w-8 rounded-lg hover:bg-white hover:shadow-sm"
//                               onClick={() =>
//                                 handleUpdate(
//                                   item.listing._id,
//                                   item.quantity - 1,
//                                 )
//                               }
//                             >
//                               <Minus size={14} />
//                             </Button>
//                             <span className="w-10 text-center text-sm font-black">
//                               {item.quantity}
//                             </span>
//                             <Button
//                               variant="ghost"
//                               size="icon"
//                               className="h-8 w-8 rounded-lg hover:bg-white hover:shadow-sm"
//                               onClick={() =>
//                                 handleUpdate(
//                                   item.listing._id,
//                                   item.quantity + 1,
//                                 )
//                               }
//                             >
//                               <Plus size={14} />
//                             </Button>
//                           </div>

//                           <Button
//                             variant="ghost"
//                             size="sm"
//                             className="text-slate-400 hover:text-destructive hover:bg-destructive/5 transition-all font-medium gap-2"
//                             onClick={() => handleRemove(item.listing._id)}
//                           >
//                             <Trash2 size={16} />
//                             <span className="hidden sm:inline">
//                               Remove Item
//                             </span>
//                           </Button>
//                         </div>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
//               );
//             })}
//           </div>

//           {/* RIGHT: Price Summary */}
//           <div className="lg:col-span-4 space-y-4 sticky top-24">
//             {/* Coupons Section */}
//             <Card className="border-none shadow-sm">
//               <CardContent className="p-4">
//                 <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-3">
//                   Offers & Coupons
//                 </p>
//                 <div className="flex items-center justify-between group cursor-pointer">
//                   <div className="flex items-center gap-3">
//                     <TicketPercent className="text-primary" size={20} />
//                     <span className="text-sm font-bold text-slate-700">
//                       Apply Coupon Code
//                     </span>
//                   </div>
//                   <Button
//                     variant="ghost"
//                     size="sm"
//                     className="text-primary font-bold hover:bg-primary/5"
//                   >
//                     APPLY
//                   </Button>
//                 </div>
//               </CardContent>
//             </Card>

//             <Card className="border-none shadow-sm">
//               <CardContent className="p-6">
//                 <h2 className="text-lg font-bold text-slate-900 mb-6">
//                   Price Details ({cart.items.length} Items)
//                 </h2>

//                 <div className="space-y-4 text-slate-600 font-medium text-sm">
//                   <div className="flex justify-between">
//                     <span>Total MRP</span>
//                     <span className="text-slate-900">
//                       ₹{subtotal.toLocaleString()}
//                     </span>
//                   </div>

//                   <div className="flex justify-between">
//                     <span className="flex items-center gap-2">
//                       Shipping Fee
//                       <Info size={14} className="text-slate-300 cursor-help" />
//                     </span>
//                     <span>
//                       {shipping === 0 ? (
//                         <span className="text-emerald-600 font-bold">FREE</span>
//                       ) : (
//                         `₹${shipping}`
//                       )}
//                     </span>
//                   </div>

//                   <div className="flex justify-between">
//                     <span className="flex items-center gap-1.5">
//                       Convenience Fee
//                       <Badge
//                         variant="outline"
//                         className="text-[9px] h-4 px-1 font-normal"
//                       >
//                         SECURE
//                       </Badge>
//                     </span>
//                     <span className="text-slate-900 font-bold">
//                       ₹{CONVENIENCE_FEE}
//                     </span>
//                   </div>

//                   <Separator className="my-6" />

//                   <div className="flex justify-between items-end mb-8">
//                     <div className="flex flex-col gap-0.5">
//                       <span className="text-base font-bold text-slate-900">
//                         Total Amount
//                       </span>
//                       <span className="text-[10px] text-emerald-600 font-bold uppercase">
//                         You are saving ₹100 on this order
//                       </span>
//                     </div>
//                     <span className="text-2xl font-black text-slate-900 tracking-tight">
//                       ₹{total.toLocaleString()}
//                     </span>
//                   </div>

//                   <Button
//                     onClick={() => {
//                       localStorage.setItem(
//                         "checkout_cart",
//                         JSON.stringify(cart),
//                       );
//                       router.push("/checkout");
//                     }}
//                     className="w-full h-14 rounded-xl text-lg font-bold shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all hover:-translate-y-0.5"
//                   >
//                     PLACE ORDER
//                   </Button>

//                   <div className="pt-6 space-y-4">
//                     <div className="flex items-start gap-3">
//                       <ShieldCheck
//                         size={20}
//                         className="text-emerald-600 shrink-0"
//                       />
//                       <div>
//                         <p className="text-[11px] font-bold text-slate-800">
//                           Secure Payment
//                         </p>
//                         <p className="text-[10px] text-slate-500">
//                           Your data is encrypted and 100% safe with us.
//                         </p>
//                       </div>
//                     </div>
//                     <div className="flex items-start gap-3">
//                       <Truck size={20} className="text-blue-600 shrink-0" />
//                       <div>
//                         <p className="text-[11px] font-bold text-slate-800">
//                           Fast Delivery
//                         </p>
//                         <p className="text-[10px] text-slate-500">
//                           Free delivery on orders above ₹1,000.
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>

//             <p className="text-[10px] text-center text-slate-400 px-4">
//               By placing the order, you agree to our{" "}
//               <span className="underline cursor-pointer">Terms of Service</span>{" "}
//               and{" "}
//               <span className="underline cursor-pointer">Privacy Policy</span>.
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CartPage;


"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCart, updateCart, removeFromCart } from "@/services/cart";
import { Cart } from "@/types/cart";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ShieldCheck,
  Truck,
  Store,
  Calendar,
  TicketPercent,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

const CartPage = () => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const baseUrl = "http://localhost:5000";
  const CONVENIENCE_FEE = 50;
  const router = useRouter();

  const getDeliveryDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 4);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      weekday: "short",
    });
  };

  const fetchCart = async () => {
    try {
      const data = await getCart();
      setCart(data);
    } catch (err) {
      console.error("Cart fetch failed", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleUpdate = async (listingId: string, quantity: number) => {
    if (quantity < 1) return;
    try {
      await updateCart(listingId, quantity);
      fetchCart();
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  const handleRemove = async (listingId: string) => {
    try {
      await removeFromCart(listingId);
      fetchCart();
    } catch (err) {
      console.error("Remove failed", err);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-muted-foreground animate-pulse">Setting up your bag...</p>
        </div>
      </div>
    );

  if (!cart || cart.items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 flex flex-col items-center justify-center text-center">
        <div className="bg-slate-100 p-6 rounded-full mb-6">
          <ShoppingBag size={64} className="text-slate-400" />
        </div>
        <h2 className="text-3xl font-bold tracking-tight">Your bag is empty</h2>
        <Button className="mt-8 rounded-full px-10 h-12 text-base font-semibold" onClick={() => (window.location.href = "/")}>
          Start Shopping
        </Button>
      </div>
    );
  }

  // 🔥 PRICE CALCULATIONS
  // We use the 1.2 multiplier to simulate the Original MRP if it's not provided by backend
  const totalMRP = cart.items.reduce((sum, item) => sum + (item.priceAtAdd * 1.2) * item.quantity, 0);
  const subtotalSellingPrice = cart.items.reduce((sum, item) => sum + item.priceAtAdd * item.quantity, 0);
  const totalDiscount = totalMRP - subtotalSellingPrice;
  
  const shipping = subtotalSellingPrice > 1000 ? 0 : 100;
  const total = subtotalSellingPrice + shipping + CONVENIENCE_FEE;

  return (
    <div className="bg-slate-50/50 min-h-screen pb-20">
      <div className="max-w-7xl mx-auto px-4 md:px-6 pt-10">
        <div className="flex items-baseline gap-3 mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Shopping Bag</h1>
          <Badge variant="secondary" className="text-sm rounded-full px-3">
            {cart.items.length} {cart.items.length === 1 ? "Item" : "Items"}
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: Items List */}
          <div className="lg:col-span-8 space-y-4">
            {cart.items.map((item) => {
              const product = item.listing.productId;
              const sellerName = item.listing.sellerId?.name || "Official Store";
              const imageUrl = product.images?.[0] ? `${baseUrl}${product.images[0]}` : "/placeholder.png";

              // Individual Item Pricing
              const itemSellingPrice = item.priceAtAdd;
              const itemMRP = Math.round(itemSellingPrice * 1.2);

              return (
                <Card key={item._id} className="border-none shadow-sm overflow-hidden transition-all hover:shadow-md">
                  <CardContent className="p-4 md:p-6">
                    <div className="flex gap-4 md:gap-6">
                      <div className="w-28 h-28 md:w-36 md:h-36 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-100">
                        <img src={imageUrl} alt={product.title} className="w-full h-full object-cover" />
                      </div>

                      <div className="grow flex flex-col justify-between py-1">
                        <div>
                          <div className="flex justify-between items-start gap-4">
                            <div className="min-w-0 flex-1">
                              <h3 className="font-bold text-lg text-slate-900 leading-tight truncate">{product.title}</h3>
                              <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-1">
                                <Store size={14} /> Sold by: <span className="font-semibold text-slate-700">{sellerName}</span>
                              </p>
                            </div>
                            
                            {/* 🔥 ITEM PRICE DISPLAY */}
                            <div className="text-right">
                              <div className="flex flex-col items-end">
                                <p className="font-black text-xl text-slate-900">
                                  ₹{(itemSellingPrice * item.quantity).toLocaleString()}
                                </p>
                                <div className="flex items-center gap-2 mt-0.5">
                                  <span className="text-xs text-slate-400 line-through">
                                    ₹{(itemMRP * item.quantity).toLocaleString()}
                                  </span>
                                  <span className="text-[10px] font-black text-red-500 uppercase">
                                    20% OFF
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="mt-4 flex items-center gap-2 text-[11px] font-bold text-emerald-700 bg-emerald-50 w-fit px-2.5 py-1.5 rounded-lg border border-emerald-100">
                            <Calendar size={14} /> Delivery by <span className="ml-0.5">{getDeliveryDate()}</span>
                          </div>
                        </div>

                        <div className="flex justify-between items-center mt-6 pt-4 border-t border-slate-50">
                          <div className="flex items-center bg-slate-100 rounded-xl p-1 shadow-inner">
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-white" onClick={() => handleUpdate(item.listing._id, item.quantity - 1)}>
                              <Minus size={14} />
                            </Button>
                            <span className="w-10 text-center text-sm font-black">{item.quantity}</span>
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-white" onClick={() => handleUpdate(item.listing._id, item.quantity + 1)}>
                              <Plus size={14} />
                            </Button>
                          </div>

                          <Button variant="ghost" size="sm" className="text-slate-400 hover:text-destructive transition-all gap-2" onClick={() => handleRemove(item.listing._id)}>
                            <Trash2 size={16} />
                            <span className="hidden sm:inline">Remove Item</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* RIGHT: Price Summary */}
          <div className="lg:col-span-4 space-y-4 sticky top-24">
            <Card className="border-none shadow-sm">
              <CardContent className="p-4">
                <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-3">Offers & Coupons</p>
                <div className="flex items-center justify-between group cursor-pointer">
                  <div className="flex items-center gap-3">
                    <TicketPercent className="text-primary" size={20} />
                    <span className="text-sm font-bold text-slate-700">Apply Coupon Code</span>
                  </div>
                  <Button variant="ghost" size="sm" className="text-primary font-bold">APPLY</Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm">
              <CardContent className="p-6">
                <h2 className="text-lg font-bold text-slate-900 mb-6">Price Details ({cart.items.length} Items)</h2>

                <div className="space-y-4 text-slate-600 font-medium text-sm">
                  <div className="flex justify-between">
                    <span>Total MRP</span>
                    <span className="text-slate-400 line-through font-normal">₹{Math.round(totalMRP).toLocaleString()}</span>
                  </div>

                  {/* 🔥 DISCOUNT SECTION */}
                  <div className="flex justify-between">
                    <span>Discount on MRP</span>
                    <span className="text-emerald-600 font-bold">- ₹{Math.round(totalDiscount).toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="flex items-center gap-2">Shipping Fee <Info size={14} className="text-slate-300" /></span>
                    <span>{shipping === 0 ? <span className="text-emerald-600 font-bold">FREE</span> : `₹${shipping}`}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="flex items-center gap-1.5">Convenience Fee <Badge variant="outline" className="text-[9px] h-4 px-1">SECURE</Badge></span>
                    <span className="text-slate-900 font-bold">₹{CONVENIENCE_FEE}</span>
                  </div>

                  <Separator className="my-6" />

                  <div className="flex justify-between items-end mb-8">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-base font-bold text-slate-900">Total Amount</span>
                      <span className="text-[10px] text-emerald-600 font-bold uppercase">
                        You are saving ₹{Math.round(totalDiscount).toLocaleString()} on this order
                      </span>
                    </div>
                    <span className="text-2xl font-black text-slate-900 tracking-tight">₹{total.toLocaleString()}</span>
                  </div>

                  <Button
                    onClick={() => {
                      localStorage.setItem("checkout_cart", JSON.stringify(cart));
                      router.push("/checkout");
                    }}
                    className="w-full h-14 rounded-xl text-lg font-bold shadow-xl shadow-slate-200 transition-all active:scale-95 bg-slate-900 hover:bg-slate-800"
                  >
                    PLACE ORDER
                  </Button>

                  <div className="pt-6 space-y-4 opacity-80">
                    <div className="flex items-start gap-3">
                      <ShieldCheck size={20} className="text-emerald-600 shrink-0" />
                      <div>
                        <p className="text-[11px] font-bold text-slate-800">Secure Payment</p>
                        <p className="text-[10px] text-slate-500">Your data is encrypted and 100% safe.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;