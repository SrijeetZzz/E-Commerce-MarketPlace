// src/modules/products/product.controller.js

const productService = require("./product.service");

const create = async (req, res) => {
  try {
    const adminId = req.user.id;

    const product = await productService.createProduct(adminId, req.body);

    res.status(201).json({
      message: "Product created",
      data: product,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

const getAll = async (req, res) => {
  try {
    const products = await productService.getAllProducts();

    res.status(200).json({
      data: products,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};
const getById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await productService.getProductById(id);

    res.status(200).json({
      data: product,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

const searchProducts = async (req, res) => {
  try {
    const {
      q,
      minPrice,
      maxPrice,
      categoryId,
      subCategoryId,
      page,
      limit,
      sortBy,
    } = req.query;

    const data = await productService.searchProducts({
      q,
      minPrice,
      maxPrice,
      categoryId,
      subCategoryId,
      page,
      limit,
      sortBy,
    });

    res.json({
      success: true,
      ...data, // includes data + pagination
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Failed to search products",
    });
  }
};
module.exports = {
  create,
  getAll,
  searchProducts,
  getById,
};
