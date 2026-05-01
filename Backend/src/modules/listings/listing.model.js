// src/modules/listings/listing.model.js

const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
    index: true,
  },

  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },

  price: {
    type: Number,
    required: true,
  },

  stock: {
    type: Number,
    required: true,
  },

  reservedStock: {
    type: Number,
    default: 0,
  },

  status: {
    type: String,
    enum: ["ACTIVE", "PENDING_APPROVAL", "REJECTED","PAUSED"],
    default: "PENDING_APPROVAL",
  },

  approvalReason: String,

}, { timestamps: true });

module.exports = mongoose.model("ProductListing", listingSchema);