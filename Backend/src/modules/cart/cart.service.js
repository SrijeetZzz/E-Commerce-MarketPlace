// src/modules/cart/cart.service.js

const Cart = require("./cart.model");
const Listing = require("../listings/listing.model");

const addToCart = async (userId, { listingId, quantity }) => {
  const listing = await Listing.findById(listingId);

  if (!listing || listing.status !== "ACTIVE") {
    throw new Error("Listing not available");
  }

  let cart = await Cart.findOne({ userId });

  if (!cart) {
    cart = await Cart.create({
      userId,
      items: [],
    });
  }

  const existingItem = cart.items.find(
    item => item.listingId.toString() === listingId
  );

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.items.push({
      listingId,
      quantity,
      priceAtAdd: listing.price, // 🔥 snapshot
    });
  }

  await cart.save();
  return cart;
};

const getCart = async (userId) => {
  return await Cart.findOne({ userId }).populate("items.listingId");
};

const updateCartItem = async (userId, listingId, quantity) => {
  const cart = await Cart.findOne({ userId });

  if (!cart) throw new Error("Cart not found");

  const item = cart.items.find(
    i => i.listingId.toString() === listingId
  );

  if (!item) throw new Error("Item not found");

  item.quantity = quantity;

  await cart.save();
  return cart;
};

const removeFromCart = async (userId, listingId) => {
  const cart = await Cart.findOne({ userId });

  if (!cart) throw new Error("Cart not found");

  cart.items = cart.items.filter(
    i => i.listingId.toString() !== listingId
  );

  await cart.save();
  return cart;
};

module.exports = {
  addToCart,
  getCart,
  updateCartItem,
  removeFromCart,
};