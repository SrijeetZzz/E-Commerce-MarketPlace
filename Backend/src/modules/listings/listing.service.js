// src/modules/listings/listing.service.js

const Listing = require("./listing.model");
const Product = require("../products/product.model");

const createListing = async (sellerId, data) => {
  const { productId, price, stock } = data;

  const product = await Product.findById(productId);

  if (!product) {
    throw new Error("Product not found");
  }

  // 🔥 PRICE VALIDATION (core logic)
  if (price >= product.priceRange.min && price <= product.priceRange.max) {
    return await Listing.create({
      productId,
      sellerId,
      price,
      stock,
      status: "ACTIVE",
    });
  } else {
    return await Listing.create({
      productId,
      sellerId,
      price,
      stock,
      status: "PENDING_APPROVAL",
      approvalReason: "Price out of allowed range",
    });
  }
};

const getMyListings = async (sellerId) => {
  return await Listing.find({ sellerId }).populate("productId", "title");
};

const getAllListings = async () => {
  return await Listing.find().populate("productId", "title");
};

const approveListing = async (id) => {
  const listing = await Listing.findById(id);

  if (!listing) throw new Error("Not found");

  listing.status = "ACTIVE";
  listing.approvalReason = null;

  await listing.save();

  return listing;
};

const rejectListing = async (id, reason) => {
  const listing = await Listing.findById(id);

  if (!listing) throw new Error("Not found");

  listing.status = "REJECTED";
  listing.approvalReason = reason;

  await listing.save();

  return listing;
};

module.exports = {
  createListing,
  getMyListings,
  getAllListings,
  approveListing,
  rejectListing,
};