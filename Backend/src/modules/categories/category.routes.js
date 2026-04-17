const express = require("express");
const router = express.Router();

const categoryController = require("./category.controller");
const subController = require("./subcategory.controller");

const authMiddleware = require("../../shared/middlewares/auth.middleware");
const authorizeRoles = require("../../shared/middlewares/role.middleware");

router.get("/", categoryController.getCategories);
router.get("/subcategories", categoryController.getSubCategories);

router.post(
  "/",
  authMiddleware,
  authorizeRoles("ADMIN"),
  categoryController.createCategory
);

router.patch(
  "/:id",
  authMiddleware,
  authorizeRoles("ADMIN"),
  categoryController.updateCategory
);

router.delete(
  "/:id",
  authMiddleware,
  authorizeRoles("ADMIN"),
  categoryController.deleteCategory
);

router.post(
  "/subcategories",
  authMiddleware,
  authorizeRoles("ADMIN"),
  subController.createSubCategory
);

router.patch(
  "/subcategories/:id",
  authMiddleware,
  authorizeRoles("ADMIN"),
  subController.updateSubCategory
);

router.delete(
  "/subcategories/:id",
  authMiddleware,
  authorizeRoles("ADMIN"),
  subController.deleteSubCategory
);

module.exports = router;