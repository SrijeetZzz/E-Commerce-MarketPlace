const Listing = require("../listings/listing.model");
const mongoose = require("mongoose");

exports.getGroupedProducts = async ({
  q,
  minPrice,
  maxPrice,
  categoryId,
  subCategoryId,
}) => {
  const matchStage = {
    status: "ACTIVE",
  };

  // 💰 price filter (listing level)
  if (minPrice || maxPrice) {
    matchStage.price = {};
    if (minPrice) matchStage.price.$gte = Number(minPrice);
    if (maxPrice) matchStage.price.$lte = Number(maxPrice);
  }

  const pipeline = [
    // 1️⃣ match listings (FAST)
    { $match: matchStage },

    // 2️⃣ join product
    {
      $lookup: {
        from: "products",
        localField: "productId",
        foreignField: "_id",
        as: "product",
      },
    },
    { $unwind: "$product" },

    // 3️⃣ lookup category
    {
      $lookup: {
        from: "categories",
        localField: "product.categoryId",
        foreignField: "_id",
        as: "category",
      },
    },
    { $unwind: "$category" },

    // 4️⃣ lookup subcategory
    {
      $lookup: {
        from: "subcategories",
        localField: "product.subCategoryId",
        foreignField: "_id",
        as: "subCategory",
      },
    },
    { $unwind: "$subCategory" },

    // 5️⃣ apply filters (AFTER lookup)
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

    // 6️⃣ group by product
    {
      $group: {
        _id: "$product._id",

        title: { $first: "$product.title" },
        brand: { $first: "$product.brand" },
        images: { $first: "$product.images" },

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
        maxPrice: { $max: "$price" }, // 🔥 new
        totalListings: { $sum: 1 },   // 🔥 new
      },
    },

    // 7️⃣ sort
    {
      $sort: { minPrice: 1 },
    },
  ];

  return await Listing.aggregate(pipeline);
};