// src/shared/cron/orderTimeout.job.js

const cron = require("node-cron");
const Order = require("../../modules/orders/order.model");
const inventoryService = require("../../modules/inventory/inventory.service");

const startOrderTimeoutJob = () => {
  // run every 1 minute
  cron.schedule("* * * * *", async () => {
    try {
      console.log("Running order timeout job...");

      const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);

      const expiredOrders = await Order.find({
        status: "PLACED",
        createdAt: { $lte: tenMinutesAgo },
      });

      for (const order of expiredOrders) {
        // 🔥 release stock
        for (const item of order.items) {
          await inventoryService.releaseStock(
            item.listingId,
            item.quantity
          );
        }

        order.status = "CANCELLED";
        await order.save();

        console.log(`Order ${order._id} cancelled due to timeout`);
      }

    } catch (error) {
      console.error("Timeout job error:", error.message);
    }
  });
};

module.exports = startOrderTimeoutJob;