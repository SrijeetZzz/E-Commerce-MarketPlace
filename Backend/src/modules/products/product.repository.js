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
  limit = 10,
}) => {
  const isValidObjectId = (id) =>
    mongoose.Types.ObjectId.isValid(id);

  // 🚨 STRICT INPUT SANITIZATION
  const validCategoryId =
    categoryId && isValidObjectId(categoryId)
      ? new mongoose.Types.ObjectId(categoryId)
      : null;

  const validSubCategoryId =
    subCategoryId && isValidObjectId(subCategoryId)
      ? new mongoose.Types.ObjectId(subCategoryId)
      : null;

  // 🚨 FORCE CONSISTENCY (NO MISMATCH ALLOWED)
  if (subCategoryId && !validSubCategoryId) {
    throw new Error("Invalid subCategoryId");
  }

  if (categoryId && !validCategoryId) {
    throw new Error("Invalid categoryId");
  }

  // 🔥 BASE MATCH
  const matchStage = {
    status: "ACTIVE",
  };

  if (minPrice || maxPrice) {
    matchStage.price = {};
    if (minPrice) matchStage.price.$gte = Number(minPrice);
    if (maxPrice) matchStage.price.$lte = Number(maxPrice);
  }

  // 🔥 PRODUCT FILTER (NO SILENT FAIL)
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

  // 🚀 SORT
  let sortStage = { minPrice: 1 };

  if (sortBy === "price_desc") sortStage = { minPrice: -1 };
  if (sortBy === "newest") sortStage = { createdAt: -1 };
  if (sortBy === "popularity") sortStage = { totalListings: -1 };

  const skip = (Number(page) - 1) * Number(limit);

  const pipeline = [
    // 1️⃣ LISTING FILTER
    { $match: matchStage },

    // 2️⃣ JOIN PRODUCT
    {
      $lookup: {
        from: "products",
        localField: "productId",
        foreignField: "_id",
        as: "product",
      },
    },
    { $unwind: "$product" },

    // 🚨 STRICT MATCH (ALWAYS APPLIED)
    {
      $match:
        Object.keys(productMatch).length > 0
          ? productMatch
          : {},
    },

    // 3️⃣ CATEGORY (DISPLAY ONLY)
    {
      $lookup: {
        from: "categories",
        localField: "product.categoryId",
        foreignField: "_id",
        as: "category",
      },
    },
    { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },

    // 4️⃣ SUBCATEGORY (DISPLAY ONLY)
    {
      $lookup: {
        from: "subcategories",
        localField: "product.subCategoryId",
        foreignField: "_id",
        as: "subCategory",
      },
    },
    { $unwind: { path: "$subCategory", preserveNullAndEmptyArrays: true } },

    // 5️⃣ GROUP
    {
      $group: {
        _id: "$product._id",

        title: { $first: "$product.title" },
        brand: { $first: "$product.brand" },
        images: { $first: "$product.images" },
        createdAt: { $first: "$product.createdAt" },

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

    // 6️⃣ SORT
    { $sort: sortStage },

    // 7️⃣ PAGINATION
    { $skip: skip },
    { $limit: Number(limit) },
  ];

  const results = await Listing.aggregate(pipeline);

  // 🔢 TOTAL COUNT
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

  return {
    data: results,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit),
    },
  };
};