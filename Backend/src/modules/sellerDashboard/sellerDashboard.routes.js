const express = require("express");
const router = express.Router();
const controller = require("./sellerDashboard.controller");
const auth = require("../../shared/middlewares/auth.middleware");
const authorizeRoles = require("../../shared/middlewares/role.middleware");

router.get(
  "/summary",
  auth,
  authorizeRoles("SELLER"),
  controller.getSummary
);
router.get(
  "/orders-over-time",
  auth,
  authorizeRoles("SELLER"),
  controller.getOrdersOverTime
);
router.get(
  "/revenue-over-time",
  auth,
  authorizeRoles("SELLER"),
  controller.getRevenueOverTime
);
router.get(
  "/top-products",
  auth,
  authorizeRoles("SELLER"),
  controller.getTopProducts
);
router.get(
  "/recent-orders",
  auth,
  authorizeRoles("SELLER"),
  controller.getRecentOrders
);

module.exports = router;