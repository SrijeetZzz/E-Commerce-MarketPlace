// src/modules/products/product.routes.js

const express = require("express");
const router = express.Router();

const productController = require("./product.controller");
const authMiddleware = require("../../shared/middlewares/auth.middleware");
const authorizeRoles = require("../../shared/middlewares/role.middleware");


router.get("/search", productController.searchProducts);

// admin only
router.post(
  "/",
  authMiddleware,
  authorizeRoles("ADMIN"),
  productController.create
);

router.get(
  "/",
  authMiddleware,
  authorizeRoles("ADMIN"),
  productController.getAll
);
router.get("/:id", productController.getById);


module.exports = router;