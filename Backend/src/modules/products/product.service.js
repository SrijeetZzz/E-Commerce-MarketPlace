// src/modules/products/product.service.js

const Product = require("./product.model");

const createProduct = async (adminId, data) => {
  const {
    title,
    description,
    brand,
    category,
    images,
    attributes,
    tags,
    priceRange,
  } = data;

  // 🔥 manual validation (important)
  if (!title) {
    throw new Error("Title is required");
  }

  if (!priceRange || priceRange.min == null || priceRange.max == null) {
    throw new Error("Price range is required");
  }

  if (priceRange.max < priceRange.min) {
    throw new Error("Max price must be greater than min price");
  }

  const product = await Product.create({
    title,
    description,
    brand,
    category,
    images,
    attributes,
    tags,
    priceRange,
    createdBy: adminId,
  });

  return product;
};

const getAllProducts = async () => {
  return await Product.find();
};

module.exports = {
  createProduct,
  getAllProducts,
};