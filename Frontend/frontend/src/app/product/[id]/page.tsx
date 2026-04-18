"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/services/api";
import { addToCart } from "@/services/cart";

const ProductPage = () => {
  const { id } = useParams();

  const [product, setProduct] = useState<any>(null);
  const [selectedListing, setSelectedListing] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // 🔥 FETCH PRODUCT
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${id}`);
        const data = res.data;

        setProduct(data);

        // ✅ AUTO SELECT CHEAPEST LISTING
        if (data.listings?.length) {
          const cheapest = [...data.listings].sort(
            (a: any, b: any) => a.price - b.price
          )[0];

          setSelectedListing(cheapest);
        }
      } catch (err) {
        console.error("Failed to fetch product", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  // 🔥 ADD TO CART
  const handleAddToCart = async (listing: any) => {
    if (!listing) return;

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
    <div className="max-w-7xl mx-auto px-6 py-10">

      <div className="grid md:grid-cols-2 gap-10">

        {/* LEFT → IMAGE */}
        <div>
          <img
            src={product.images?.[0] || "/placeholder.png"}
            className="w-full h-[400px] object-cover rounded-xl"
          />
        </div>

        {/* RIGHT → DETAILS */}
        <div className="space-y-4">

          <h1 className="text-3xl font-bold">
            {product.title}
          </h1>

          <p className="text-gray-600">
            {product.description}
          </p>

          {/* 🔥 DYNAMIC PRICE */}
          <p className="text-2xl font-semibold text-purple-600">
            ₹{selectedListing?.price || "N/A"}
          </p>

          {/* 🔥 ADD TO CART */}
          <button
            disabled={!selectedListing}
            onClick={() => handleAddToCart(selectedListing)}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 disabled:opacity-50"
          >
            Add to Cart
          </button>

        </div>
      </div>

      {/* 🔥 SELLER LISTINGS */}
      <div className="mt-12">
        <h2 className="text-xl font-semibold mb-4">
          Available Sellers
        </h2>

        <div className="space-y-3">

          {product.listings?.map((listing: any) => (
            <div
              key={listing._id}
              onClick={() => setSelectedListing(listing)}
              className={`border p-4 rounded-lg flex justify-between items-center cursor-pointer transition
                ${
                  selectedListing?._id === listing._id
                    ? "border-purple-600 bg-purple-50"
                    : "hover:bg-gray-50"
                }
              `}
            >
              {/* LEFT */}
              <div>
                <p className="font-medium">
                  {listing.sellerName || "Seller"}
                </p>

                <p className="text-sm text-gray-500">
                  Stock: {listing.stock}
                </p>
              </div>

              {/* RIGHT */}
              <div className="flex items-center gap-4">

                <p className="font-semibold">
                  ₹{listing.price}
                </p>

                <button
                  onClick={(e) => {
                    e.stopPropagation(); // 🔥 prevent row click override
                    handleAddToCart(listing);
                  }}
                  className="bg-black text-white px-4 py-2 rounded"
                >
                  Add
                </button>
              </div>
            </div>
          ))}

        </div>
      </div>
    </div>
  );
};

export default ProductPage;