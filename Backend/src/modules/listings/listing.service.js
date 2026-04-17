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

const mongoose = require("mongoose");

const searchListings = async ({
  q,
  categoryId,
  subCategoryId,
  minPrice,
  maxPrice,
  page = 1,
  limit = 10,
}) => {
  const matchStage = {
    status: "ACTIVE",
  };

  // 💰 price filter
  if (minPrice || maxPrice) {
    matchStage.price = {};
    if (minPrice) matchStage.price.$gte = Number(minPrice);
    if (maxPrice) matchStage.price.$lte = Number(maxPrice);
  }

  const pipeline = [
    { $match: matchStage },

    // join product
    {
      $lookup: {
        from: "products",
        localField: "productId",
        foreignField: "_id",
        as: "product",
      },
    },
    { $unwind: "$product" },

    // join category
    {
      $lookup: {
        from: "categories",
        localField: "product.categoryId",
        foreignField: "_id",
        as: "category",
      },
    },
    { $unwind: "$category" },

    // join subcategory
    {
      $lookup: {
        from: "subcategories",
        localField: "product.subCategoryId",
        foreignField: "_id",
        as: "subCategory",
      },
    },
    { $unwind: "$subCategory" },

    // filters
    {
      $match: {
        ...(q && {
          "product.title": { $regex: q, $options: "i" },
        }),

        ...(categoryId && {
          "category._id": new mongoose.Types.ObjectId(categoryId),
        }),

        ...(subCategoryId && {
          "subCategory._id": new mongoose.Types.ObjectId(subCategoryId),
        }),
      },
    },

    // pagination
    { $skip: (page - 1) * limit },
    { $limit: Number(limit) },
  ];

  return await Listing.aggregate(pipeline);
};

module.exports = {
  createListing,
  getMyListings,
  getAllListings,
  approveListing,
  rejectListing,
  searchListings ,
};