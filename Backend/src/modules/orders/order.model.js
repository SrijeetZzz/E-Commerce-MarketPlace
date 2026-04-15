// src/modules/orders/order.model.js

const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  buyerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  totalAmount: {
    type: Number,
    required: true,
  },

  status: {
    type: String,
    enum: ["PLACED", "CONFIRMED", "CANCELLED"],
    default: "PLACED",
  },

  items: [
    {
      listingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ProductListing",
      },
      quantity: Number,
      price: Number,
    },
  ],

}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);
