// "use client";

// import { useEffect, useState } from "react";
// import { useParams } from "next/navigation";
// import api from "@/services/api";
// import { addToCart } from "@/services/cart";
// import SimilarProducts from "@/components/productPage/SimilarProducts";

// const ProductPage = () => {
//   const { id } = useParams();

//   const [product, setProduct] = useState<any>(null);
//   const [selectedListing, setSelectedListing] = useState<any>(null);
//   const [loading, setLoading] = useState(true);

//   const [currentImage, setCurrentImage] = useState(0);
//   const [showModal, setShowModal] = useState(false);

//   // 🔥 FETCH PRODUCT
//   useEffect(() => {
//     const fetchProduct = async () => {
//       try {
//         const res = await api.get(`/products/${id}`);
//         const data = res.data?.data;

//         setProduct(data);

//         // AUTO SELECT CHEAPEST
//         if (data.listings?.length) {
//           const cheapest = [...data.listings].sort(
//             (a: any, b: any) => a.price - b.price
//           )[0];

//           setSelectedListing(cheapest);
//         }
//       } catch (err) {
//         console.error("Failed to fetch product", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (id) fetchProduct();
//   }, [id]);

//   // 🔥 RESET IMAGE ON PRODUCT CHANGE
//   useEffect(() => {
//     setCurrentImage(0);
//   }, [product?._id]);

//   // 🔥 SCROLL TO TOP ON CHANGE
//   useEffect(() => {
//     window.scrollTo(0, 0);
//   }, [id]);

//   // 🔥 ADD TO CART
//   const handleAddToCart = async (listing: any) => {
//     if (!listing) return;

//     try {
//       await addToCart(listing._id, 1);
//       // TODO: replace with toast later
//       alert("Added to cart");
//     } catch (err) {
//       console.error("Cart failed", err);
//     }
//   };

//   if (loading) return <p className="p-6">Loading...</p>;
//   if (!product) return <p className="p-6">Product not found</p>;

//   return (
//     <>
//       {/* MAIN PAGE */}
//       <div className="max-w-7xl mx-auto px-6 py-10">

//         <div className="grid md:grid-cols-2 gap-10">

//           {/* 🔥 IMAGE SLIDER */}
//           <div>
//             <img
//               src={product.images?.[currentImage] || "/placeholder.png"}
//               alt={product.title}
//               className="w-full h-100 object-cover rounded-xl"
//             />

//             {/* THUMBNAILS */}
//             <div className="flex gap-2 mt-3 overflow-x-auto">
//               {product.images?.map((img: string, i: number) => (
//                 <img
//                   key={i}
//                   src={img}
//                   alt="thumbnail"
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

//             <h1 className="text-3xl font-bold">
//               {product.title}
//             </h1>

//             <p className="text-gray-600">
//               {product.description}
//             </p>

//             {/* PRICE */}
//             <p className="text-2xl font-semibold text-purple-600">
//               ₹{selectedListing?.price || "N/A"}
//             </p>

//             {/* ACTIONS */}
//             <div className="flex gap-4">

//               <button
//                 onClick={() => setShowModal(true)}
//                 className="border px-5 py-2 rounded-lg hover:bg-gray-100"
//               >
//                 Choose Seller
//               </button>

//               <button
//                 disabled={!selectedListing}
//                 onClick={() => handleAddToCart(selectedListing)}
//                 className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50"
//               >
//                 Add to Cart
//               </button>

//             </div>

//           </div>
//         </div>

//         {/* 🔥 SIMILAR PRODUCTS (CORRECT PLACEMENT) */}
//         <SimilarProducts product={product} />

//       </div>

//       {/* 🔥 MODAL (OUTSIDE MAIN CONTAINER) */}
//       {showModal && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center">

//           {/* BACKDROP */}
//           <div
//             className="absolute inset-0 bg-black/40"
//             onClick={() => setShowModal(false)}
//           />

//           {/* MODAL CONTENT */}
//           <div className="relative bg-white w-full max-w-lg rounded-xl p-6 z-10">

//             <h2 className="text-xl font-semibold mb-4">
//               Choose Seller
//             </h2>

//             <div className="space-y-3 max-h-100 overflow-y-auto">

//               {product.listings?.map((listing: any) => (
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
//                     <p className="font-medium">
//                       {listing.sellerName || "Seller"}
//                     </p>

//                     <p className="text-sm text-gray-500">
//                       Stock: {listing.stock}
//                     </p>

//                     <p className="text-xs text-gray-400">
//                       ⭐ 4.2 rating
//                     </p>
//                   </div>

//                   <p className="font-semibold">
//                     ₹{listing.price}
//                   </p>
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

const ProductPage = () => {
  const { id } = useParams();

  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);

  const [currentImage, setCurrentImage] = useState(0);
  const [showModal, setShowModal] = useState(false);

  // 🔥 FETCH PRODUCT
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (!id) return;

        const data = await getProductById(id as string);

        setProduct(data);

        // AUTO SELECT CHEAPEST
        if (data.listings.length) {
          const cheapest = [...data.listings].sort(
            (a, b) => a.price - b.price,
          )[0];

          setSelectedListing(cheapest);
        }
      } catch (err) {
        console.error("Failed to fetch product", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // 🔥 RESET IMAGE ON PRODUCT CHANGE
  useEffect(() => {
    setCurrentImage(0);
  }, [product?._id]);

  // 🔥 SCROLL TO TOP
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  // 🔥 ADD TO CART
  const handleAddToCart = async (listing: Listing) => {
    try {
      await addToCart(listing._id, 1);
      alert("Added to cart");
    } catch (err) {
      console.error("Cart failed", err);
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;
  if (!product) return <p className="p-6">Product not found</p>;

  return (
    <>
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid md:grid-cols-2 gap-10">
          {/* 🔥 IMAGE */}
          <div>
            <img
              src={product.images[currentImage] || "/placeholder.png"}
              alt={product.title}
              className="w-full h-100 object-cover rounded-xl"
            />

            <div className="flex gap-2 mt-3 overflow-x-auto">
              {product.images.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  onClick={() => setCurrentImage(i)}
                  className={`w-16 h-16 object-cover rounded cursor-pointer border ${
                    currentImage === i ? "border-purple-600" : ""
                  }`}
                />
              ))}
            </div>
          </div>

          {/* 🔥 DETAILS */}
          <div className="space-y-4">
            <h1 className="text-3xl font-bold">{product.title}</h1>

            <p className="text-gray-600">{product.description}</p>

            <p className="text-2xl font-semibold text-purple-600">
              ₹{selectedListing?.price ?? "N/A"}
            </p>

            <div className="flex gap-4">
              <button
                onClick={() => setShowModal(true)}
                className="border px-5 py-2 rounded-lg hover:bg-gray-100"
              >
                Choose Seller
              </button>

              <button
                disabled={!selectedListing}
                onClick={() =>
                  selectedListing && handleAddToCart(selectedListing)
                }
                className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>

        {/* 🔥 SIMILAR PRODUCTS */}
        <SimilarProducts
          product={{
            _id: product._id,
            categoryId: product.categoryId,
            subCategoryId: product.subCategoryId,
          }}
        />
      </div>

      {/* 🔥 MODAL */}
      {showModal && product && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowModal(false)}
          />

          <div className="relative bg-white w-full max-w-lg rounded-xl p-6 z-10">
            <h2 className="text-xl font-semibold mb-4">Choose Seller</h2>

            <div className="space-y-3 max-h-100 overflow-y-auto">
              {product.listings.map((listing) => (
                <div
                  key={listing._id}
                  onClick={() => {
                    setSelectedListing(listing);
                    setShowModal(false);
                  }}
                  className={`border p-4 rounded-lg flex justify-between items-center cursor-pointer transition ${
                    selectedListing?._id === listing._id
                      ? "border-purple-600 bg-purple-50"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <div>
                    <p className="font-medium">{listing.sellerName}</p>

                    <p className="text-sm text-gray-500">
                      Stock: {listing.stock}
                    </p>

                    <p className="text-xs text-gray-400">⭐ 4.2 rating</p>
                  </div>

                  <p className="font-semibold">₹{listing.price}</p>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowModal(false)}
              className="mt-4 text-sm text-gray-500"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductPage;
