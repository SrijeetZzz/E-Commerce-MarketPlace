// src/modules/listings/listing.service.js

const Listing = require("./listing.model");
const Product = require("../products/product.model");
const mongoose = require("mongoose");
const paginate = require("../../shared/utils/pagination");
const getSort = require("../../shared/utils/sorting");


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

const createBulkListings = async (sellerId, listingsData) => {
  if (!Array.isArray(listingsData) || listingsData.length === 0) {
    throw new Error("Invalid listings data");
  }

  const results = [];

  for (const data of listingsData) {
    try {
      const { productId, price, stock } = data;

      const product = await Product.findById(productId);

      if (!product) {
        results.push({
          ...data,
          status: "FAILED",
          reason: "Product not found",
        });
        continue;
      }

      let listing;

      // 🔥 reuse your core validation
      if (price >= product.priceRange.min && price <= product.priceRange.max) {
        listing = await Listing.create({
          productId,
          sellerId,
          price,
          stock,
          status: "ACTIVE",
        });
      } else {
        listing = await Listing.create({
          productId,
          sellerId,
          price,
          stock,
          status: "PENDING_APPROVAL",
          approvalReason: "Price out of allowed range",
        });
      }

      results.push(listing);
    } catch (err) {
      results.push({
        ...data,
        status: "FAILED",
        reason: err.message,
      });
    }
  }

  return results;
};

const getMyListings = async (sellerId, filters = {}) => {
  let {
    page = 1,
    limit = 10,
    status,
    lowStock,
    sort = "newest",
    search,
  } = filters;

  page = Number(page);
  limit = Number(limit);

  const VALID_STATUSES = ["ACTIVE", "PAUSED", "PENDING_APPROVAL", "REJECTED"];

  // ------------------------
  // Base Match Query
  // ------------------------
  const matchQuery = {
    sellerId: new mongoose.Types.ObjectId(sellerId),
  };

  if (status && status !== "all" && VALID_STATUSES.includes(status)) {
    matchQuery.status = status;
  }

  // low stock only makes sense for sellable listings
  if (
    lowStock === "true" &&
    (!status || ["ACTIVE", "PAUSED"].includes(status))
  ) {
    matchQuery.stock = { $lte: 5 };
  }

  // ------------------------
  // Sorting
  // ------------------------
  let sortQuery = {};

  switch (sort) {
    case "oldest":
      sortQuery = { createdAt: 1 };
      break;

    case "stockHigh":
      sortQuery = { stock: -1 };
      break;

    case "stockLow":
      sortQuery = { stock: 1 };
      break;

    case "priceHigh":
      sortQuery = { price: -1 };
      break;

    case "priceLow":
      sortQuery = { price: 1 };
      break;

    // useful moderation view
    case "pendingFirst":
      sortQuery = {
        status: 1,
        createdAt: -1,
      };
      break;

    default:
      sortQuery = { createdAt: -1 };
  }

  // ------------------------
  // Aggregation
  // ------------------------
  const pipeline = [
    { $match: matchQuery },

    {
      $lookup: {
        from: "products",
        localField: "productId",
        foreignField: "_id",
        as: "product",
      },
    },

    {
      $unwind: {
        path: "$product",
        preserveNullAndEmptyArrays: true,
      },
    },
  ];

  if (search?.trim()) {
    pipeline.push({
      $match: {
        "product.title": {
          $regex: search.trim(),
          $options: "i",
        },
      },
    });
  }

  // ------------------------
  // Global Counts
  // ------------------------
  const baseQuery = {
    sellerId: new mongoose.Types.ObjectId(sellerId),
  };

  const [
    totalListings,
    activeListings,
    pausedListings,
    pendingApprovalListings,
    rejectedListings,
    outOfStockListings,
    lowStockListings,
  ] = await Promise.all([
    Listing.countDocuments(baseQuery),

    Listing.countDocuments({
      ...baseQuery,
      status: "ACTIVE",
    }),

    Listing.countDocuments({
      ...baseQuery,
      status: "PAUSED",
    }),

    Listing.countDocuments({
      ...baseQuery,
      status: "PENDING_APPROVAL",
    }),

    Listing.countDocuments({
      ...baseQuery,
      status: "REJECTED",
    }),

    Listing.countDocuments({
      ...baseQuery,
      status: "ACTIVE",
      stock: 0,
    }),

    Listing.countDocuments({
      ...baseQuery,
      status: "ACTIVE",
      stock: { $gt: 0, $lte: 5 },
    }),
  ]);

  // ------------------------
  // Filtered Count
  // ------------------------
  const totalResults = await Listing.aggregate([
    ...pipeline,
    { $count: "count" },
  ]);

  const total = totalResults.length > 0 ? totalResults[0].count : 0;

  // ------------------------
  // Paginated Listings
  // ------------------------
  const listings = await Listing.aggregate([
    ...pipeline,
    { $sort: sortQuery },
    { $skip: (page - 1) * limit },
    { $limit: limit },
  ]);

  return {
    data: listings,

    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },

    counts: {
      total: totalListings,
      active: activeListings,
      paused: pausedListings,
      pendingApproval: pendingApprovalListings,
      rejected: rejectedListings,
      outOfStock: outOfStockListings,
      lowStock: lowStockListings,
    },
  };
};

const getListingById = async (id) => {
  return await Listing.findById(id)
    .populate({
      path: "productId",
      populate: [
        {
          path: "categoryId",
          select: "name",
        },
        {
          path: "subCategoryId",
          select: "name",
        },
      ],
    })
    .populate(
      "sellerId",
      "name email shopName phone"
    );
};


const getAllListings = async (queryParams) => {
  const {
    page = 1,
    limit = 10,
    sort = "latest",
    status,
    sellerId,
  } = queryParams;

  const query = {};

  // Status filter
  if (status) {
    query.status = status;
  }

  // Seller filter
  if (sellerId) {
    query.sellerId = sellerId;
  }

  const {
    skip,
    limit: pageSize,
    pagination,
  } = await paginate(Listing, query, page, limit);

  const listings = await Listing.find(query)
    .populate("productId", "title")
    .populate("sellerId", "name email")
    .sort(getSort(sort))
    .skip(skip)
    .limit(pageSize);

  return {
    data: listings,
    pagination,
  };
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

const deleteListing = async (sellerId, listingId) => {
  const listing = await Listing.findOneAndDelete({
    _id: listingId,
    sellerId,
  });

  if (!listing) {
    throw new Error("Listing not found");
  }

  return listing;
};

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

const updateListing = async (sellerId, listingId, data) => {
  const { price, stock, status } = data;

  const listing = await Listing.findOne({
    _id: listingId,
    sellerId,
  }).populate("productId");

  if (!listing) {
    throw new Error("Listing not found");
  }

  if (status) {
    if (["PAUSED", "ACTIVE"].includes(status)) {
      listing.status = status;
      await listing.save();
      return listing;
    }
  }

  if (price !== undefined) {
    if (
      price < listing.productId.priceRange.min ||
      price > listing.productId.priceRange.max
    ) {
      listing.status = "PENDING_APPROVAL";
      listing.approvalReason = "Updated price out of allowed range";
    } else {
      listing.status = "ACTIVE";
      listing.approvalReason = null;
    }
    listing.price = price;
  }

  if (stock !== undefined) {
    listing.stock = stock;
  }

  await listing.save();
  return listing;
};
module.exports = {
  createListing,
  getMyListings,
  getAllListings,
  approveListing,
  rejectListing,
  searchListings,
  createBulkListings,
  updateListing,
  deleteListing,
  getListingById
};
