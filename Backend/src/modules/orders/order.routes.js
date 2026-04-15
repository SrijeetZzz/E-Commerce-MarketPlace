// src/modules/orders/order.routes.js

const express = require("express");
const router = express.Router();

const orderController = require("./order.controller");
const authMiddleware = require("../../shared/middlewares/auth.middleware");

router.use(authMiddleware);

router.post("/checkout", orderController.checkout);
router.post("/orders/:id/payment", orderController.processPayment);
router.get("/orders", orderController.getMyOrders);
router.get("/orders/:id", orderController.getOrderById);

module.exports = router;