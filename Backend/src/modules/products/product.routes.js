// src/modules/products/product.routes.js

const express = require("express");
const router = express.Router();

const productController = require("./product.controller");
const authMiddleware = require("../../shared/middlewares/auth.middleware");
const authorizeRoles = require("../../shared/middlewares/role.middleware");
const upload = require("../../shared/utils/multer");

router.get("/search", productController.searchProducts);

// admin only
router.post(
  "/",
  authMiddleware,
  authorizeRoles("ADMIN"),
  upload.array("images", 5),
  productController.create,
);
router.get(
  "/",
  authMiddleware,
  authorizeRoles("ADMIN"),
  productController.getAll,
);

router.post(
  "/bulk",
  authMiddleware,
  authorizeRoles("ADMIN"),
  productController.createBulk,
);

router.patch(
  "/:id",
  authMiddleware,
  authorizeRoles("ADMIN"),
  upload.array("images", 5), // if updating images together
  productController.update,
);

router.delete(
  "/:id",
  authMiddleware,
  authorizeRoles("ADMIN"),
  productController.remove,
);


router.get(
  "/catalog",
  authMiddleware,
  authorizeRoles("SELLER"),
  productController.getCatalog,
);

router.get("/:id", productController.getById);

router.patch(
  "/:id/images",
  upload.array("images", 5),
  productController.updateImages,
);

module.exports = router;
