const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    listingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductListing",
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    fulfillmentStatus: {
      type: String,
      enum: [
        "NEW",
        "PACKING",
        "SHIPPED",
        "DELIVERED",
        "RETURN_REQUESTED"
      ],
      default: "NEW"
    },
    trackingId: {
      type: String,
      default: null
    },
    shippedAt: {
      type: Date,
      default: null
    },
    deliveredAt: {
      type: Date,
      default: null
    }
  },
  {
    _id: true
  }
);

const orderSchema = new mongoose.Schema(
  {
    buyerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    totalAmount: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: [
        "PLACED",
        "CONFIRMED",
        "CANCELLED"
      ],
      default: "PLACED"
    },
    address: {
      fullName: String,
      phone: String,
      street: String,
      city: String,
      state: String,
      pincode: String
    },
    items: [orderItemSchema]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Order", orderSchema);