"use client";

import { useEffect, useState } from "react";
import {
  getCart,
  updateCart,
  removeFromCart,
} from "@/services/cart";

const CartPage = () => {
  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // 🔥 FETCH CART
  const fetchCart = async () => {
    try {
      const res = await getCart();
      setCart(res.data);
    } catch (err) {
      console.error("Cart fetch failed", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // 🔥 UPDATE QUANTITY
  const handleUpdate = async (listingId: string, quantity: number) => {
    if (quantity < 1) return;

    try {
      await updateCart(listingId, quantity);
      fetchCart();
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  // 🔥 REMOVE ITEM
  const handleRemove = async (listingId: string) => {
    try {
      await removeFromCart(listingId);
      fetchCart();
    } catch (err) {
      console.error("Remove failed", err);
    }
  };

  // 🔥 LOADING STATE
  if (loading) return <p className="p-6">Loading cart...</p>;

  // 🔥 EMPTY STATE
  if (!cart || cart.items.length === 0) {
    return <p className="p-6">Your cart is empty</p>;
  }

  // 🔥 TOTAL CALCULATION
  const total = cart.items.reduce(
    (sum: number, item: any) =>
      sum + item.priceAtAdd * item.quantity,
    0
  );

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">

      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

      <div className="space-y-4">
        {cart.items.map((item: any) => (
          <div
            key={item.listingId}
            className="flex justify-between items-center border p-4 rounded-lg"
          >
            {/* LEFT */}
            <div>
              <p className="font-semibold">
                {item.title || "Product"}
              </p>
              <p className="text-sm text-gray-500">
                ₹{item.priceAtAdd}
              </p>
            </div>

            {/* RIGHT */}
            <div className="flex items-center gap-4">

              {/* QUANTITY */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    handleUpdate(item.listingId, item.quantity - 1)
                  }
                  className="px-2 border"
                >
                  -
                </button>

                <span>{item.quantity}</span>

                <button
                  onClick={() =>
                    handleUpdate(item.listingId, item.quantity + 1)
                  }
                  className="px-2 border"
                >
                  +
                </button>
              </div>

              {/* REMOVE */}
              <button
                onClick={() => handleRemove(item.listingId)}
                className="text-red-500"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* TOTAL */}
      <div className="mt-8 text-right">
        <p className="text-2xl font-bold">
          Total: ₹{total}
        </p>

        <button className="mt-4 bg-purple-600 text-white px-6 py-3 rounded-lg">
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default CartPage;