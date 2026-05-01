// src/modules/products/product.service.js

const Product = require("./product.model");
const productRepository = require("./product.repository");
const Category = require("../categories/category.model");
const SubCategory = require("../categories/subcategory.model");
const Listing = require("../listings/listing.model");

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

const getProductById = async (productId) => {
  // 🔍 Validate ID (basic safety)
  if (!productId) {
    throw new Error("Product ID is required");
  }

  // 🧱 Get product
  const product = await Product.findById(productId).lean();

  if (!product) {
    throw new Error("Product not found");
  }

  // 🛒 Get active listings (VERY IMPORTANT)
  const listings = await Listing.find({
    productId,
    status: "ACTIVE",
  })
    .populate("sellerId", "name") // optional but useful
    .lean();

  // 🧠 Attach sellerName (clean frontend data)
  const formattedListings = listings.map((l) => ({
    _id: l._id,
    price: l.price,
    stock: l.stock,
    sellerName: l.sellerId?.name || "Seller",
  }));

  return {
    ...product,
    listings: formattedListings,
  };
};

const getAllProducts = async () => {
  return await Product.find();
};
const searchProducts = async (filters) => {
  return await productRepository.getGroupedProducts(filters);
};
const createBulkProducts = async (adminId, productsData) => {
  if (!Array.isArray(productsData) || productsData.length === 0) {
    throw new Error("Invalid products data");
  }

  const results = [];

  for (const data of productsData) {
    try {
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

      // 🔥 validations (reuse logic)
      if (!title) throw new Error("Title is required");
      if (!categoryId || !subCategoryId)
        throw new Error("Category and SubCategory required");

      if (!priceRange || priceRange.min == null || priceRange.max == null)
        throw new Error("Price range required");

      if (priceRange.max < priceRange.min)
        throw new Error("Invalid price range");

      const category = await Category.findById(categoryId);
      if (!category) throw new Error("Invalid category");

      const subCategory = await SubCategory.findById(subCategoryId);
      if (!subCategory) throw new Error("Invalid subcategory");

      if (subCategory.categoryId.toString() !== categoryId)
        throw new Error("Subcategory mismatch");

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

      results.push(product);
    } catch (err) {
      results.push({
        ...data,
        status: "FAILED",
        reason: err.message,
      });
    }
  }

  return results;
};
const addProductImages = async (productId, imageUrls) => {
  const product = await Product.findById(productId);

  if (!product) {
    throw new Error("Product not found");
  }

  // append images (not overwrite)
  product.images = [...(product.images || []), ...imageUrls];

  await product.save();

  return product;
};
const getProductCatalog = async (filters) => {
  return await productRepository.getProductCatalog(filters);
};
module.exports = {
  createProduct,
  getAllProducts,
  searchProducts,
  getProductById,
  createBulkProducts,
  addProductImages,
  getProductCatalog,
};
