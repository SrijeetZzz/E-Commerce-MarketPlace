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

module.exports = {
  create,
  getAll,
};