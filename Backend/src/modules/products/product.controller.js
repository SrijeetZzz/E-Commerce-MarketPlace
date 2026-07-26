// src/modules/products/product.controller.js

const productService = require("./product.service");

const create = async (req, res) => {
  try {
    const adminId = req.user.id;

    const imageUrls = req.files
      ? req.files.map((file) => `/uploads/${file.filename}`)
      : [];

    const product = await productService.createProduct(adminId, {
      ...req.body,
      images: imageUrls,
    });

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
    const result = await productService.getAllProducts(req.query);

    res.status(200).json({
      success: true,
      ...result,
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

const createBulk = async (req, res) => {
  try {
    const adminId = req.user.id; // from auth
    const products = req.body.products;

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({
        message: "Products array is required",
      });
    }

    const result = await productService.createBulkProducts(adminId, products);

    return res.status(201).json({
      message: "Bulk products processed",
      data: result,
    });
  } catch (err) {
    console.error("Bulk product error:", err);
    return res.status(500).json({
      message: err.message,
    });
  }
};

const updateImages = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No images uploaded",
      });
    }

    const imageUrls = req.files.map((file) => `/uploads/${file.filename}`);

    const updatedProduct = await productService.addProductImages(id, imageUrls);

    res.json({
      success: true,
      message: "Images updated",
      data: updatedProduct,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
const getCatalog = async (req, res) => {
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

    const data = await productService.getProductCatalog({
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
      ...data,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch catalog",
    });
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await productService.updateProduct(id, req.body);

    res.json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;

    await productService.deleteProduct(id);

    res.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = {
  create,
  getAll,
  searchProducts,
  getById,
  createBulk,
  updateImages,
  getCatalog,
  update,
  remove,
};
