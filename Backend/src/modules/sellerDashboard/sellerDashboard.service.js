const Order = require("../orders/order.model");
const ProductListing = require("../listings/listing.model");
const mongoose = require("mongoose");

exports.getDashboardSummary = async (sellerId, startDate, endDate) => {
  const sellerObjectId = new mongoose.Types.ObjectId(sellerId);

  const matchStage = {
    createdAt: { $gte: startDate, $lte: endDate },
  };

  const result = await Order.aggregate([
    { $match: matchStage },

    { $unwind: "$items" },

    {
      $lookup: {
        from: "productlistings",
        localField: "items.listingId",
        foreignField: "_id",
        as: "listing",
      },
    },

    { $unwind: "$listing" },

    {
      $match: {
        "listing.sellerId": sellerObjectId,
      },
    },

    {
      $group: {
        _id: null,
        totalOrders: { $sum: 1 },
        revenue: {
          $sum: {
            $multiply: ["$items.price", "$items.quantity"],
          },
        },
        statusCounts: {
          $push: "$items.fulfillmentStatus",
        },
      },
    },
  ]);

  const summary = result[0] || {
    totalOrders: 0,
    revenue: 0,
    statusCounts: [],
  };

  // Convert status array → counts
  const statusBreakdown = {
    NEW: 0,
    PACKING: 0,
    SHIPPED: 0,
    DELIVERED: 0,
  };

  summary.statusCounts.forEach((status) => {
    if (statusBreakdown[status] !== undefined) {
      statusBreakdown[status]++;
    }
  });

  const activeListings = await ProductListing.countDocuments({
    sellerId,
    status: "ACTIVE",
  });

  const lowStockItems = await ProductListing.countDocuments({
    sellerId,
    stock: { $lt: 5 }, // threshold (you can tweak)
  });

  const aov =
    summary.totalOrders > 0 ? summary.revenue / summary.totalOrders : 0;

  return {
    totalOrders: summary.totalOrders,
    revenue: summary.revenue,
    aov,
    activeListings,
    lowStockItems,
    statusBreakdown,
  };
};

exports.getOrdersOverTime = async (sellerId, startDate, endDate) => {
  const sellerObjectId = new mongoose.Types.ObjectId(sellerId);

  return await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate, $lte: endDate },
      },
    },

    { $unwind: "$items" },

    {
      $lookup: {
        from: "productlistings",
        localField: "items.listingId",
        foreignField: "_id",
        as: "listing",
      },
    },

    { $unwind: "$listing" },

    {
      $match: {
        "listing.sellerId": sellerObjectId,
      },
    },

    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
        },
        orders: { $sum: 1 },
      },
    },

    { $sort: { _id: 1 } },
  ]);
};

exports.getRevenueOverTime = async (sellerId, startDate, endDate) => {
  const sellerObjectId = new mongoose.Types.ObjectId(sellerId);

  return await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate, $lte: endDate },
        status: "CONFIRMED", // 🔥 IMPORTANT
      },
    },

    { $unwind: "$items" },

    {
      $lookup: {
        from: "productlistings",
        localField: "items.listingId",
        foreignField: "_id",
        as: "listing",
      },
    },

    { $unwind: "$listing" },

    {
      $match: {
        "listing.sellerId": sellerObjectId,
      },
    },

    {
      $group: {
        _id: {
          $dateToString: {
            format: "%Y-%m-%d",
            date: "$createdAt",
          },
        },
        revenue: {
          $sum: {
            $multiply: ["$items.price", "$items.quantity"],
          },
        },
      },
    },

    { $sort: { _id: 1 } },
  ]);
};

exports.getTopProducts = async (
  sellerId,
  startDate,
  endDate,
  categoryId,
  subCategoryId,
) => {
  const sellerObjectId = new mongoose.Types.ObjectId(sellerId);

  const pipeline = [
    {
      $match: {
        createdAt: { $gte: startDate, $lte: endDate },
        status: "CONFIRMED",
      },
    },

    { $unwind: "$items" },

    {
      $lookup: {
        from: "productlistings",
        localField: "items.listingId",
        foreignField: "_id",
        as: "listing",
      },
    },
    { $unwind: "$listing" },

    {
      $match: {
        "listing.sellerId": sellerObjectId,
      },
    },

    {
      $lookup: {
        from: "products",
        localField: "listing.productId",
        foreignField: "_id",
        as: "product",
      },
    },
    { $unwind: "$product" },
  ];

  // 🔥 APPLY FILTERS DYNAMICALLY

  if (categoryId) {
    pipeline.push({
      $match: {
        "product.categoryId": new mongoose.Types.ObjectId(categoryId),
      },
    });
  }

  if (subCategoryId) {
    pipeline.push({
      $match: {
        "product.subCategoryId": new mongoose.Types.ObjectId(subCategoryId),
      },
    });
  }

  // 🔥 GROUPING
  pipeline.push(
    {
      $group: {
        _id: "$product._id",
        productName: { $first: "$product.title" },
        quantitySold: { $sum: "$items.quantity" },
        revenue: {
          $sum: {
            $multiply: ["$items.price", "$items.quantity"],
          },
        },
      },
    },
    { $sort: { quantitySold: -1 } }, // 🔥 sort by most sold
    { $limit: 5 },
  );

  return await Order.aggregate(pipeline);
};

exports.getRecentOrders = async (sellerId) => {
  const sellerObjectId = new mongoose.Types.ObjectId(sellerId);

  return await Order.aggregate([
    { $unwind: "$items" },

    {
      $lookup: {
        from: "productlistings",
        localField: "items.listingId",
        foreignField: "_id",
        as: "listing",
      },
    },
    { $unwind: "$listing" },

    {
      $match: {
        "listing.sellerId": sellerObjectId,
      },
    },

    {
      $lookup: {
        from: "products",
        localField: "listing.productId",
        foreignField: "_id",
        as: "product",
      },
    },
    { $unwind: "$product" },

    {
      $project: {
        _id: "$items._id", // 🔥 unique per row (CRITICAL FIX)
        orderId: "$_id",
        productName: "$product.title",
        status: "$items.fulfillmentStatus",
        amount: {
          $multiply: ["$items.price", "$items.quantity"],
        },
        date: "$createdAt",
      },
    },

    { $sort: { date: -1 } },

    { $limit: 10 },
  ]);
};
