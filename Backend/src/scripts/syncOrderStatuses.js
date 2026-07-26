const mongoose = require("mongoose");
const Order = require("../modules/orders/order.model"); 
require("dotenv").config();

async function syncOrderStatuses() {
  await mongoose.connect(process.env.MONGO_URI);

  const orders = await Order.find({});

  let updated = 0;

  for (const order of orders) {
    const oldStatus = order.status;

    if (
      order.items.every(
        (item) => item.fulfillmentStatus === "DELIVERED"
      )
    ) {
      order.status = "DELIVERED";
    } else if (
      order.items.every((item) =>
        ["SHIPPED", "DELIVERED"].includes(item.fulfillmentStatus)
      )
    ) {
      order.status = "SHIPPED";
    } else if (order.status !== "CANCELLED") {
      order.status = "CONFIRMED";
    }

    if (order.status !== oldStatus) {
      await order.save();
      updated++;

      console.log(
        `${order._id}: ${oldStatus} -> ${order.status}`
      );
    }
  }

  console.log(`Updated ${updated} orders`);

  await mongoose.disconnect();
}

syncOrderStatuses()
  .then(() => {
    console.log("Done");
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });