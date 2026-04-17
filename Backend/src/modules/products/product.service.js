// src/modules/products/product.service.js

const Product = require("./product.model");
const productRepository = require("./product.repository");

const Category = require("../categories/category.model");
const SubCategory = require("../categories/subcategory.model");

const createProduct = async (adminId, data) => {
  const {
    title,
    description,
    brand,
    categoryId,
    subCategoryId,
    images,
    attributes,
    tags,
    priceRange,
  } = data;

  if (!title) {
    throw new Error("Title is required");
  }

  if (!categoryId || !subCategoryId) {
    throw new Error("Category and SubCategory are required");
  }

  if (!priceRange || priceRange.min == null || priceRange.max == null) {
    throw new Error("Price range is required");
  }

  if (priceRange.max < priceRange.min) {
    throw new Error("Max price must be greater than min price");
  }

  const category = await Category.findById(categoryId);
  if (!category) {
    throw new Error("Invalid category");
  }

  const subCategory = await SubCategory.findById(subCategoryId);
  if (!subCategory) {
    throw new Error("Invalid subcategory");
  }

  if (subCategory.categoryId.toString() !== categoryId) {
    throw new Error("Subcategory does not belong to category");
  }

  const product = await Product.create({
    title,
    description,
    brand,
    categoryId,
    subCategoryId,
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
const searchProducts = async (filters) => {
  return await productRepository.getGroupedProducts(filters);
};

module.exports = {
  createProduct,
  getAllProducts,
  searchProducts,
};