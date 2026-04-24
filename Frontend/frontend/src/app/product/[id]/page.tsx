// "use client";

// import { useEffect, useState } from "react";
// import { useParams } from "next/navigation";
// import { addToCart } from "@/services/cart";
// import { getProductById } from "@/services/product";
// import SimilarProducts from "@/components/productPage/SimilarProducts";
// import { ProductDetail, Listing } from "@/types/product";

// import {
//   ShoppingCart,
//   ShieldCheck,
//   Truck,
//   Star,
//   Store,
//   ChevronRight,
//   CheckCircle2,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Separator } from "@/components/ui/separator";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import toast from "react-hot-toast"; // ✅ added

// const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// const ProductPage = () => {
//   const { id } = useParams();
//   const [product, setProduct] = useState<ProductDetail | null>(null);
//   const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [currentImage, setCurrentImage] = useState(0);

//   useEffect(() => {
//     const fetchProduct = async () => {
//       try {
//         if (!id) return;

//         const data = await getProductById(id as string);
//         setProduct(data);

//         if (data.listings.length) {
//           const cheapest = [...data.listings].sort(
//             (a, b) => a.price - b.price,
//           )[0];
//           setSelectedListing(cheapest);
//         }
//       } catch (err) {
//         console.error(err);
//         toast.error("Failed to load product"); // ✅ added
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProduct();
//   }, [id]);

//   useEffect(() => {
//     window.scrollTo(0, 0);
//   }, [id]);

//   const handleAddToCart = async (listing: Listing) => {
//     try {
//       await addToCart(listing._id, 1);
//       toast.success("Added to your bag"); // ✅ replaced alert
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to add to cart"); // ✅ added
//     }
//   };

//   if (loading)
//     return (
//       <div className="min-h-screen flex items-center justify-center animate-pulse text-muted-foreground">
//         Loading Product Details...
//       </div>
//     );

//   if (!product)
//     return (
//       <div className="p-20 text-center text-slate-500 font-bold">
//         Product not found
//       </div>
//     );

//   const validImages = product.images.filter((img) => img && img.trim() !== "");

//   return (
//     <div className="bg-white min-h-screen">
//       <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
//         {/* Breadcrumbs */}
//         <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-8 uppercase tracking-widest font-bold">
//           <span>Home</span> <ChevronRight size={12} />
//           <span>Catalog</span> <ChevronRight size={12} />
//           <span className="text-slate-900 line-clamp-1">{product.title}</span>
//         </nav>

//         <div className="grid lg:grid-cols-12 gap-12 items-start">
//           {/* LEFT: IMAGE GALLERY (Sticky on Desktop) */}
//           <div className="lg:col-span-7 lg:sticky lg:top-24">
//             <div className="space-y-4">
//               <div className="aspect-square bg-slate-50 rounded-3xl overflow-hidden border border-slate-100">
//                 <img
//                   src={
//                     validImages[currentImage]
//                       ? `${BASE_URL}${validImages[currentImage]}`
//                       : "/placeholder.png"
//                   }
//                   alt={product.title}
//                   className="w-full h-full object-contain mix-blend-multiply hover:scale-105 transition-transform duration-500"
//                 />
//               </div>

//               <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
//                 {validImages.map((img, i) => (
//                   <button
//                     key={i}
//                     onClick={() => setCurrentImage(i)}
//                     className={`relative min-w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
//                       currentImage === i
//                         ? "border-slate-900 ring-2 ring-slate-100"
//                         : "border-transparent opacity-60 hover:opacity-100"
//                     }`}
//                   >
//                     <img
//                       src={`${BASE_URL}${img}`}
//                       className="w-full h-full object-cover"
//                       alt="thumbnail"
//                     />
//                   </button>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* RIGHT: DETAILS SECTION */}
//           <div className="lg:col-span-5 space-y-8">
//             <div className="space-y-2">
//               <div className="flex items-center gap-2">
//                 <Badge
//                   variant="secondary"
//                   className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50 border-none px-3 font-bold"
//                 >
//                   In Stock
//                 </Badge>
//                 <div className="flex items-center gap-1 text-sm font-bold text-slate-700 ml-auto">
//                   <Star size={16} className="fill-amber-400 text-amber-400" />
//                   4.8{" "}
//                   <span className="text-muted-foreground font-medium underline">
//                     (1.2k Reviews)
//                   </span>
//                 </div>
//               </div>
//               <h1 className="text-4xl font-black tracking-tight text-slate-900 leading-tight">
//                 {product.title}
//               </h1>
//               <p className="text-muted-foreground leading-relaxed">
//                 {product.description}
//               </p>
//             </div>

//             <div className="space-y-4">
//               <div className="flex items-baseline gap-3">
//                 <span className="text-4xl font-black text-slate-900">
//                   ₹{selectedListing?.price.toLocaleString()}
//                 </span>
//                 <span className="text-xl text-muted-foreground line-through decoration-slate-300">
//                   ₹{(selectedListing?.price! * 1.2).toFixed(0)}
//                 </span>
//                 <Badge className="bg-slate-900 text-white rounded-md">
//                   Save 20%
//                 </Badge>
//               </div>
//               <div className="flex items-center gap-2 text-sm font-medium text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
//                 <Store size={18} className="text-slate-400" />
//                 Sold by{" "}
//                 <span className="text-slate-900 font-bold">
//                   {selectedListing?.sellerName}
//                 </span>
//                 {/* Choose Seller Modal */}
//                 <Dialog>
//                   <DialogTrigger asChild>
//                     <Button
//                       variant="link"
//                       size="sm"
//                       className="ml-auto text-primary p-0 h-auto font-bold"
//                     >
//                       View all sellers
//                     </Button>
//                   </DialogTrigger>
//                   <DialogContent className="max-w-md rounded-3xl">
//                     <DialogHeader>
//                       <DialogTitle className="text-2xl font-bold">
//                         Available Sellers
//                       </DialogTitle>
//                     </DialogHeader>
//                     <div className="space-y-3 mt-4">
//                       {product.listings.map((listing) => (
//                         <div
//                           key={listing._id}
//                           onClick={() => setSelectedListing(listing)}
//                           className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
//                             selectedListing?._id === listing._id
//                               ? "border-slate-900 bg-slate-50 ring-2 ring-slate-100"
//                               : "border-slate-100 hover:border-slate-200"
//                           }`}
//                         >
//                           <div className="flex justify-between items-center">
//                             <div>
//                               <p className="font-bold text-slate-900">
//                                 {listing.sellerName}
//                               </p>
//                               <p className="text-xs text-muted-foreground">
//                                 Stock: {listing.stock} units left
//                               </p>
//                             </div>
//                             <p className="font-black text-lg">
//                               ₹{listing.price}
//                             </p>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </DialogContent>
//                 </Dialog>
//               </div>
//             </div>

//             <div className="flex gap-4">
//               <Button
//                 disabled={!selectedListing}
//                 onClick={() =>
//                   selectedListing && handleAddToCart(selectedListing)
//                 }
//                 className="flex-1 h-14 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-lg font-bold transition-all active:scale-95 shadow-xl shadow-slate-200"
//               >
//                 <ShoppingCart className="mr-2 h-5 w-5" /> Add to Bag
//               </Button>
//             </div>

//             <Separator className="my-10" />

//             {/* Delivery & Trust Info */}
//             <div className="grid grid-cols-2 gap-6">
//               <div className="flex gap-3">
//                 <div className="bg-slate-100 p-2.5 rounded-full h-fit">
//                   <Truck size={20} className="text-slate-700" />
//                 </div>
//                 <div>
//                   <p className="text-xs font-bold text-slate-900 uppercase tracking-tighter">
//                     Fast Delivery
//                   </p>
//                   <p className="text-[11px] text-muted-foreground">
//                     3-5 Business Days
//                   </p>
//                 </div>
//               </div>
//               <div className="flex gap-3">
//                 <div className="bg-slate-100 p-2.5 rounded-full h-fit">
//                   <ShieldCheck size={20} className="text-slate-700" />
//                 </div>
//                 <div>
//                   <p className="text-xs font-bold text-slate-900 uppercase tracking-tighter">
//                     Secure Checkout
//                   </p>
//                   <p className="text-[11px] text-muted-foreground">
//                     Encrypted Transactions
//                   </p>
//                 </div>
//               </div>
//             </div>

//             {/* Tabs for extra details */}
//             <Tabs defaultValue="details" className="w-full mt-10">
//               <TabsList className="w-full bg-transparent border-b rounded-none h-12 p-0 gap-8">
//                 <TabsTrigger
//                   value="details"
//                   className="rounded-none border-b-2 border-transparent data-[state=active]:border-slate-900 data-[state=active]:bg-transparent font-bold text-sm"
//                 >
//                   Product Details
//                 </TabsTrigger>
//                 <TabsTrigger
//                   value="shipping"
//                   className="rounded-none border-b-2 border-transparent data-[state=active]:border-slate-900 data-[state=active]:bg-transparent font-bold text-sm"
//                 >
//                   Shipping Policy
//                 </TabsTrigger>
//               </TabsList>
//               <TabsContent
//                 value="details"
//                 className="py-6 text-sm text-muted-foreground leading-relaxed"
//               >
//                 Experience high-end quality with {product.title}. Carefully
//                 sourced and quality-checked by our top-tier sellers.
//                 <ul className="mt-4 space-y-2">
//                   <li className="flex items-center gap-2">
//                     <CheckCircle2 size={14} className="text-emerald-500" />{" "}
//                     Premium Grade Materials
//                   </li>
//                   <li className="flex items-center gap-2">
//                     <CheckCircle2 size={14} className="text-emerald-500" />{" "}
//                     Authenticity Guaranteed
//                   </li>
//                 </ul>
//               </TabsContent>
//               <TabsContent
//                 value="shipping"
//                 className="py-6 text-sm text-muted-foreground"
//               >
//                 We offer standard shipping to all regions. Returns are accepted
//                 within 7 days of delivery.
//               </TabsContent>
//             </Tabs>
//           </div>
//         </div>

//         {/* Similar Products */}
//         <SimilarProducts
//           product={{
//             _id: product._id,
//             categoryId: product.categoryId,
//             subCategoryId: product.subCategoryId,
//           }}
//         />
//       </div>
//     </div>
//   );
// };

// export default ProductPage;


"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { addToCart } from "@/services/cart";
import { getProductById } from "@/services/product";
import SimilarProducts from "@/components/productPage/SimilarProducts";
import { ProductDetail, Listing } from "@/types/product";

import {
  ShoppingCart,
  ShieldCheck,
  Truck,
  Star,
  Store,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import toast from "react-hot-toast"; // ✅ added

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const ProductPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (!id) return;

        const data = await getProductById(id as string);
        setProduct(data);

        if (data.listings.length) {
          const cheapest = [...data.listings].sort(
            (a, b) => a.price - b.price,
          )[0];
          setSelectedListing(cheapest);
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load product"); // ✅ added
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const handleAddToCart = async (listing: Listing) => {
    try {
      await addToCart(listing._id, 1);
      toast.success("Added to your bag"); // ✅ replaced alert
    } catch (err) {
      console.error(err);
      toast.error("Failed to add to cart"); // ✅ added
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center animate-pulse text-muted-foreground">
        Loading Product Details...
      </div>
    );

  if (!product)
    return (
      <div className="p-20 text-center text-slate-500 font-bold">
        Product not found
      </div>
    );

  const validImages = product.images.filter((img) => img && img.trim() !== "");

    return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 md:py-8">
        {/* Breadcrumbs - Hidden on very small screens */}
        <nav className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground mb-6 uppercase tracking-widest font-bold">
          <span>Home</span> <ChevronRight size={12} />
          <span>Catalog</span> <ChevronRight size={12} />
          <span className="text-slate-900 line-clamp-1">{product.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* LEFT: IMAGE GALLERY */}
          <div className="lg:col-span-7 lg:sticky lg:top-24">
            <div className="flex flex-col gap-4">
              {/* Main Image Container */}
              <div className="aspect-square sm:aspect-4/5 lg:aspect-square bg-slate-50 rounded-2xl md:rounded-3xl overflow-hidden border border-slate-100 flex items-center justify-center">
                <img
                  src={
                    validImages[currentImage]
                      ? `${BASE_URL}${validImages[currentImage]}`
                      : "/placeholder.png"
                  }
                  alt={product.title}
                  className="w-full h-full object-contain mix-blend-multiply hover:scale-105 transition-transform duration-500 p-4"
                />
              </div>

              {/* Thumbnails */}
              <div className="flex gap-2 sm:gap-4 overflow-x-auto pb-2 scrollbar-hide">
                {validImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentImage(i)}
                    className={`relative min-w-17.5 h-17.5 sm:min-w-20 sm:h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                      currentImage === i
                        ? "border-slate-900 ring-2 ring-slate-100"
                        : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={`${BASE_URL}${img}`}
                      className="w-full h-full object-cover"
                      alt="thumbnail"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: DETAILS SECTION */}
          <div className="lg:col-span-5 space-y-6 md:space-y-8">
            <div className="space-y-3">
              <div className="flex items-center justify-between lg:justify-start lg:gap-4">
                <Badge
                  variant="secondary"
                  className="bg-emerald-50 text-emerald-700 border-none px-3 font-bold"
                >
                  In Stock
                </Badge>
                <div className="flex items-center gap-1 text-sm font-bold text-slate-700 ml-auto lg:ml-0">
                  <Star size={16} className="fill-amber-400 text-amber-400" />
                  4.8{" "}
                  <span className="text-muted-foreground font-medium underline">
                    (1.2k)
                  </span>
                </div>
              </div>
              <h1 className="text-2xl md:text-4xl font-black tracking-tight text-slate-900 leading-tight">
                {product.title}
              </h1>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl md:text-4xl font-black text-slate-900">
                  ₹{selectedListing?.price.toLocaleString()}
                </span>
                <span className="text-lg md:text-xl text-muted-foreground line-through decoration-slate-300">
                  ₹{(selectedListing?.price! * 1.2).toFixed(0)}
                </span>
                <Badge className="bg-slate-900 text-white rounded-md">
                  Save 20%
                </Badge>
              </div>

              {/* Seller Information */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm font-medium text-slate-600 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-2">
                  <Store size={18} className="text-slate-400" />
                  <span>
                    Sold by{" "}
                    <span className="text-slate-900 font-bold">
                      {selectedListing?.sellerName}
                    </span>
                  </span>
                </div>
                
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="link"
                      size="sm"
                      className="text-primary p-0 h-auto font-bold sm:ml-auto w-fit"
                    >
                      View all sellers
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-[90vw] sm:max-w-md rounded-2xl md:rounded-3xl">
                    <DialogHeader>
                      <DialogTitle className="text-xl md:text-2xl font-bold text-left">
                        Available Sellers
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-3 mt-4 max-h-[60vh] overflow-y-auto pr-1">
                      {product.listings.map((listing) => (
                        <div
                          key={listing._id}
                          onClick={() => setSelectedListing(listing)}
                          className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                            selectedListing?._id === listing._id
                              ? "border-slate-900 bg-slate-50 ring-2 ring-slate-100"
                              : "border-slate-100 hover:border-slate-200"
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-bold text-slate-900">
                                {listing.sellerName}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Stock: {listing.stock} left
                              </p>
                            </div>
                            <p className="font-black text-lg">
                              ₹{listing.price}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            <div className="flex gap-4">
              <Button
                disabled={!selectedListing}
                onClick={() =>
                  selectedListing && handleAddToCart(selectedListing)
                }
                className="flex-1 h-14 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-lg font-bold transition-all active:scale-95 shadow-xl shadow-slate-200"
              >
                <ShoppingCart className="mr-2 h-5 w-5" /> Add to Bag
              </Button>
            </div>

            <Separator className="my-6 md:my-10" />

            {/* Delivery & Trust Info */}
            <div className="grid grid-cols-1 xs:grid-cols-2 gap-4 md:gap-6">
              <div className="flex items-center gap-3">
                <div className="bg-slate-100 p-2.5 rounded-full h-fit shrink-0">
                  <Truck size={20} className="text-slate-700" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 uppercase tracking-tighter">
                    Fast Delivery
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    3-5 Business Days
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-slate-100 p-2.5 rounded-full h-fit shrink-0">
                  <ShieldCheck size={20} className="text-slate-700" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 uppercase tracking-tighter">
                    Secure Checkout
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Encrypted Transactions
                  </p>
                </div>
              </div>
            </div>

            {/* Tabs for extra details */}
            <Tabs defaultValue="details" className="w-full mt-6 md:mt-10">
              <TabsList className="w-full bg-transparent border-b rounded-none h-auto p-0 flex justify-start sm:justify-center overflow-x-auto no-scrollbar">
                <TabsTrigger
                  value="details"
                  className="px-4 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-slate-900 data-[state=active]:bg-transparent font-bold text-sm whitespace-nowrap"
                >
                  Product Details
                </TabsTrigger>
                <TabsTrigger
                  value="shipping"
                  className="px-4 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-slate-900 data-[state=active]:bg-transparent font-bold text-sm whitespace-nowrap"
                >
                  Shipping Policy
                </TabsTrigger>
              </TabsList>
              <TabsContent
                value="details"
                className="py-6 text-sm text-muted-foreground leading-relaxed"
              >
                Experience high-end quality with {product.title}. Carefully
                sourced and quality-checked by our top-tier sellers.
                <ul className="mt-4 space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-emerald-500" />{" "}
                    Premium Grade Materials
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-emerald-500" />{" "}
                    Authenticity Guaranteed
                  </li>
                </ul>
              </TabsContent>
              <TabsContent
                value="shipping"
                className="py-6 text-sm text-muted-foreground"
              >
                We offer standard shipping to all regions. Returns are accepted
                within 7 days of delivery.
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Similar Products */}
        <div className="mt-12 md:mt-20">
          <SimilarProducts
            product={{
              _id: product._id,
              categoryId: product.categoryId,
              subCategoryId: product.subCategoryId,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
