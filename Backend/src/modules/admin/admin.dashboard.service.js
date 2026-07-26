const User = require("../auth/auth.model");
const Product = require("../products/product.model");
const Listing = require("../listings/listing.model");
const Order = require("../orders/order.model");
const SellerApplication = require("../sellers/seller.model");

const getDashboardStats = async () => {
  const [
    totalUsers,
    totalProducts,
    totalOrders,
    totalSellers,
    pendingKyc,
    revenueResult,
  ] = await Promise.all([
    User.countDocuments({ role: "BUYER" }),

    Product.countDocuments(),

    Order.countDocuments(),

    User.countDocuments({ role: "SELLER" }),

    SellerApplication.countDocuments({
      status: "PENDING",
    }),

    Order.aggregate([
      {
        $match: {
          status: {
            $in: ["DELIVERED", "CONFIRMED"],
          },
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: "$totalAmount",
          },
        },
      },
    ]),
  ]);

  return {
    totalUsers,
    totalSellers,
    totalProducts,
    totalOrders,
    totalRevenue: revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0,
    pendingKyc,
  };
};

//==========analytics=================//

const getStartDate = (range) => {
  const date = new Date();

  switch (range) {
    case "7d":
      date.setDate(date.getDate() - 7);
      break;
    case "30d":
      date.setDate(date.getDate() - 30);
      break;
    case "6m":
      date.setMonth(date.getMonth() - 6);
      break;
    case "1y":
      date.setFullYear(date.getFullYear() - 1);
      break;
    default:
      date.setDate(date.getDate() - 30);
  }

  return date;
};

const getDashboardAnalytics = async (range = "30d") => {
  const startDate = getStartDate(range);

  const dateFormat = range === "6m" || range === "1y" ? "%Y-%m" : "%Y-%m-%d";

  const [revenueTrend, orderStatus, categorySales, userGrowth] =
    await Promise.all([
      // Revenue Trend
      Order.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate },
            status: {
              $in: ["CONFIRMED", "DELIVERED"],
            },
          },
        },
        {
          $group: {
            _id: {
              $dateToString: {
                format: dateFormat,
                date: "$createdAt",
              },
            },
            revenue: {
              $sum: "$totalAmount",
            },
            orders: {
              $sum: 1,
            },
          },
        },
        {
          $project: {
            _id: 0,
            date: "$_id",
            revenue: 1,
            orders: 1,
          },
        },
        {
          $sort: {
            date: 1,
          },
        },
      ]),

      // Order Status Breakdown
      Order.aggregate([
        {
          $group: {
            _id: "$status",
            value: {
              $sum: 1,
            },
          },
        },
        {
          $project: {
            _id: 0,
            status: "$_id",
            value: 1,
          },
        },
      ]),

      // Top 5 Subcategory Sales
      Order.aggregate([
        {
          $match: {
            createdAt: {
              $gte: startDate,
            },
            status: {
              $in: ["CONFIRMED", "DELIVERED"],
            },
          },
        },

        {
          $unwind: "$items",
        },

        {
          $lookup: {
            from: "productlistings",
            localField: "items.listingId",
            foreignField: "_id",
            as: "listing",
          },
        },

        {
          $unwind: "$listing",
        },

        {
          $lookup: {
            from: "products",
            localField: "listing.productId",
            foreignField: "_id",
            as: "product",
          },
        },

        {
          $unwind: "$product",
        },

        {
          $lookup: {
            from: "subcategories",
            localField: "product.subCategoryId",
            foreignField: "_id",
            as: "subCategory",
          },
        },

        {
          $unwind: "$subCategory",
        },

        {
          $group: {
            _id: "$subCategory._id",

            category: {
              $first: "$subCategory.name",
            },

            totalSold: {
              $sum: "$items.quantity",
            },

            revenue: {
              $sum: {
                $multiply: ["$items.quantity", "$items.price"],
              },
            },
          },
        },

        {
          $project: {
            _id: 0,
            category: 1,
            totalSold: 1,
            revenue: 1,
          },
        },

        {
          $sort: {
            revenue: -1,
          },
        },

        {
          $limit: 5,
        },
      ]),

      // User Growth
      User.aggregate([
        {
          $match: {
            createdAt: {
              $gte: startDate,
            },
          },
        },

        {
          $group: {
            _id: {
              $dateToString: {
                format: dateFormat,
                date: "$createdAt",
              },
            },

            users: {
              $sum: 1,
            },
          },
        },

        {
          $project: {
            _id: 0,
            date: "$_id",
            users: 1,
          },
        },

        {
          $sort: {
            date: 1,
          },
        },
      ]),
    ]);

  return {
    revenueTrend,
    orderStatus,
    categorySales,
    userGrowth,
  };
};

//=======================Tables=====================//
const getDashboardTables = async (range = "30d") => {
  const startDate = getStartDate(range);

  const [
    recentOrders,
    recentUsers,
    topProducts,
    topSellers,
    lowStockProducts,
  ] = await Promise.all([
    // Recent Orders
    Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
        },
      },
      { $sort: { createdAt: -1 } },
      { $limit: 10 },

      {
        $lookup: {
          from: "users",
          localField: "buyerId",
          foreignField: "_id",
          as: "buyer",
        },
      },
      {
        $unwind: {
          path: "$buyer",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 1,
          buyerName: "$buyer.name",
          buyerEmail: "$buyer.email",
          totalAmount: 1,
          status: 1,
          totalItems: { $size: "$items" },
          createdAt: 1,
        },
      },
    ]),

    // Recent Users
    User.find(
      {
        createdAt: {
          $gte: startDate,
        },
      },
      {
        password: 0,
        refreshToken: 0,
      }
    )
      .sort({ createdAt: -1 })
      .limit(10)
      .lean(),

    // Top Products
    Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          status: {
            $in: ["CONFIRMED", "DELIVERED"],
          },
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
        $lookup: {
          from: "products",
          localField: "listing.productId",
          foreignField: "_id",
          as: "product",
        },
      },

      { $unwind: "$product" },

      {
        $group: {
          _id: "$product._id",

          title: {
            $first: "$product.title",
          },

          image: {
            $first: {
              $arrayElemAt: ["$product.images", 0],
            },
          },

          totalSold: {
            $sum: "$items.quantity",
          },

          revenue: {
            $sum: {
              $multiply: [
                "$items.quantity",
                "$items.price",
              ],
            },
          },
        },
      },

      { $sort: { totalSold: -1 } },
      { $limit: 5 },

      {
        $project: {
          _id: 1,
          title: 1,
          image: 1,
          totalSold: 1,
          revenue: 1,
        },
      },
    ]),

    // Top Sellers
    Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          status: {
            $in: ["CONFIRMED", "DELIVERED"],
          },
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
        $lookup: {
          from: "sellerapplications",
          localField: "listing.sellerId",
          foreignField: "userId",
          as: "seller",
        },
      },

      { $unwind: "$seller" },

      {
        $group: {
          _id: "$listing.sellerId",

          businessName: {
            $first: "$seller.businessName",
          },

          orders: {
            $sum: 1,
          },

          revenue: {
            $sum: {
              $multiply: [
                "$items.quantity",
                "$items.price",
              ],
            },
          },
        },
      },

      { $sort: { revenue: -1 } },
      { $limit: 5 },

      {
        $project: {
          _id: 1,
          businessName: 1,
          orders: 1,
          revenue: 1,
        },
      },
    ]),

    // Low Stock Listings (always current)
    Listing.aggregate([
      {
        $match: {
          status: "ACTIVE",
          stock: {
            $lte: 10,
          },
        },
      },

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
        $lookup: {
          from: "sellerapplications",
          localField: "sellerId",
          foreignField: "userId",
          as: "seller",
        },
      },

      {
        $unwind: {
          path: "$seller",
          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $project: {
          _id: 1,
          title: "$product.title",
          seller: "$seller.businessName",
          stock: 1,
          price: 1,
        },
      },

      { $sort: { stock: 1 } },
      { $limit: 10 },
    ]),
  ]);

  return {
    recentOrders,
    recentUsers,
    topProducts,
    topSellers,
    lowStockProducts,
  };
};

module.exports = {
  getDashboardStats,
  getDashboardAnalytics,
  getDashboardTables,
};
