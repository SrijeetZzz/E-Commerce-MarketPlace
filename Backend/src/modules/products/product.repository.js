const Listing = require("../listings/listing.model");
const mongoose = require("mongoose");

exports.getGroupedProducts = async ({
  q,
  minPrice,
  maxPrice,
  categoryId,
  subCategoryId,
  sortBy = "price_asc",
  page = 1,
  limit = 12,
}) => {
  const isValidObjectId = (id) =>
    mongoose.Types.ObjectId.isValid(id);

  // ✅ VALIDATE IDS
  const validCategoryId =
    categoryId && isValidObjectId(categoryId)
      ? new mongoose.Types.ObjectId(categoryId)
      : null;

  const validSubCategoryId =
    subCategoryId && isValidObjectId(subCategoryId)
      ? new mongoose.Types.ObjectId(subCategoryId)
      : null;

  if (subCategoryId && !validSubCategoryId) {
    throw new Error("Invalid subCategoryId");
  }

  if (categoryId && !validCategoryId) {
    throw new Error("Invalid categoryId");
  }

  // ✅ LISTING FILTER
  const matchStage = {
    status: "ACTIVE",
  };

  if (minPrice || maxPrice) {
    matchStage.price = {};
    if (minPrice) matchStage.price.$gte = Number(minPrice);
    if (maxPrice) matchStage.price.$lte = Number(maxPrice);
  }

  // ✅ PRODUCT FILTER
  const productMatch = {};

  if (q) {
    productMatch["product.title"] = {
      $regex: q,
      $options: "i",
    };
  }

  if (validCategoryId) {
    productMatch["product.categoryId"] = validCategoryId;
  }

  if (validSubCategoryId) {
    productMatch["product.subCategoryId"] = validSubCategoryId;
  }

  // ✅ SORT
  let sortStage = { minPrice: 1 };

  if (sortBy === "price_desc") sortStage = { minPrice: -1 };
  if (sortBy === "newest") sortStage = { createdAt: -1 };
  if (sortBy === "popularity") sortStage = { totalListings: -1 };

  const skip = (Number(page) - 1) * Number(limit);

  // 🚀 MAIN PIPELINE (PAGINATED PRODUCTS)
  const pipeline = [
    { $match: matchStage },

    {
      $lookup: {
        from: "products",
        localField: "productId",
        foreignField: "_id",
        as: "product",
      },
    },
    { $unwind: "$product" },

    {
      $match:
        Object.keys(productMatch).length > 0
          ? productMatch
          : {},
    },

    {
      $lookup: {
        from: "categories",
        localField: "product.categoryId",
        foreignField: "_id",
        as: "category",
      },
    },
    { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },

    {
      $lookup: {
        from: "subcategories",
        localField: "product.subCategoryId",
        foreignField: "_id",
        as: "subCategory",
      },
    },
    { $unwind: { path: "$subCategory", preserveNullAndEmptyArrays: true } },

    {
      $group: {
        _id: "$product._id",

        title: { $first: "$product.title" },
        brand: { $first: "$product.brand" },
        images: { $first: "$product.images" },
        createdAt: { $first: "$product.createdAt" },
        categoryId: { $first: "$product.categoryId" },
        subCategoryId: { $first: "$product.subCategoryId" },
        category: { $first: "$category.name" },
        subCategory: { $first: "$subCategory.name" },

        listings: {
          $push: {
            _id: "$_id",
            price: "$price",
            sellerId: "$sellerId",
            stock: "$stock",
          },
        },

        minPrice: { $min: "$price" },
        maxPrice: { $max: "$price" },
        totalListings: { $sum: 1 },
      },
    },

    { $sort: sortStage },
    { $skip: skip },
    { $limit: Number(limit) },
  ];

  const results = await Listing.aggregate(pipeline);

  // 🔢 TOTAL COUNT (for pagination)
  const totalPipeline = [
    { $match: matchStage },
    {
      $lookup: {
        from: "products",
        localField: "productId",
        foreignField: "_id",
        as: "product",
      },
    },
    { $unwind: "$product" },

    {
      $match:
        Object.keys(productMatch).length > 0
          ? productMatch
          : {},
    },

    {
      $group: {
        _id: "$product._id",
      },
    },
    {
      $count: "total",
    },
  ];

  const totalResult = await Listing.aggregate(totalPipeline);
  const total = totalResult[0]?.total || 0;

  // 🔥 GLOBAL PRICE RANGE (ALL MATCHING LISTINGS — NOT PAGINATED)
  const priceRangePipeline = [
    { $match: matchStage },

    {
      $lookup: {
        from: "products",
        localField: "productId",
        foreignField: "_id",
        as: "product",
      },
    },
    { $unwind: "$product" },

    {
      $match:
        Object.keys(productMatch).length > 0
          ? productMatch
          : {},
    },

    {
      $group: {
        _id: null,
        minPrice: { $min: "$price" },
        maxPrice: { $max: "$price" },
      },
    },
  ];

  const priceRangeResult = await Listing.aggregate(priceRangePipeline);

  const globalMinPrice = priceRangeResult[0]?.minPrice || 0;
  const globalMaxPrice = priceRangeResult[0]?.maxPrice || 0;

  // ✅ FINAL RESPONSE
  return {
    data: results,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit),
    },
    priceRange: {
      min: globalMinPrice,
      max: globalMaxPrice,
    },
  };
};