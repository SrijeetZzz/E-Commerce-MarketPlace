const express = require("express");
const router = express.Router();

const sellerController = require("./seller.controller");
const authMiddleware = require("../../shared/middlewares/auth.middleware");

// apply as seller
router.post("/application", authMiddleware, sellerController.apply);

// get my application
router.get("/application/me", authMiddleware, sellerController.getMyApplication);

module.exports = router;