const express = require("express");
const router = express.Router();

const orderController = require("./order.controller");

const authMiddleware = require("../../shared/middlewares/auth.middleware");

const authorizeRoles = require("../../shared/middlewares/role.middleware");

router.use(authMiddleware);

/* -------------------------
BUYER ROUTES
-------------------------- */

router.post("/checkout", orderController.checkout);

router.post("/:id/payment", orderController.processPayment);

router.get("/", orderController.getMyOrders);

/* -------------------------
SELLER ROUTES
IMPORTANT:
keep these BEFORE /:id
-------------------------- */

router.get(
  "/seller/orders",
  authorizeRoles("SELLER"),
  orderController.getSellerOrders,
);

router.patch(
  "/seller/orders/:orderId/items/:itemId/status",
  authorizeRoles("SELLER"),
  orderController.updateOrderItemStatus,
);
router.get(
  "/seller/orders/:orderId/items/:itemId/timeline",
  authorizeRoles("SELLER"),
  orderController.getOrderItemTimeline,
);
/* -------------------------
SINGLE ORDER
MUST STAY LAST
-------------------------- */

router.get("/:id", orderController.getOrderById);

module.exports = router;
