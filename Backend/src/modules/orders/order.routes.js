// src/modules/orders/order.routes.js

const express = require("express");
const router = express.Router();

const orderController = require("./order.controller");
const authMiddleware = require("../../shared/middlewares/auth.middleware");

router.use(authMiddleware);

router.post("/checkout", orderController.checkout);

module.exports = router;