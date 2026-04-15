// src/modules/products/product.model.js

const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },

  description: {
    type: String,
  },

  brand: {
    type: String,
  },

  category: {
    type: String,
    index: true,
  },

  images: {
    type: [String],
    default: [],
  },

  attributes: {
    type: Object,
    default: {},
  },

  tags: {
    type: [String],
    default: [],
  },

  priceRange: {
    min: {
      type: Number,
      required: true,
    },
    max: {
      type: Number,
      required: true,
    },
  },

  avgRating: {
    type: Number,
    default: 0,
  },

  totalReviews: {
    type: Number,
    default: 0,
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);