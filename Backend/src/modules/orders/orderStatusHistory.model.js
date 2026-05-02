const mongoose = require("mongoose");

const orderStatusHistorySchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },

    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true, // refers to item._id inside order.items
    },

    status: {
      type: String,
      enum: ["NEW", "PACKING", "SHIPPED", "DELIVERED"],
      required: true,
    },

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "OrderStatusHistory",
  orderStatusHistorySchema
);