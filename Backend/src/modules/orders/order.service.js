const Cart = require("../cart/cart.model");
const Listing = require("../listings/listing.model");
const Order = require("./order.model");
const inventoryService = require("../inventory/inventory.service");

const checkout = async (userId) => {
  const cart = await Cart.findOne({ userId });

  if (!cart || cart.items.length === 0) {
    throw new Error("Cart is empty");
  }

  let totalAmount = 0;
  const orderItems = [];
  const reservedItems = []; // 🔥 track reservations

  try {
    // 🔥 VALIDATE + RESERVE
    for (const item of cart.items) {
      const listing = await Listing.findById(item.listingId);

      if (!listing || listing.status !== "ACTIVE") {
        throw new Error("Listing not available");
      }

      if (listing.price !== item.priceAtAdd) {
        throw new Error("Price changed, please update cart");
      }

      // 🔥 RESERVE
      await inventoryService.reserveStock(
        listing._id,
        item.quantity
      );

      // track for rollback
      reservedItems.push({
        listingId: listing._id,
        quantity: item.quantity,
      });

      totalAmount += listing.price * item.quantity;

      orderItems.push({
        listingId: listing._id,
        quantity: item.quantity,
        price: listing.price,
      });
    }

    // 🔥 CREATE ORDER
    const order = await Order.create({
      buyerId: userId,
      totalAmount,
      items: orderItems,
    });

    // 🔥 CLEAR CART
    cart.items = [];
    await cart.save();

    return order;

  } catch (error) {
    // 🔥 ROLLBACK RESERVED STOCK
    for (const item of reservedItems) {
      await inventoryService.releaseStock(
        item.listingId,
        item.quantity
      );
    }

    throw error;
  }
};
const processPayment = async (orderId, isSuccess) => {
  const order = await Order.findById(orderId);

  if (!order) throw new Error("Order not found");

  if (order.status !== "PLACED") {
    throw new Error("Order already processed");
  }

  try {
    if (isSuccess) {
      // ✅ CONFIRM STOCK
      for (const item of order.items) {
        await inventoryService.confirmStock(
          item.listingId,
          item.quantity
        );
      }

      order.status = "CONFIRMED";

    } else {
      // ❌ RELEASE STOCK
      for (const item of order.items) {
        await inventoryService.releaseStock(
          item.listingId,
          item.quantity
        );
      }

      order.status = "CANCELLED";
    }

    await order.save();

    return order;

  } catch (error) {
    throw error;
  }
};

module.exports = {
  checkout,
   processPayment,
};