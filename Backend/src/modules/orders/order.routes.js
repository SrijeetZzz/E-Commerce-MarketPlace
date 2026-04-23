
const express = require("express");
const router = express.Router();

const orderController = require("./order.controller");
const authMiddleware = require("../../shared/middlewares/auth.middleware");

router.use(authMiddleware);

router.post("/checkout", orderController.checkout);
router.post("/:id/payment", orderController.processPayment);
router.get("/", orderController.getMyOrders);
router.get("/:id", orderController.getOrderById);

module.exports = router;