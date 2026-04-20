// // "use client";

// // import { useEffect, useState } from "react";
// // import { getCart, updateCart, removeFromCart } from "@/services/cart";
// // import { Cart } from "@/types/cart";
// // import { Trash2, Plus, Minus, ShoppingBag, ShieldCheck, Truck } from "lucide-react";
// // import { Button } from "@/components/ui/button";
// // import { Card, CardContent } from "@/components/ui/card";
// // import { Separator } from "@/components/ui/separator";
// // import { Badge } from "@/components/ui/badge";

// // const CartPage = () => {
// //   const [cart, setCart] = useState<Cart | null>(null);
// //   const [loading, setLoading] = useState(true);
// //   const baseUrl = "http://localhost:5000";

// //   const fetchCart = async () => {
// //     try {
// //       const data = await getCart();
// //       setCart(data);
// //     } catch (err) {
// //       console.error("Cart fetch failed", err);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   useEffect(() => {
// //     fetchCart();
// //   }, []);

// //   const handleUpdate = async (listingId: string, quantity: number) => {
// //     if (quantity < 1) return;
// //     try {
// //       await updateCart(listingId, quantity);
// //       fetchCart();
// //     } catch (err) {
// //       console.error("Update failed", err);
// //     }
// //   };

// //   const handleRemove = async (listingId: string) => {
// //     try {
// //       await removeFromCart(listingId);
// //       fetchCart();
// //     } catch (err) {
// //       console.error("Remove failed", err);
// //     }
// //   };

// //   if (loading) {
// //     return (
// //       <div className="flex items-center justify-center min-h-[60vh]">
// //         <div className="animate-pulse text-lg font-medium text-muted-foreground">
// //           Loading your bag...
// //         </div>
// //       </div>
// //     );
// //   }

// //   if (!cart || cart.items.length === 0) {
// //     return (
// //       <div className="max-w-7xl mx-auto px-4 py-20 flex flex-col items-center justify-center text-center">
// //         <div className="bg-muted rounded-full p-6 mb-4">
// //           <ShoppingBag size={48} className="text-muted-foreground" />
// //         </div>
// //         <h2 className="text-2xl font-bold tracking-tight">Your bag is empty</h2>
// //         <p className="text-muted-foreground mt-2 max-w-sm">
// //           Looks like you haven't added anything to your cart yet. Start exploring our latest arrivals!
// //         </p>
// //         <Button className="mt-6 rounded-full px-8" size="lg">
// //           Explore Products
// //         </Button>
// //       </div>
// //     );
// //   }

// //   const subtotal = cart.items.reduce((sum, item) => sum + item.priceAtAdd * item.quantity, 0);
// //   const shipping = subtotal > 1000 ? 0 : 100;
// //   const total = subtotal + shipping;

// //   return (
// //     <div className="bg-slate-50/50 min-h-screen pb-20">
// //       <div className="max-w-7xl mx-auto px-4 md:px-6 pt-10">
// //         <div className="flex items-baseline gap-4 mb-8">
// //           <h1 className="text-3xl font-bold tracking-tight text-slate-900">Shopping Bag</h1>
// //           <span className="text-muted-foreground">({cart.items.length} Items)</span>
// //         </div>

// //         <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
// //           {/* LEFT: Items List */}
// //           <div className="lg:col-span-8 space-y-4">
// //             {cart.items.map((item) => {
// //               const product = item.listing.productId;
// //               const imageUrl = product.images?.[0] ? `${baseUrl}${product.images[0]}` : "/api/placeholder/400/400";

// //               return (
// //                 <Card key={item._id} className="overflow-hidden border-none shadow-sm hover:shadow-md transition-shadow">
// //                   <CardContent className="p-4 md:p-6">
// //                     <div className="flex gap-4 md:gap-6">
// //                       {/* Product Image */}
// //                       <div className="w-24 h-24 md:w-32 md:h-32 rounded-lg overflow-hidden bg-slate-100 shrink-0">
// //                         <img
// //                           src={imageUrl}
// //                           alt={product.title}
// //                           className="w-full h-full object-cover"
// //                           onError={(e) => (e.currentTarget.src = "https://via.placeholder.com/150")}
// //                         />
// //                       </div>

// //                       {/* Product Details */}
// //                       <div className="grow flex flex-col justify-between">
// //                         <div>
// //                           <div className="flex justify-between items-start">
// //                             <h3 className="font-semibold text-lg text-slate-900 leading-tight">
// //                               {product.title}
// //                             </h3>
// //                             <p className="font-bold text-lg text-slate-900">
// //                               ₹{(item.priceAtAdd * item.quantity).toLocaleString()}
// //                             </p>
// //                           </div>
// //                           <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
// //                             Sold by: <span className="text-primary font-medium">Official Store</span>
// //                           </p>
// //                           {item.listing.stock < 5 && (
// //                             <Badge variant="destructive" className="mt-2 text-[10px] uppercase">
// //                               Only {item.listing.stock} left
// //                             </Badge>
// //                           )}
// //                         </div>

// //                         <div className="flex justify-between items-center mt-4">
// //                           {/* Stepper Quantity */}
// //                           <div className="flex items-center bg-slate-100 rounded-full p-1">
// //                             <Button
// //                               variant="ghost"
// //                               size="icon"
// //                               className="h-8 w-8 rounded-full hover:bg-white"
// //                               onClick={() => handleUpdate(item.listing._id, item.quantity - 1)}
// //                             >
// //                               <Minus size={14} />
// //                             </Button>
// //                             <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
// //                             <Button
// //                               variant="ghost"
// //                               size="icon"
// //                               className="h-8 w-8 rounded-full hover:bg-white"
// //                               onClick={() => handleUpdate(item.listing._id, item.quantity + 1)}
// //                             >
// //                               <Plus size={14} />
// //                             </Button>
// //                           </div>

// //                           <Button
// //                             variant="ghost"
// //                             size="sm"
// //                             className="text-muted-foreground hover:text-destructive transition-colors gap-2"
// //                             onClick={() => handleRemove(item.listing._id)}
// //                           >
// //                             <Trash2 size={16} />
// //                             <span className="hidden sm:inline">Remove</span>
// //                           </Button>
// //                         </div>
// //                       </div>
// //                     </div>
// //                   </CardContent>
// //                 </Card>
// //               );
// //             })}
// //           </div>

// //           {/* RIGHT: Price Summary */}
// //           <div className="lg:col-span-4">
// //             <Card className="border-none shadow-sm sticky top-24">
// //               <CardContent className="p-6">
// //                 <h2 className="text-xl font-bold mb-6">Order Summary</h2>
                
// //                 <div className="space-y-4">
// //                   <div className="flex justify-between text-slate-600">
// //                     <span>Bag Total</span>
// //                     <span>₹{subtotal.toLocaleString()}</span>
// //                   </div>
// //                   <div className="flex justify-between text-slate-600">
// //                     <span className="flex items-center gap-2">
// //                       Shipping Fee <Truck size={14} />
// //                     </span>
// //                     <span>
// //                       {shipping === 0 ? (
// //                         <span className="text-green-600 font-bold">FREE</span>
// //                       ) : (
// //                         `₹${shipping}`
// //                       )}
// //                     </span>
// //                   </div>
                  
// //                   {shipping === 0 && (
// //                     <div className="bg-green-50 p-3 rounded-lg text-green-700 text-xs font-medium border border-green-100">
// //                       Yay! Your order is eligible for FREE Delivery.
// //                     </div>
// //                   )}

// //                   <Separator className="my-4" />

// //                   <div className="flex justify-between items-end mb-6">
// //                     <div className="flex flex-col">
// //                       <span className="text-base font-semibold">Total Amount</span>
// //                       <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Includes GST</span>
// //                     </div>
// //                     <span className="text-3xl font-black text-slate-900">
// //                       ₹{total.toLocaleString()}
// //                     </span>
// //                   </div>

// //                   <Button className="w-full h-14 rounded-xl text-lg font-bold shadow-lg shadow-primary/20 transition-transform active:scale-[0.98]">
// //                     Place Order
// //                   </Button>

// //                   <div className="mt-6 space-y-3">
// //                     <div className="flex items-center gap-3 text-xs text-muted-foreground">
// //                       <ShieldCheck size={18} className="text-green-600" />
// //                       <span>100% Secure Payments</span>
// //                     </div>
// //                     <div className="flex items-center gap-3 text-xs text-muted-foreground">
// //                       <Truck size={18} className="text-blue-600" />
// //                       <span>Easy Returns & Exchanges</span>
// //                     </div>
// //                   </div>
// //                 </div>
// //               </CardContent>
// //             </Card>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default CartPage;

// "use client";

// import { useEffect, useState } from "react";
// import { getCart, updateCart, removeFromCart } from "@/services/cart";
// import { Cart } from "@/types/cart";
// import { Trash2, Plus, Minus, ShoppingBag, ShieldCheck, Truck, Store } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { Separator } from "@/components/ui/separator";
// import { Badge } from "@/components/ui/badge";

// const CartPage = () => {
//   const [cart, setCart] = useState<Cart | null>(null);
//   const [loading, setLoading] = useState(true);
//   const baseUrl = "http://localhost:5000";

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

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-[60vh]">
//         <div className="animate-pulse text-lg font-medium text-muted-foreground">
//           Loading your bag...
//         </div>
//       </div>
//     );
//   }

//   if (!cart || cart.items.length === 0) {
//     return (
//       <div className="max-w-7xl mx-auto px-4 py-20 flex flex-col items-center justify-center text-center">
//         <div className="bg-muted rounded-full p-6 mb-4">
//           <ShoppingBag size={48} className="text-muted-foreground" />
//         </div>
//         <h2 className="text-2xl font-bold tracking-tight">Your bag is empty</h2>
//         <p className="text-muted-foreground mt-2 max-w-sm">
//           Looks like you haven't added anything to your cart yet. Start exploring our latest arrivals!
//         </p>
//         <Button className="mt-6 rounded-full px-8" size="lg">
//           Explore Products
//         </Button>
//       </div>
//     );
//   }

//   const subtotal = cart.items.reduce((sum, item) => sum + item.priceAtAdd * item.quantity, 0);
//   const shipping = subtotal > 1000 ? 0 : 100;
//   const total = subtotal + shipping;

//   return (
//     <div className="bg-slate-50/50 min-h-screen pb-20">
//       <div className="max-w-7xl mx-auto px-4 md:px-6 pt-10">
//         <div className="flex items-baseline gap-4 mb-8">
//           <h1 className="text-3xl font-bold tracking-tight text-slate-900">Shopping Bag</h1>
//           <span className="text-muted-foreground">({cart.items.length} Items)</span>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
//           {/* LEFT: Items List */}
//           <div className="lg:col-span-8 space-y-4">
//             {cart.items.map((item) => {
//               const product = item.listing.productId;
//               // 🔥 Access the populated seller name
//               const sellerName = item.listing.sellerId?.name || "Official Store";
//               const imageUrl = product.images?.[0] ? `${baseUrl}${product.images[0]}` : "/api/placeholder/400/400";

//               return (
//                 <Card key={item._id} className="overflow-hidden border-none shadow-sm hover:shadow-md transition-shadow">
//                   <CardContent className="p-4 md:p-6">
//                     <div className="flex gap-4 md:gap-6">
//                       {/* Product Image */}
//                       <div className="w-24 h-24 md:w-32 md:h-32 rounded-lg overflow-hidden bg-slate-100 shrink-0">
//                         <img
//                           src={imageUrl}
//                           alt={product.title}
//                           className="w-full h-full object-cover"
//                           onError={(e) => (e.currentTarget.src = "https://via.placeholder.com/150")}
//                         />
//                       </div>

//                       {/* Product Details */}
//                       <div className="grow flex flex-col justify-between">
//                         <div>
//                           <div className="flex justify-between items-start gap-2">
//                             <h3 className="font-semibold text-lg text-slate-900 leading-tight">
//                               {product.title}
//                             </h3>
//                             <p className="font-bold text-lg text-slate-900 whitespace-nowrap">
//                               ₹{(item.priceAtAdd * item.quantity).toLocaleString()}
//                             </p>
//                           </div>
                          
//                           {/* 🔥 UPDATED: Displaying the real seller name */}
//                           <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
//                             <Store size={12} className="text-primary" />
//                             Sold by: <span className="text-primary font-medium">{sellerName}</span>
//                           </p>

//                           {item.listing.stock < 5 && (
//                             <Badge variant="destructive" className="mt-2 text-[10px] uppercase h-5">
//                               Only {item.listing.stock} left
//                             </Badge>
//                           )}
//                         </div>

//                         <div className="flex justify-between items-center mt-4">
//                           {/* Stepper Quantity */}
//                           <div className="flex items-center bg-slate-100 rounded-full p-1">
//                             <Button
//                               variant="ghost"
//                               size="icon"
//                               className="h-8 w-8 rounded-full hover:bg-white"
//                               onClick={() => handleUpdate(item.listing._id, item.quantity - 1)}
//                             >
//                               <Minus size={14} />
//                             </Button>
//                             <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
//                             <Button
//                               variant="ghost"
//                               size="icon"
//                               className="h-8 w-8 rounded-full hover:bg-white"
//                               onClick={() => handleUpdate(item.listing._id, item.quantity + 1)}
//                             >
//                               <Plus size={14} />
//                             </Button>
//                           </div>

//                           <Button
//                             variant="ghost"
//                             size="sm"
//                             className="text-muted-foreground hover:text-destructive transition-colors gap-2"
//                             onClick={() => handleRemove(item.listing._id)}
//                           >
//                             <Trash2 size={16} />
//                             <span className="hidden sm:inline text-xs font-medium">Remove</span>
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
//           <div className="lg:col-span-4">
//             <Card className="border-none shadow-sm sticky top-24">
//               <CardContent className="p-6">
//                 <h2 className="text-xl font-bold mb-6">Order Summary</h2>
                
//                 <div className="space-y-4">
//                   <div className="flex justify-between text-slate-600">
//                     <span>Bag Total</span>
//                     <span>₹{subtotal.toLocaleString()}</span>
//                   </div>
//                   <div className="flex justify-between text-slate-600">
//                     <span className="flex items-center gap-2">
//                       Shipping Fee <Truck size={14} />
//                     </span>
//                     <span>
//                       {shipping === 0 ? (
//                         <span className="text-green-600 font-bold">FREE</span>
//                       ) : (
//                         `₹${shipping}`
//                       )}
//                     </span>
//                   </div>
                  
//                   {shipping === 0 && (
//                     <div className="bg-green-50 p-3 rounded-lg text-green-700 text-xs font-medium border border-green-100">
//                       Yay! Your order is eligible for FREE Delivery.
//                     </div>
//                   )}

//                   <Separator className="my-4" />

//                   <div className="flex justify-between items-end mb-6">
//                     <div className="flex flex-col">
//                       <span className="text-base font-semibold">Total Amount</span>
//                       <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Includes GST</span>
//                     </div>
//                     <span className="text-3xl font-black text-slate-900">
//                       ₹{total.toLocaleString()}
//                     </span>
//                   </div>

//                   <Button className="w-full h-14 rounded-xl text-lg font-bold shadow-lg shadow-primary/20 transition-transform active:scale-[0.98]">
//                     Place Order
//                   </Button>

//                   <div className="mt-6 space-y-3">
//                     <div className="flex items-center gap-3 text-xs text-muted-foreground">
//                       <ShieldCheck size={18} className="text-green-600" />
//                       <span>100% Secure Payments</span>
//                     </div>
//                     <div className="flex items-center gap-3 text-xs text-muted-foreground">
//                       <Truck size={18} className="text-blue-600" />
//                       <span>Easy Returns & Exchanges</span>
//                     </div>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CartPage;
"use client";

import { useEffect, useState } from "react";
import { getCart, updateCart, removeFromCart } from "@/services/cart";
import { Cart } from "@/types/cart";
import { 
  Trash2, Plus, Minus, ShoppingBag, ShieldCheck, 
  Truck, Store, Calendar, TicketPercent, Info 
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

  // 🔥 Helper to calculate expected delivery (e.g., 4 days from now)
  const getDeliveryDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 4);
    return date.toLocaleDateString("en-IN", { 
      day: "numeric", 
      month: "short", 
      weekday: "short" 
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

  if (loading) return (
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
        <p className="text-muted-foreground mt-2 max-w-sm">
          Everything looks a bit lonely here. Add some items to your bag and make it happy!
        </p>
        <Button className="mt-8 rounded-full px-10 h-12 text-base font-semibold" onClick={() => window.location.href = "/"}>
          Start Shopping
        </Button>
      </div>
    );
  }

  const subtotal = cart.items.reduce((sum, item) => sum + item.priceAtAdd * item.quantity, 0);
  const shipping = subtotal > 1000 ? 0 : 100;
  const total = subtotal + shipping + CONVENIENCE_FEE;

  return (
    <div className="bg-slate-50/50 min-h-screen pb-20">
      <div className="max-w-7xl mx-auto px-4 md:px-6 pt-10">
        <div className="flex items-baseline gap-3 mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Shopping Bag</h1>
          <Badge variant="secondary" className="text-sm rounded-full px-3">
            {cart.items.length} {cart.items.length === 1 ? 'Item' : 'Items'}
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: Items List */}
          <div className="lg:col-span-8 space-y-4">
            {cart.items.map((item) => {
              const product = item.listing.productId;
              const sellerName = item.listing.sellerId?.name || "Official Store";
              const imageUrl = product.images?.[0] ? `${baseUrl}${product.images[0]}` : "/placeholder.png";

              return (
                <Card key={item._id} className="border-none shadow-sm overflow-hidden transition-all hover:shadow-md">
                  <CardContent className="p-4 md:p-6">
                    <div className="flex gap-4 md:gap-6">
                      {/* Image container */}
                      <div className="w-28 h-28 md:w-36 md:h-36 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-100">
                        <img src={imageUrl} alt={product.title} className="w-full h-full object-cover transition-transform hover:scale-105" />
                      </div>

                      {/* Content details */}
                      <div className="grow flex flex-col justify-between py-1">
                        <div>
                          <div className="flex justify-between items-start gap-4">
                            <div>
                              <h3 className="font-bold text-lg text-slate-900 leading-snug hover:text-primary cursor-pointer transition-colors">
                                {product.title}
                              </h3>
                              <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-1.5">
                                <Store size={14} className="text-slate-400" /> 
                                Sold by: <span className="font-semibold text-slate-700">{sellerName}</span>
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-black text-xl text-slate-900">₹{(item.priceAtAdd * item.quantity).toLocaleString()}</p>
                              {item.quantity > 1 && (
                                <p className="text-[10px] text-muted-foreground">₹{item.priceAtAdd.toLocaleString()} per unit</p>
                              )}
                            </div>
                          </div>
                          
                          <div className="mt-4 flex items-center gap-2 text-[11px] font-bold text-emerald-700 bg-emerald-50 w-fit px-2.5 py-1.5 rounded-lg border border-emerald-100">
                            <Calendar size={14} />
                            Delivery by <span className="ml-0.5">{getDeliveryDate()}</span>
                          </div>
                        </div>

                        <div className="flex justify-between items-center mt-6 pt-4 border-t border-slate-50">
                          <div className="flex items-center bg-slate-100 rounded-xl p-1 shadow-inner">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 rounded-lg hover:bg-white hover:shadow-sm" 
                              onClick={() => handleUpdate(item.listing._id, item.quantity - 1)}
                            >
                              <Minus size={14} />
                            </Button>
                            <span className="w-10 text-center text-sm font-black">{item.quantity}</span>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 rounded-lg hover:bg-white hover:shadow-sm" 
                              onClick={() => handleUpdate(item.listing._id, item.quantity + 1)}
                            >
                              <Plus size={14} />
                            </Button>
                          </div>
                          
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-slate-400 hover:text-destructive hover:bg-destructive/5 transition-all font-medium gap-2" 
                            onClick={() => handleRemove(item.listing._id)}
                          >
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
            {/* Coupons Section */}
            <Card className="border-none shadow-sm">
              <CardContent className="p-4">
                <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-3">Offers & Coupons</p>
                <div className="flex items-center justify-between group cursor-pointer">
                   <div className="flex items-center gap-3">
                     <TicketPercent className="text-primary" size={20} />
                     <span className="text-sm font-bold text-slate-700">Apply Coupon Code</span>
                   </div>
                   <Button variant="ghost" size="sm" className="text-primary font-bold hover:bg-primary/5">APPLY</Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm">
              <CardContent className="p-6">
                <h2 className="text-lg font-bold text-slate-900 mb-6">Price Details ({cart.items.length} Items)</h2>
                
                <div className="space-y-4 text-slate-600 font-medium text-sm">
                  <div className="flex justify-between">
                    <span>Total MRP</span>
                    <span className="text-slate-900">₹{subtotal.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="flex items-center gap-2">
                      Shipping Fee
                      <Info size={14} className="text-slate-300 cursor-help" />
                    </span>
                    <span>
                      {shipping === 0 ? (
                        <span className="text-emerald-600 font-bold">FREE</span>
                      ) : (
                        `₹${shipping}`
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="flex items-center gap-1.5">
                      Convenience Fee 
                      <Badge variant="outline" className="text-[9px] h-4 px-1 font-normal">SECURE</Badge>
                    </span>
                    <span className="text-slate-900 font-bold">₹{CONVENIENCE_FEE}</span>
                  </div>

                  <Separator className="my-6" />

                  <div className="flex justify-between items-end mb-8">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-base font-bold text-slate-900">Total Amount</span>
                      <span className="text-[10px] text-emerald-600 font-bold uppercase">You are saving ₹100 on this order</span>
                    </div>
                    <span className="text-2xl font-black text-slate-900 tracking-tight">₹{total.toLocaleString()}</span>
                  </div>

                  <Button className="w-full h-14 rounded-xl text-lg font-bold shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all hover:-translate-y-0.5">
                    PLACE ORDER
                  </Button>

                  <div className="pt-6 space-y-4">
                    <div className="flex items-start gap-3">
                      <ShieldCheck size={20} className="text-emerald-600 shrink-0" />
                      <div>
                        <p className="text-[11px] font-bold text-slate-800">Secure Payment</p>
                        <p className="text-[10px] text-slate-500">Your data is encrypted and 100% safe with us.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Truck size={20} className="text-blue-600 shrink-0" />
                      <div>
                        <p className="text-[11px] font-bold text-slate-800">Fast Delivery</p>
                        <p className="text-[10px] text-slate-500">Free delivery on orders above ₹1,000.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <p className="text-[10px] text-center text-slate-400 px-4">
              By placing the order, you agree to our <span className="underline cursor-pointer">Terms of Service</span> and <span className="underline cursor-pointer">Privacy Policy</span>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;