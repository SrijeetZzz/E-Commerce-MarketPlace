const Cart = require("../cart/cart.model");
const Listing = require("../listings/listing.model");
const Order = require("./order.model");
const inventoryService = require("../inventory/inventory.service");
const OrderStatusHistory = require("./orderStatusHistory.model");

/* -----------------------------------
HELPERS
----------------------------------- */

const generateTrackingId = () => {
  return "TRK-" + Date.now() + "-" + Math.floor(1000 + Math.random() * 9000);
};

/* -----------------------------------
BUYER CHECKOUT
----------------------------------- */

const checkout = async (userId, address) => {
  const cart = await Cart.findOne({ userId });

  if (!cart || cart.items.length === 0) {
    throw new Error("Cart is empty");
  }

  let totalAmount = 0;

  const orderItems = [];
  const reservedItems = [];

  try {
    for (const item of cart.items) {
      const listing = await Listing.findById(item.listingId);

      if (!listing || listing.status !== "ACTIVE") {
        throw new Error("Listing not available");
      }

      if (listing.price !== item.priceAtAdd) {
        throw new Error("Price changed, please update cart");
      }

      // reserve stock
      await inventoryService.reserveStock(listing._id, item.quantity);

      reservedItems.push({
        listingId: listing._id,
        quantity: item.quantity,
      });

      totalAmount += listing.price * item.quantity;

      orderItems.push({
        listingId: listing._id,
        quantity: item.quantity,
        price: listing.price,

        // NEW seller fulfillment fields
        fulfillmentStatus: "NEW",
        trackingId: null,
        shippedAt: null,
        deliveredAt: null,
      });
    }

    const order = await Order.create({
      buyerId: userId,
      totalAmount,
      items: orderItems,
      address,
    });
    // 🔥 CREATE INITIAL TIMELINE (VERY IMPORTANT)
    for (const item of order.items) {
      await OrderStatusHistory.create({
        orderId: order._id,
        itemId: item._id,
        status: "NEW",
        updatedBy: userId,
      });
    }

    // clear cart
    cart.items = [];
    await cart.save();

    return order;
  } catch (error) {
    // rollback reservations
    for (const item of reservedItems) {
      await inventoryService.releaseStock(item.listingId, item.quantity);
    }

    throw error;
  }
};

/* -----------------------------------
PAYMENT PROCESSING
----------------------------------- */

const processPayment = async (orderId, isSuccess) => {
  const order = await Order.findById(orderId);

  if (!order) {
    throw new Error("Order not found");
  }

  if (order.status !== "PLACED") {
    throw new Error("Order already processed");
  }

  try {
    if (isSuccess) {
      for (const item of order.items) {
        await inventoryService.confirmStock(item.listingId, item.quantity);
      }

      order.status = "CONFIRMED";
    } else {
      for (const item of order.items) {
        await inventoryService.releaseStock(item.listingId, item.quantity);
      }

      order.status = "CANCELLED";
    }

    await order.save();

    return order;
  } catch (error) {
    throw error;
  }
};

/* -----------------------------------
BUYER ORDERS
----------------------------------- */

const getMyOrders = async (userId) => {
  return await Order.find({
    buyerId: userId,
  })
    .populate({
      path: "items.listingId",
      populate: {
        path: "productId",
        select: "title images",
      },
    })
    .sort({
      createdAt: -1,
    });
};

const getOrderById = async (userId, orderId) => {
  const order = await Order.findOne({
    _id: orderId,
    buyerId: userId,
  }).populate({
    path: "items.listingId",
    populate: {
      path: "productId",
      select: "title images",
    },
  });

  if (!order) {
    throw new Error("Order not found");
  }

  return order;
};

/* -----------------------------------
SELLER ORDERS
----------------------------------- */
const getSellerOrders = async (sellerId, query = {}) => {
  let {
    page = 1,
    limit = 10,
    fulfillmentStatus,
    orderStatus,
    sort = "newest",
    dateFrom,
    dateTo,
  } = query;

  page = Number(page);
  limit = Number(limit);

  /* =========================
Fetch Orders
========================= */

  let orders = await Order.find({})
    .populate({
      path: "buyerId",
      select: "name email",
    })
    .populate({
      path: "items.listingId",
      populate: {
        path: "productId",
        select: "title images",
      },
    });

  /* =========================
Keep seller-owned items only
(multiseller safe)
========================= */

  orders = orders
    .map((order) => {
      const sellerItems = order.items.filter(
        (item) => item.listingId?.sellerId?.toString() === sellerId,
      );

      const sellerAmount = sellerItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      );

      return {
        ...order.toObject(),
        items: sellerItems,
        sellerAmount,
      };
    })
    .filter((order) => order.items.length > 0);

  /* =========================
Order-level filters
========================= */

  if (orderStatus) {
    orders = orders.filter((order) => order.status === orderStatus);
  }

  if (dateFrom) {
    const from = new Date(dateFrom);

    orders = orders.filter((order) => new Date(order.createdAt) >= from);
  }

  if (dateTo) {
    const to = new Date(dateTo);

    orders = orders.filter((order) => new Date(order.createdAt) <= to);
  }

  /* =========================
GLOBAL COUNTS
(before tab filter)
========================= */

  const allItems = orders.flatMap((o) => o.items);

  const counts = {
    NEW: allItems.filter((i) => i.fulfillmentStatus === "NEW").length,

    PACKING: allItems.filter((i) => i.fulfillmentStatus === "PACKING").length,

    SHIPPED: allItems.filter((i) => i.fulfillmentStatus === "SHIPPED").length,

    DELIVERED: allItems.filter((i) => i.fulfillmentStatus === "DELIVERED")
      .length,
  };

  /* =========================
Tab fulfillment filter
(filter actual line items)
========================= */

  if (fulfillmentStatus) {
    orders = orders
      .map((order) => ({
        ...order,

        items: order.items.filter(
          (item) => item.fulfillmentStatus === fulfillmentStatus,
        ),
      }))
      .filter((order) => order.items.length > 0);
  }

  /* =========================
Sorting
========================= */

  switch (sort) {
    case "oldest":
      orders.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

      break;

    case "amountHigh":
      orders.sort((a, b) => b.sellerAmount - a.sellerAmount);

      break;

    case "amountLow":
      orders.sort((a, b) => a.sellerAmount - b.sellerAmount);

      break;

    default:
      orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  /* =========================
Pagination
========================= */

  const total = orders.length;

  const start = (page - 1) * limit;

  const paginated = orders.slice(start, start + limit);

  return {
    data: paginated,

    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },

    counts,
  };
};
/* -----------------------------------
SELLER UPDATE ITEM STATUS
----------------------------------- */

const updateOrderItemStatus = async (sellerId, orderId, itemId, newStatus) => {
  const allowedStatuses = ["NEW", "PACKING", "SHIPPED", "DELIVERED"];

  if (!allowedStatuses.includes(newStatus)) {
    throw new Error("Invalid status");
  }

  const order = await Order.findById(orderId).populate({
    path: "items.listingId",
    select: "sellerId productId price stock",
  });

  if (!order) {
    throw new Error("Order not found");
  }

  const item = order.items.id(itemId);

  if (!item) {
    throw new Error("Order item not found");
  }

  if (item.listingId.sellerId.toString() !== sellerId) {
    throw new Error("Unauthorized");
  }

  // progression rules
  const flow = {
    NEW: 1,
    PACKING: 2,
    SHIPPED: 3,
    DELIVERED: 4,
  };

  if (flow[newStatus] < flow[item.fulfillmentStatus]) {
    throw new Error("Cannot move backwards");
  }

  if (flow[newStatus] > flow[item.fulfillmentStatus] + 1) {
    throw new Error("Invalid status progression");
  }

  item.fulfillmentStatus = newStatus;
  await OrderStatusHistory.create({
    orderId: order._id,
    itemId: item._id,
    status: newStatus,
    updatedBy: sellerId,
  });

  if (newStatus === "SHIPPED" && !item.trackingId) {
    item.trackingId = generateTrackingId();

    item.shippedAt = new Date();
  }

  if (newStatus === "DELIVERED") {
    item.deliveredAt = new Date();
  }

  await order.save();

  return order;
};

module.exports = {
  checkout,
  processPayment,

  getMyOrders,
  getOrderById,

  getSellerOrders,
  updateOrderItemStatus,
};
