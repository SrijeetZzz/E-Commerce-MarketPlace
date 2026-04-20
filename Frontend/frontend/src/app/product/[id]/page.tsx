
// "use client";

// import { useEffect, useState } from "react";
// import { useParams } from "next/navigation";
// import { addToCart } from "@/services/cart";
// import { getProductById } from "@/services/product";
// import SimilarProducts from "@/components/productPage/SimilarProducts";

// import { ProductDetail, Listing } from "@/types/product";

// // 🔥 BASE URL (fix later with env)
// const BASE_URL = "http://localhost:5000";

// const ProductPage = () => {
//   const { id } = useParams();

//   const [product, setProduct] = useState<ProductDetail | null>(null);
//   const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
//   const [loading, setLoading] = useState(true);

//   const [currentImage, setCurrentImage] = useState(0);
//   const [showModal, setShowModal] = useState(false);

//   // 🔥 FETCH PRODUCT
//   useEffect(() => {
//     const fetchProduct = async () => {
//       try {
//         if (!id) return;

//         const data = await getProductById(id as string);

//         setProduct(data);

//         // AUTO SELECT CHEAPEST
//         if (data.listings.length) {
//           const cheapest = [...data.listings].sort(
//             (a, b) => a.price - b.price
//           )[0];

//           setSelectedListing(cheapest);
//         }
//       } catch (err) {
//         console.error("Failed to fetch product", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProduct();
//   }, [id]);

//   // 🔥 RESET IMAGE
//   useEffect(() => {
//     setCurrentImage(0);
//   }, [product?._id]);

//   // 🔥 SCROLL TOP
//   useEffect(() => {
//     window.scrollTo(0, 0);
//   }, [id]);

//   // 🔥 ADD TO CART
//   const handleAddToCart = async (listing: Listing) => {
//     try {
//       await addToCart(listing._id, 1);
//       alert("Added to cart");
//     } catch (err) {
//       console.error("Cart failed", err);
//     }
//   };

//   if (loading) return <p className="p-6">Loading...</p>;
//   if (!product) return <p className="p-6">Product not found</p>;

//   // 🔥 CLEAN IMAGES (remove empty strings)
//   const validImages = product.images.filter(
//     (img) => img && img.trim() !== ""
//   );

//   return (
//     <>
//       <div className="max-w-7xl mx-auto px-6 py-10">
//         <div className="grid md:grid-cols-2 gap-10">
          
//           {/* 🔥 IMAGE SECTION */}
//           <div>
//             <img
//               src={
//                 validImages[currentImage]
//                   ? `${BASE_URL}${validImages[currentImage]}`
//                   : "/placeholder.png"
//               }
//               alt={product.title}
//               className="w-full h-100 object-cover rounded-xl"
//             />

//             <div className="flex gap-2 mt-3 overflow-x-auto">
//               {validImages.map((img, i) => (
//                 <img
//                   key={i}
//                   src={`${BASE_URL}${img}`}
//                   onClick={() => setCurrentImage(i)}
//                   className={`w-16 h-16 object-cover rounded cursor-pointer border ${
//                     currentImage === i ? "border-purple-600" : ""
//                   }`}
//                 />
//               ))}
//             </div>
//           </div>

//           {/* 🔥 DETAILS */}
//           <div className="space-y-4">
//             <h1 className="text-3xl font-bold">{product.title}</h1>

//             <p className="text-gray-600">{product.description}</p>

//             <p className="text-2xl font-semibold text-purple-600">
//               ₹{selectedListing?.price ?? "N/A"}
//             </p>

//             <div className="flex gap-4">
//               <button
//                 onClick={() => setShowModal(true)}
//                 className="border px-5 py-2 rounded-lg hover:bg-gray-100"
//               >
//                 Choose Seller
//               </button>

//               <button
//                 disabled={!selectedListing}
//                 onClick={() =>
//                   selectedListing && handleAddToCart(selectedListing)
//                 }
//                 className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50"
//               >
//                 Add to Cart
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* 🔥 SIMILAR PRODUCTS */}
//         <SimilarProducts
//           product={{
//             _id: product._id,
//             categoryId: product.categoryId,
//             subCategoryId: product.subCategoryId,
//           }}
//         />
//       </div>

//       {/* 🔥 MODAL */}
//       {showModal && product && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center">
//           <div
//             className="absolute inset-0 bg-black/40"
//             onClick={() => setShowModal(false)}
//           />

//           <div className="relative bg-white w-full max-w-lg rounded-xl p-6 z-10">
//             <h2 className="text-xl font-semibold mb-4">Choose Seller</h2>

//             <div className="space-y-3 max-h-100 overflow-y-auto">
//               {product.listings.map((listing) => (
//                 <div
//                   key={listing._id}
//                   onClick={() => {
//                     setSelectedListing(listing);
//                     setShowModal(false);
//                   }}
//                   className={`border p-4 rounded-lg flex justify-between items-center cursor-pointer transition ${
//                     selectedListing?._id === listing._id
//                       ? "border-purple-600 bg-purple-50"
//                       : "hover:bg-gray-50"
//                   }`}
//                 >
//                   <div>
//                     <p className="font-medium">{listing.sellerName}</p>

//                     <p className="text-sm text-gray-500">
//                       Stock: {listing.stock}
//                     </p>

//                     <p className="text-xs text-gray-400">⭐ 4.2 rating</p>
//                   </div>

//                   <p className="font-semibold">₹{listing.price}</p>
//                 </div>
//               ))}
//             </div>

//             <button
//               onClick={() => setShowModal(false)}
//               className="mt-4 text-sm text-gray-500"
//             >
//               Cancel
//             </button>
//           </div>
//         </div>
//       )}
//     </>
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
  ShoppingCart, ShieldCheck, Truck, Star, 
  Store, ChevronRight, CheckCircle2, Info 
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

const BASE_URL = "http://localhost:5000";

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
          const cheapest = [...data.listings].sort((a, b) => a.price - b.price)[0];
          setSelectedListing(cheapest);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  useEffect(() => { window.scrollTo(0, 0); }, [id]);

  const handleAddToCart = async (listing: Listing) => {
    try {
      await addToCart(listing._id, 1);
      // You could replace this with a Shadcn Toast
      alert("Success! Added to your bag.");
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center animate-pulse text-muted-foreground">Loading Product Details...</div>;
  if (!product) return <div className="p-20 text-center">Product not found</div>;

  const validImages = product.images.filter(img => img && img.trim() !== "");

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-8 uppercase tracking-widest font-bold">
          <span>Home</span> <ChevronRight size={12} />
          <span>Catalog</span> <ChevronRight size={12} />
          <span className="text-slate-900 line-clamp-1">{product.title}</span>
        </nav>

        <div className="grid lg:grid-cols-12 gap-12 items-start">
          
          {/* LEFT: IMAGE GALLERY (Sticky on Desktop) */}
          <div className="lg:col-span-7 lg:sticky lg:top-24">
            <div className="space-y-4">
              <div className="aspect-square bg-slate-50 rounded-3xl overflow-hidden border border-slate-100">
                <img
                  src={validImages[currentImage] ? `${BASE_URL}${validImages[currentImage]}` : "/placeholder.png"}
                  alt={product.title}
                  className="w-full h-full object-contain mix-blend-multiply hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                {validImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentImage(i)}
                    className={`relative min-w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                      currentImage === i ? "border-slate-900 ring-2 ring-slate-100" : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img src={`${BASE_URL}${img}`} className="w-full h-full object-cover" alt="thumbnail" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: DETAILS SECTION */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50 border-none px-3 font-bold">
                  In Stock
                </Badge>
                <div className="flex items-center gap-1 text-sm font-bold text-slate-700 ml-auto">
                  <Star size={16} className="fill-amber-400 text-amber-400" />
                  4.8 <span className="text-muted-foreground font-medium underline">(1.2k Reviews)</span>
                </div>
              </div>
              <h1 className="text-4xl font-black tracking-tight text-slate-900 leading-tight">
                {product.title}
              </h1>
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-black text-slate-900">₹{selectedListing?.price.toLocaleString()}</span>
                <span className="text-xl text-muted-foreground line-through decoration-slate-300">₹{(selectedListing?.price! * 1.2).toFixed(0)}</span>
                <Badge className="bg-slate-900 text-white rounded-md">Save 20%</Badge>
              </div>
              <div className="flex items-center gap-2 text-sm font-medium text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <Store size={18} className="text-slate-400" />
                Sold by <span className="text-slate-900 font-bold">{selectedListing?.sellerName}</span>
                
                {/* Choose Seller Modal */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="link" size="sm" className="ml-auto text-primary p-0 h-auto font-bold">
                      View all sellers
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md rounded-3xl">
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-bold">Available Sellers</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-3 mt-4">
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
                              <p className="font-bold text-slate-900">{listing.sellerName}</p>
                              <p className="text-xs text-muted-foreground">Stock: {listing.stock} units left</p>
                            </div>
                            <p className="font-black text-lg">₹{listing.price}</p>
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
                onClick={() => selectedListing && handleAddToCart(selectedListing)}
                className="flex-1 h-14 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-lg font-bold transition-all active:scale-95 shadow-xl shadow-slate-200"
              >
                <ShoppingCart className="mr-2 h-5 w-5" /> Add to Bag
              </Button>
            </div>

            <Separator className="my-10" />

            {/* Delivery & Trust Info */}
            <div className="grid grid-cols-2 gap-6">
              <div className="flex gap-3">
                <div className="bg-slate-100 p-2.5 rounded-full h-fit"><Truck size={20} className="text-slate-700"/></div>
                <div>
                  <p className="text-xs font-bold text-slate-900 uppercase tracking-tighter">Fast Delivery</p>
                  <p className="text-[11px] text-muted-foreground">3-5 Business Days</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="bg-slate-100 p-2.5 rounded-full h-fit"><ShieldCheck size={20} className="text-slate-700"/></div>
                <div>
                  <p className="text-xs font-bold text-slate-900 uppercase tracking-tighter">Secure Checkout</p>
                  <p className="text-[11px] text-muted-foreground">Encrypted Transactions</p>
                </div>
              </div>
            </div>

            {/* Tabs for extra details */}
            <Tabs defaultValue="details" className="w-full mt-10">
              <TabsList className="w-full bg-transparent border-b rounded-none h-12 p-0 gap-8">
                <TabsTrigger value="details" className="rounded-none border-b-2 border-transparent data-[state=active]:border-slate-900 data-[state=active]:bg-transparent font-bold text-sm">Product Details</TabsTrigger>
                <TabsTrigger value="shipping" className="rounded-none border-b-2 border-transparent data-[state=active]:border-slate-900 data-[state=active]:bg-transparent font-bold text-sm">Shipping Policy</TabsTrigger>
              </TabsList>
              <TabsContent value="details" className="py-6 text-sm text-muted-foreground leading-relaxed">
                Experience high-end quality with {product.title}. Carefully sourced and quality-checked by our top-tier sellers. 
                <ul className="mt-4 space-y-2">
                  <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-500" /> Premium Grade Materials</li>
                  <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-500" /> Authenticity Guaranteed</li>
                </ul>
              </TabsContent>
              <TabsContent value="shipping" className="py-6 text-sm text-muted-foreground">
                We offer standard shipping to all regions. Returns are accepted within 7 days of delivery.
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Similar Products */}
        <SimilarProducts
          product={{
            _id: product._id,
            categoryId: product.categoryId,
            subCategoryId: product.subCategoryId,
          }}
        />
      </div>
    </div>
  );
};

export default ProductPage;