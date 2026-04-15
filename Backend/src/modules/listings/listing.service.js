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

const searchListings = async (queryParams) => {
  const {
    q,
    category,
    minPrice,
    maxPrice,
    page = 1,
    limit = 10,
  } = queryParams;

  const filter = {
    status: "ACTIVE",
  };

  // 🔥 PRICE FILTER
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  // 🔥 BASE QUERY
  let query = Listing.find(filter).populate("productId");

  // 🔥 SEARCH BY TITLE (from product)
  if (q) {
    query = query.populate({
      path: "productId",
      match: {
        title: { $regex: q, $options: "i" },
      },
    });
  }

  // 🔥 CATEGORY FILTER
  if (category) {
    query = query.populate({
      path: "productId",
      match: {
        category: category,
      },
    });
  }

  // 🔥 PAGINATION
  const skip = (page - 1) * limit;

  const results = await query.skip(skip).limit(Number(limit));

  // 🔥 REMOVE NULL POPULATED (important)
  const filtered = results.filter(r => r.productId);

  return filtered;
};

module.exports = {
  createListing,
  getMyListings,
  getAllListings,
  approveListing,
  rejectListing,
  searchListings ,
};